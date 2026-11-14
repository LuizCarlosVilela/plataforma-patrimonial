# Plataforma Patrimonial

## Descrição
Plataforma para gestão patrimonial com funcionalidades de controle de contas, despesas, receitas e objetivos financeiros.

## Integração com OpenFinance

### Configuração
1. **Atualizações no Schema Prisma**:
   - Adicionado campos `openFinanceItemId` e `lastSyncedAt` na tabela `Account` para sincronização com OpenFinance.

2. **Endpoint de Sincronização**:
   - Endpoint disponível em `/api/openfinance/sync` para sincronizar dados entre a plataforma e o OpenFinance.

### Como Usar
1. **Autenticação**:
   - O endpoint `/api/openfinance/sync` requer um token de autenticação válido.
   - Exemplo de requisição:
     ```bash
     curl -X POST https://plataforma-patrimonial-origin-sigma.vercel.app/api/openfinance/sync \
       -H "Content-Type: application/json" \
       -d '{"token": "seu_token_valido"}'
     ```

2. **Sincronização**:
   - O endpoint atualiza as contas no banco de dados com os dados do OpenFinance.
   - Se uma conta já existir, ela será atualizada com o novo `openFinanceItemId` e `lastSyncedAt`.
   - Se uma conta não existir, ela será criada com os dados do OpenFinance.

### Documentação Técnica
- **Middleware de Autenticação**:
  - Um middleware de autenticação foi criado para validar tokens de autenticação.
  - O middleware está localizado em `/src/middleware/auth.ts`.

- **Testes**:
  - O endpoint foi testado com uma função mock para simular a API do OpenFinance.

## Fluxos de Autenticação

### Login e Cadastro via Gmail
1. **Configuração Inicial**:
   - Utilize o Vercel Auth ou outro provedor de autenticação para integrar o login via Gmail.
   - Configure o provedor de autenticação no painel do Vercel.

2. **Implementação**:
   - Adicione o código de autenticação no arquivo de middleware ou na página de login.
   - Exemplo de configuração:
     ```ts
     // Exemplo de configuração de autenticação com Vercel Auth
     import { auth } from '@clerk/nextjs'
     
     export default function LoginPage() {
       const { userId } = auth()
       // Implementar lógica de login com Gmail
     }
     ```

## Testes de Fluxos de Ponta a Ponta

### Criar Despesas e Receitas
1. **Criar Despesa**:
   - Acesse a página de transações.
   - Selecione a opção de criar despesa.
   - Preencha os campos com os detalhes da despesa.
   - Confirme a criação.

2. **Criar Receita**:
   - Acesse a página de transações.
   - Selecione a opção de criar receita.
   - Preencha os campos com os detalhes da receita.
   - Confirme a criação.

### Criar e Gerenciar Objetivos Financeiros
1. **Criar Objetivo**:
   - Acesse a página de objetivos.
   - Selecione a opção de criar novo objetivo.
   - Preencha os campos com os detalhes do objetivo (título, valor alvo, data alvo, etc.).
   - Confirme a criação.

2. **Gerenciar Objetivos**:
   - Acesse a página de objetivos.
   - Edite ou exclua objetivos conforme necessário.
   - Monitore o progresso dos objetivos.

## Instruções de Deploy

1. **Deploy na Vercel**:
   - Certifique-se de que todas as dependências estão instaladas.
   - Execute o comando `npm run build` para criar a build.
   - Faça o deploy usando o comando `vercel --prod`.

2. **Configurações de Ambiente**:
   - Adicione as variáveis de ambiente necessárias no painel do Vercel.
   - Certifique-se de que o banco de dados está configurado corretamente.

## Dependências

- Prisma: Para gerenciamento do banco de dados.
- Axios: Para requisições HTTP.
- Vercel Auth: Para autenticação.

### Instalação
```bash
npm install prisma @prisma/client axios @clerk/nextjs
```

## Contato

Para mais informações, entre em contato com Luiz Carlos Vilela.

---