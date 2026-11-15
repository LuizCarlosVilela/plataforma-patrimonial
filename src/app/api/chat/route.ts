import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
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
    const token = await getToken({ req: request });
    if (!token?.email) {
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const client: any = await prisma.user.findUnique({ where: { id: userId } });
      if (client) {
        const safeAccounts = client.accounts ?? [];
        const totalAssets = safeAccounts
          .filter((a: any) => a.type !== 'CREDIT_CARD')
          .reduce((s: number, a: any) => s + Number(a.currentBalance), 0);
        const totalLiabilities = safeAccounts
          .filter((a: any) => a.type === 'CREDIT_CARD')
          .reduce((s: number, a: any) => s + Number(a.currentBalance), 0);
        const safeGoals = client.goals ?? [];
        const safeTransactions = client.transactions ?? [];
        clientContext = `\n\nContexto do cliente ${client.name} (${client.email}):
- Patrimônio Líquido: R$ ${(totalAssets - totalLiabilities).toLocaleString('pt-BR')}
- Total Ativos: R$ ${totalAssets.toLocaleString('pt-BR')}
- Total Passivos: R$ ${totalLiabilities.toLocaleString('pt-BR')}
- Metas ativas: ${safeGoals.length}
Últimas transações: ${safeTransactions.slice(0, 5).map((t: any) => `${t.description} - R$ ${Number(t.amount).toLocaleString('pt-BR')} (${t.type})`).join(', ') || 'Nenhuma recente'}`;
      }
    }

    // Call Anthropic API with streaming
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.log('ANTHROPIC_API_KEY not configured - using mock responses');
      // Mock response for testing without API key
      const lastUserMessage = messages[messages.length - 1]?.content || '';
      const mockResponses = [
        `Olá! Sou o assistente virtual da W1 Consultoria Financeira. Posso ajudar com:\n\n• Análise do seu patrimônio atual\n• Orientações sobre suas metas financeiras\n• Sugestões de diversificação\n\nPara decisões importantes, consulte sempre seu assessor humano. Como posso ajudá-lo hoje?`,

        `Entendo sua preocupação. Com base nos dados que temos:\n\n• Seu patrimônio líquido está em R$ ${(Math.random() * 100000 + 50000).toFixed(2)}\n• Você possui ${Math.floor(Math.random() * 3) + 1} metas ativas\n\nRecomendo revisar sua alocação de ativos e conversar com seu assessor sobre ajuste de estratégia.`
      ];

      const reply = lastUserMessage.toLowerCase().includes('ajuda') || lastUserMessage.toLowerCase().includes('help')
        ? mockResponses[0]
        : mockResponses[1];

      return NextResponse.json({ reply });
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
