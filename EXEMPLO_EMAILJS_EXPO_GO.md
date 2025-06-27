# Exemplo Prático - EmailJS no Expo Go

## 🎯 Objetivo

Configurar EmailJS para enviar e-mails reais quando o usuário criar uma sugestão de identificação no app rodando no Expo Go.

## 🚀 Passo a Passo - EmailJS

### 1. **Criar Conta EmailJS**

1. **Acesse** [emailjs.com](https://www.emailjs.com/)
2. **Clique** em "Sign Up Free"
3. **Preencha** os dados e crie a conta
4. **Verifique** seu e-mail

### 2. **Configurar Serviço de E-mail**

1. **Faça login** no EmailJS
2. **Vá** para "Email Services" no menu lateral
3. **Clique** em "Add New Service"
4. **Escolha** "Gmail" (recomendado)
5. **Configure**:
   - **Service Name**: `SugFlora Gmail`
   - **Gmail**: Seu e-mail Gmail
   - **Password**: App Password (veja `GUIA_GMAIL_APP_PASSWORD.md`)

### 3. **Criar Template de E-mail**

1. **Vá** para "Email Templates"
2. **Clique** em "Create New Template"
3. **Configure**:

**Nome do Template**: `Sugestão Identificação`

**Assunto**: `Nova sugestão de identificação para sua coleta {{coleta_nome}}`

**Conteúdo HTML**:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .header {
        background-color: #2e7d32;
        color: white;
        padding: 20px;
        text-align: center;
        border-radius: 8px 8px 0 0;
      }
      .content {
        background-color: #f9f9f9;
        padding: 20px;
        border-radius: 0 0 8px 8px;
      }
      .sugestao-box {
        background-color: white;
        padding: 15px;
        margin: 15px 0;
        border-left: 4px solid #2e7d32;
        border-radius: 4px;
      }
      .footer {
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid #ddd;
        font-size: 12px;
        color: #666;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🌿 SugFlora</h1>
        <h2>Nova Sugestão de Identificação</h2>
      </div>

      <div class="content">
        <p>Olá!</p>

        <p>
          Você recebeu uma nova sugestão de identificação para sua coleta
          <strong>"{{coleta_nome}}"</strong>.
        </p>

        <div class="sugestao-box">
          <h3>📋 Detalhes da Sugestão</h3>

          {{#if familia}}
          <p><strong>Família:</strong> {{familia}}</p>
          {{/if}} {{#if genero}}
          <p><strong>Gênero:</strong> {{genero}}</p>
          {{/if}} {{#if especie}}
          <p><strong>Espécie:</strong> {{especie}}</p>
          {{/if}} {{#if nome_comum}}
          <p><strong>Nome comum:</strong> {{nome_comum}}</p>
          {{/if}}

          <h4>💡 Justificativa:</h4>
          <p>{{justificativa}}</p>

          <h4>🎯 Nível de Confiança:</h4>
          <p>{{confianca}}</p>

          {{#if observacoes}}
          <h4>📝 Observações Adicionais:</h4>
          <p>{{observacoes}}</p>
          {{/if}}
        </div>

        <p><strong>Sugestor:</strong> {{sugestor_nome}} ({{sugestor_email}})</p>
        <p><strong>Data da Coleta:</strong> {{data_coleta}}</p>

        <p>
          Para visualizar e responder a esta sugestão, acesse o aplicativo
          SugFlora.
        </p>
      </div>

      <div class="footer">
        <p>Atenciosamente,<br />Equipe SugFlora</p>
        <p>Para suporte: suporte@sugflora.com</p>
      </div>
    </div>
  </body>
</html>
```

### 4. **Obter Credenciais**

Após criar o template, você terá:

- **Service ID**: `service_abc123` (exemplo)
- **Template ID**: `template_xyz789` (exemplo)
- **User ID**: `user_def456` (exemplo)

### 5. **Configurar no Projeto**

Edite `data/services/EmailConfig.tsx`:

```typescript
emailJS: {
  serviceId: 'service_abc123',     // Seu Service ID real
  templateId: 'template_xyz789',   // Seu Template ID real
  userId: 'user_def456',           // Seu User ID real
  apiUrl: 'https://api.emailjs.com/api/v1.0/email/send'
},
```

### 6. **Testar no Expo Go**

```javascript
// No console do Expo Go
import { configurarEmailJS, testarEmailJS } from "./data/services/EmailTest";

// Configurar
configurarEmailJS(
  "service_abc123", // Seu Service ID
  "template_xyz789", // Seu Template ID
  "user_def456" // Seu User ID
);

// Testar
await testarEmailJS();
```

## 📱 Teste Real no App

### 1. **Configurar Credenciais**

Substitua os valores no `EmailConfig.tsx` pelos seus dados reais do EmailJS.

### 2. **Testar Configuração**

```javascript
// No console do Expo Go
import { testarConfiguracao } from "./data/services/EmailTest";
testarConfiguracao();
```

**Resultado esperado:**

```
=== TESTE DE CONFIGURAÇÃO DE E-MAIL ===
✅ Configuração válida!
Ambiente de desenvolvimento: true
=====================================
```

### 3. **Criar Sugestão no App**

1. **Abra** o app no Expo Go
2. **Navegue** até uma coleta
3. **Crie** uma sugestão de identificação
4. **Preencha** todos os dados
5. **Salve** a sugestão

### 4. **Verificar Envio**

**No console do Expo Go:**

```
✅ E-mail enviado via EmailJS
Para: dono.coleta@email.com
Assunto: Nova sugestão de identificação para sua coleta "Coleta Teste"
Status: Enviado com sucesso
```

**Na caixa de entrada:**

- Verifique o e-mail do dono da coleta
- O e-mail deve ter chegado com todos os dados

## 🔧 Configuração Dinâmica

### Via Console

```javascript
// No console do Expo Go
import EmailService from "./data/services/EmailService";

const emailService = EmailService.getInstance();

// Configurar EmailJS
emailService.configurarEmailJS(
  "service_abc123", // Seu Service ID
  "template_xyz789", // Seu Template ID
  "user_def456" // Seu User ID
);

// Testar
await emailService.testarConfiguracao();
```

### Via Código

```typescript
// Em qualquer componente
import EmailService from "./data/services/EmailService";

useEffect(() => {
  const emailService = EmailService.getInstance();
  emailService.configurarEmailJS(
    "service_abc123",
    "template_xyz789",
    "user_def456"
  );
}, []);
```

## 🎯 Fluxo Completo

### Quando o Usuário Cria uma Sugestão

```
1. Usuário A → Cria sugestão para coleta de Usuário B
2. Sistema → Busca dados da coleta e usuários
3. Sistema → Gera e-mail com template EmailJS
4. Sistema → Envia via EmailJS API
5. EmailJS → Envia e-mail real via Gmail
6. Usuário B → Recebe e-mail na caixa de entrada
```

### Dados Enviados

O sistema envia automaticamente:

- **Nome da coleta**
- **Dados da sugestão** (família, gênero, espécie, etc.)
- **Justificativa**
- **Nível de confiança**
- **Dados do sugerente**
- **Data da coleta**

## 🔍 Troubleshooting

### "Erro de Autenticação"

- Verifique se o Service ID está correto
- Verifique se o Template ID está correto
- Verifique se o User ID está correto
- Verifique se o Gmail está configurado corretamente

### "E-mail não chega"

- Verifique spam/lixo eletrônico
- Verifique se o e-mail do destinatário está correto
- Teste primeiro com seu próprio e-mail

### "Erro de Rede"

- Verifique conexão com internet
- Verifique se o EmailJS está funcionando
- Verifique logs no dashboard do EmailJS

### "Template não funciona"

- Verifique se as variáveis estão corretas
- Verifique se o HTML está válido
- Teste o template no dashboard do EmailJS

## 📊 Monitoramento

### Dashboard EmailJS

1. **Acesse** [emailjs.com](https://www.emailjs.com/)
2. **Vá** para "Activity"
3. **Veja** todos os e-mails enviados
4. **Monitore** status de entrega

### Logs no App

```javascript
// No console do Expo Go
import { mostrarEmailsLocais } from "./data/services/EmailTest";
mostrarEmailsLocais();
```

## ✅ Vantagens do EmailJS

- ✅ **Funciona no Expo Go** sem problemas
- ✅ **Configuração simples** e rápida
- ✅ **Templates personalizáveis** com HTML
- ✅ **Plano gratuito** generoso (200 e-mails/mês)
- ✅ **Dashboard** para monitoramento
- ✅ **Suporte** a múltiplos provedores

## 🚀 Próximos Passos

### 1. **Configure EmailJS**

- Siga o passo a passo acima
- Substitua as credenciais no código

### 2. **Teste o Sistema**

- Execute os testes de configuração
- Crie uma sugestão no app
- Verifique se o e-mail foi enviado

### 3. **Personalize o Template**

- Modifique o HTML conforme necessário
- Adicione mais variáveis se precisar
- Teste diferentes estilos

### 4. **Monitore**

- Verifique o dashboard do EmailJS
- Monitore a caixa de entrada
- Ajuste configurações se necessário

---

**🎉 EmailJS é a solução mais simples e eficaz para envio de e-mails no Expo Go!**
