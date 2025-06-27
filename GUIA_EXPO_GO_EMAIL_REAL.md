# Guia para Envio Real de E-mails no Expo Go

## 🎯 Objetivo

Configurar o sistema para enviar **e-mails reais** quando o usuário criar uma sugestão de identificação, funcionando no Expo Go rodando em localhost.

## 🚀 Opções que Funcionam no Expo Go

### 1. **EmailJS (Recomendado - Mais Fácil)**

EmailJS é um serviço que permite enviar e-mails diretamente do frontend, funcionando perfeitamente no Expo Go.

#### 1.1 Criar Conta EmailJS

1. **Acesse** [emailjs.com](https://www.emailjs.com/)
2. **Crie** uma conta gratuita
3. **Verifique** seu e-mail

#### 1.2 Configurar Serviço de E-mail

1. **Vá** para "Email Services"
2. **Clique** em "Add New Service"
3. **Escolha** "Gmail" ou "Outlook"
4. **Configure** com suas credenciais:
   - **Gmail**: Use App Password (veja `GUIA_GMAIL_APP_PASSWORD.md`)
   - **Outlook**: Use senha normal

#### 1.3 Criar Template de E-mail

1. **Vá** para "Email Templates"
2. **Clique** em "Create New Template"
3. **Configure** o template:

```html
<!-- Template HTML -->
<h2>Nova Sugestão de Identificação</h2>
<p>Olá!</p>
<p>
  Você recebeu uma nova sugestão de identificação para sua coleta
  <strong>{{coleta_nome}}</strong>.
</p>

<h3>Detalhes da Sugestão:</h3>
<p><strong>Família:</strong> {{familia}}</p>
<p><strong>Gênero:</strong> {{genero}}</p>
<p><strong>Espécie:</strong> {{especie}}</p>
<p><strong>Nome comum:</strong> {{nome_comum}}</p>

<h3>Justificativa:</h3>
<p>{{justificativa}}</p>

<h3>Nível de Confiança:</h3>
<p>{{confianca}}</p>

<p><strong>Sugestor:</strong> {{sugestor_nome}} ({{sugestor_email}})</p>
<p><strong>Data da Coleta:</strong> {{data_coleta}}</p>

<p>
  Para visualizar e responder a esta sugestão, acesse o aplicativo SugFlora.
</p>

<p>Atenciosamente,<br />Equipe SugFlora</p>
```

#### 1.4 Configurar no Projeto

```typescript
// data/services/EmailConfig.tsx
emailJS: {
  serviceId: 'service_abc123',     // Seu Service ID
  templateId: 'template_xyz789',   // Seu Template ID
  userId: 'user_def456',           // Seu User ID
  apiUrl: 'https://api.emailjs.com/api/v1.0/email/send'
},
```

#### 1.5 Testar

```javascript
// No console do Expo Go
import { testarEmailJS } from "./data/services/EmailTest";
await testarEmailJS();
```

### 2. **SendGrid (Profissional)**

SendGrid é um serviço profissional de e-mail com plano gratuito generoso.

#### 2.1 Criar Conta SendGrid

1. **Acesse** [sendgrid.com](https://sendgrid.com/)
2. **Crie** uma conta gratuita
3. **Verifique** seu e-mail

#### 2.2 Obter API Key

1. **Vá** para "Settings" > "API Keys"
2. **Clique** em "Create API Key"
3. **Escolha** "Restricted Access" > "Mail Send"
4. **Copie** a API Key

#### 2.3 Configurar no Projeto

```typescript
// data/services/EmailConfig.tsx
sendGrid: {
  apiKey: 'SG.abc123...',           // Sua API Key
  fromEmail: 'noreply@sugflora.com',
  fromName: 'SugFlora'
},
```

#### 2.4 Testar

```javascript
// No console do Expo Go
import { testarSendGrid } from "./data/services/EmailTest";
await testarSendGrid();
```

### 3. **Mailtrap (Para Testes)**

Mailtrap captura e-mails em desenvolvimento, perfeito para testes.

#### 3.1 Criar Conta Mailtrap

1. **Acesse** [mailtrap.io](https://mailtrap.io/)
2. **Crie** uma conta gratuita
3. **Crie** um inbox

#### 3.2 Obter API Token

1. **Vá** para "API Tokens"
2. **Clique** em "Generate Token"
3. **Copie** o token

#### 3.3 Configurar no Projeto

```typescript
// data/services/EmailConfig.tsx
development: {
  mailtrap: {
    apiToken: 'api:1234567890abcdef...', // Seu token
    fromEmail: 'noreply@sugflora.com'
  }
},
```

#### 3.4 Testar

```javascript
// No console do Expo Go
import { testarMailtrap } from "./data/services/EmailTest";
await testarMailtrap();
```

## 🔧 Configuração Rápida

### Opção 1: EmailJS (Recomendado)

```javascript
// No console do Expo Go
import EmailService from "./data/services/EmailService";

const emailService = EmailService.getInstance();
emailService.configurarEmailJS(
  "service_abc123", // Seu Service ID
  "template_xyz789", // Seu Template ID
  "user_def456" // Seu User ID
);

// Testar
await emailService.testarConfiguracao();
```

### Opção 2: SendGrid

```javascript
// No console do Expo Go
import EmailService from "./data/services/EmailService";

const emailService = EmailService.getInstance();
emailService.configurarSendGrid(
  "SG.abc123...", // Sua API Key
  "noreply@sugflora.com", // From Email
  "SugFlora" // From Name
);

// Testar
await emailService.testarConfiguracao();
```

## 📱 Teste no App Real

### 1. **Configurar Serviço**

Escolha um dos serviços acima e configure no `EmailConfig.tsx`.

### 2. **Testar Configuração**

```javascript
// No console do Expo Go
import { testarConfiguracao } from "./data/services/EmailTest";
testarConfiguracao();
```

### 3. **Criar Sugestão**

1. **Abra** o app no Expo Go
2. **Crie** uma sugestão de identificação
3. **Verifique** se o e-mail foi enviado

### 4. **Verificar Logs**

```javascript
// No console do Expo Go
import { mostrarEmailsLocais } from "./data/services/EmailTest";
mostrarEmailsLocais();
```

## 🎯 Fluxo Completo

### Quando o Usuário Cria uma Sugestão

```
1. Usuário A → Cria sugestão para coleta de Usuário B
2. Sistema → Busca dados da coleta e usuários
3. Sistema → Gera e-mail com todos os dados
4. Sistema → Envia via EmailJS/SendGrid/Mailtrap
5. Sistema → Retorna sucesso/erro
6. Usuário B → Recebe e-mail real
```

### Logs Esperados

```
✅ E-mail enviado via EmailJS
Para: dono.coleta@email.com
Assunto: Nova sugestão de identificação para sua coleta "Coleta Teste"
Status: Enviado com sucesso
```

## 🔍 Troubleshooting

### "Erro de CORS"

- **EmailJS**: Funciona sem problemas
- **SendGrid**: Funciona sem problemas
- **Mailtrap**: Funciona sem problemas

### "Erro de Rede"

- Verifique conexão com internet
- Verifique se as credenciais estão corretas
- Verifique se o serviço está ativo

### "E-mail não chega"

- Verifique spam/lixo eletrônico
- Verifique se o e-mail está correto
- Teste com e-mail próprio primeiro

### "Erro de Autenticação"

- Verifique API Key/Token
- Verifique Service ID/Template ID
- Verifique se a conta está ativa

## 📊 Monitoramento

### Verificar E-mails Enviados

```javascript
// EmailJS
// Vá para dashboard do EmailJS > Activity

// SendGrid
// Vá para dashboard do SendGrid > Activity

// Mailtrap
// Vá para inbox do Mailtrap
```

### Logs no App

```javascript
// No console do Expo Go
import EmailService from "./data/services/EmailService";

const emailService = EmailService.getInstance();
const emails = emailService.getEmailsLocais();

console.log("E-mails salvos:", emails.length);
emails.forEach((email) => {
  console.log(`${email.timestamp}: ${email.subject}`);
});
```

## 🚀 Próximos Passos

### 1. **Escolha um Serviço**

- **EmailJS**: Mais fácil, funciona imediatamente
- **SendGrid**: Mais profissional, plano gratuito generoso
- **Mailtrap**: Para testes e desenvolvimento

### 2. **Configure as Credenciais**

- Siga o guia específico do serviço escolhido
- Substitua os valores no `EmailConfig.tsx`

### 3. **Teste o Sistema**

- Execute os testes de configuração
- Crie uma sugestão no app
- Verifique se o e-mail foi enviado

### 4. **Monitore**

- Verifique os logs no console
- Monitore a caixa de entrada
- Ajuste configurações se necessário

## ✅ Status

**EmailJS**: ✅ Funciona no Expo Go
**SendGrid**: ✅ Funciona no Expo Go
**Mailtrap**: ✅ Funciona no Expo Go
**Gmail API**: ⚠️ Requer backend
**SMTP Direto**: ❌ Não funciona no Expo Go

---

**🎉 Recomendação**: Use **EmailJS** para começar rapidamente!
