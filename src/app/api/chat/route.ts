import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const SYSTEM_PROMPT = `Você é o Assistente Patrimonial, uma IA especializada em planejamento financeiro pessoal e institucional para clientes de wealth management.

Seu nome é "Advisor", e você trabalha na W1 Consultoria Financeira ao lado do assessor humano do cliente.

Suas diretrizes:
- Responda sempre em português brasileiro
- Seja conciso, direto e útil — evite respostas muito longas
- Forneça insights financeiros baseados nos dados do cliente quando possível
- Mencione o assessor humano como ponto de contato principal para decisões importantes
- Nunca dê conselhos fiscais ou jurídicos formais — sugira consultar profissionais
- Mantenha tom profissional mas acessível

Quando não souber a resposta, seja honesto e sugira entrar em contato com o assessor humano.`;

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { messages, userId } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages são obrigatórias' }, { status: 400 });
    }

    // Load client context if userId provided (client view)
    let clientContext = '';
    if (userId) {
      const client = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          accounts: true,
          goals: { where: { status: 'IN_PROGRESS' } },
          transactions: { orderBy: { date: 'desc' }, take: 20 },
        },
      });
      if (client) {
        const totalAssets = client.accounts
          .filter(a => a.type !== 'CREDIT_CARD')
          .reduce((s, a) => s + Number(a.currentBalance), 0);
        const totalLiabilities = client.accounts
          .filter(a => a.type === 'CREDIT_CARD')
          .reduce((s, a) => s + Number(a.currentBalance), 0);
        clientContext = `\n\nContexto do cliente ${client.name} (${client.email}):
- Patrimônio Líquido: R$ ${(totalAssets - totalLiabilities).toLocaleString('pt-BR')}
- Total Ativos: R$ ${totalAssets.toLocaleString('pt-BR')}
- Total Passivos: R$ ${totalLiabilities.toLocaleString('pt-BR')}
- Metas ativas: ${client.goals.length}
Últimas transações: ${client.transactions.slice(0, 5).map(t => `${t.description} - R$ ${Number(t.amount).toLocaleString('pt-BR')} (${t.type})`).join(', ') || 'Nenhuma recente'}`;
      }
    }

    // Call Anthropic API with streaming
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY not configured');
      return NextResponse.json(
        { error: 'Assistente não configurado no momento. Contate o suporte.' },
        { status: 503 }
      );
    }

    // Build conversation history for Anthropic
    const anthropicMessages = messages.map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    }));

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20250414',
        max_tokens: 512,
        system: SYSTEM_PROMPT + clientContext,
        messages: anthropicMessages,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic API error:', err);
      return NextResponse.json(
        { error: 'Erro ao processar solicitação. Tente novamente mais tarde.' },
        { status: 502 }
      );
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || 'Desculpe, não consegui gerar uma resposta no momento.';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
