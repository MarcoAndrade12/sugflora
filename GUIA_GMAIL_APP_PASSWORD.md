# Guia de Configuração do Gmail com App Password

## 🎯 Objetivo

Configurar o sistema de e-mail do SugFlora para usar Gmail com App Password, permitindo o envio automático de notificações quando sugestões de identificação são criadas.

## 📋 Pré-requisitos

- Conta Gmail ativa
- Verificação em duas etapas ativada
- Acesso às configurações da conta Google

## 🔧 Passo a Passo

### 1. Ativar Verificação em Duas Etapas

1. **Acesse** [myaccount.google.com](https://myaccount.google.com)
2. **Vá para** "Segurança"
3. **Clique em** "Verificação em duas etapas"
4. **Ative** a verificação em duas etapas se ainda não estiver ativa

### 2. Gerar App Password

1. **Acesse** [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. **Selecione** "Aplicativo" → "Outro (nome personalizado)"
3. **Digite** "SugFlora" como nome
4. **Clique em** "Gerar"
5. **Copie** a senha gerada (16 caracteres com espaços)

**Exemplo de App Password:** `abcd efgh ijkl mnop`

### 3. Configurar no Projeto

Edite o arquivo `data/services/EmailConfig.tsx`:

```typescript
// Configurações para SMTP direto (Gmail com App Password)
smtp: {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    // ⚠️ SUBSTITUA PELO SEU EMAIL E APP PASSWORD DO GMAIL ⚠️
    user: 'seuemail@gmail.com', // Seu e-mail Gmail
    pass: 'abcd efgh ijkl mnop' // App Password gerado
  }
},
```

### 4. Configuração Alternativa: Gmail API

Se preferir usar a Gmail API (mais seguro):

#### 4.1 Criar Projeto no Google Cloud Console

1. **Acesse** [console.cloud.google.com](https://console.cloud.google.com)
2. **Crie** um novo projeto ou selecione um existente
3. **Ative** a Gmail API
4. **Crie** credenciais OAuth 2.0
5. **Baixe** o arquivo JSON das credenciais

#### 4.2 Configurar Gmail API

```typescript
// Configurações para Gmail API
gmail: {
  apiKey: 'ya29.a0AfH6SMC...', // Sua API Key
  clientId: '123456789-abc...',
  clientSecret: 'GOCSPX-...'
},
```

## 🧪 Testando a Configuração

### 1. Teste Rápido

```typescript
import { testarConfiguracao } from "./data/services/EmailTest";
testarConfiguracao();
```

### 2. Teste Completo

```typescript
import { testarSistemaEmail } from "./data/services/EmailTest";
await testarSistemaEmail();
```

### 3. Teste Manual

1. Crie uma sugestão de identificação no app
2. Verifique o console (em desenvolvimento)
3. Verifique se o e-mail foi enviado (em produção)

## 🔍 Verificando se Funcionou

### Em Desenvolvimento

- O e-mail será simulado no console
- Você verá o conteúdo completo do e-mail
- Não será enviado e-mail real

### Em Produção

- O e-mail será enviado para o destinatário
- Verifique a caixa de entrada (e spam)
- O remetente será seu e-mail Gmail

## ⚠️ Problemas Comuns

### 1. "App Password não funciona"

- **Verifique** se a verificação em duas etapas está ativa
- **Confirme** se o App Password foi copiado corretamente
- **Teste** o login no Gmail com o App Password

### 2. "E-mail não chega"

- **Verifique** a pasta de spam
- **Confirme** se o e-mail de destino está correto
- **Teste** enviando para seu próprio e-mail

### 3. "Erro de autenticação"

- **Regenere** o App Password
- **Confirme** se o e-mail está correto
- **Verifique** se não há espaços extras

## 🔒 Segurança

### ✅ Boas Práticas

- **Nunca commite** credenciais no código
- **Use variáveis de ambiente** em produção
- **Regenere** App Passwords regularmente
- **Monitore** o uso da conta

### ❌ Evite

- Compartilhar App Passwords
- Usar senha normal do Gmail
- Deixar credenciais no código fonte
- Usar a mesma senha em múltiplos projetos

## 📧 Estrutura do E-mail Enviado

```
De: seuemail@gmail.com
Para: dono.da.coleta@email.com
Assunto: Nova sugestão de identificação para sua coleta "Nome da Coleta"

🌿 SugFlora - Nova Sugestão de Identificação

Olá!

Você recebeu uma nova sugestão de identificação para sua coleta "Nome da Coleta".

📋 Detalhes da Sugestão:
• Família: Fabaceae
• Gênero: Mimosa
• Espécie: Mimosa pudica
• Nome comum: Dormideira

💡 Justificativa:
[Texto da justificativa]

🎯 Nível de Confiança: [Alta]

Sugestor: João Silva (joao@email.com)
Data da Coleta: 15/01/2024

Para visualizar e responder a esta sugestão, acesse o aplicativo SugFlora.

Atenciosamente,
Equipe SugFlora
Para suporte: suporte@sugflora.com
```

## 🚀 Próximos Passos

1. **Configure** suas credenciais Gmail
2. **Teste** o sistema em desenvolvimento
3. **Verifique** se os e-mails estão chegando
4. **Monitore** o funcionamento em produção
5. **Configure** backup (SendGrid, etc.) se necessário

## 📞 Suporte

Se tiver problemas:

- **Documentação**: `data/services/README_Email.md`
- **Testes**: `data/services/EmailTest.tsx`
- **Configuração**: `data/services/EmailConfig.tsx`
- **Google**: [Suporte Gmail](https://support.google.com/mail/)

---

**Status**: ✅ Configuração Completa
**Método**: Gmail SMTP com App Password
**Segurança**: Alta (verificação em duas etapas)
**Custo**: Gratuito (até 500 e-mails/dia)
