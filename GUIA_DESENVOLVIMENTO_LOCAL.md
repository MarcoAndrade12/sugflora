# Guia de Configuração para Desenvolvimento Local

## 🎯 Objetivo

Configurar o sistema de e-mail do SugFlora para funcionar em ambiente de desenvolvimento local (localhost), permitindo testar o envio de notificações sem enviar e-mails reais.

## 🏠 Opções para Desenvolvimento Local

### 1. **Simulação Local (Recomendado para começar)**

Esta é a opção mais simples e não requer configuração externa:

```typescript
// O sistema automaticamente:
// - Mostra o e-mail no console
// - Salva o e-mail no localStorage
// - Não envia e-mail real
```

**Vantagens:**

- ✅ Zero configuração
- ✅ Funciona imediatamente
- ✅ Não envia e-mails reais
- ✅ Permite visualizar o conteúdo

**Como usar:**

1. Não configure nada
2. Execute o app em desenvolvimento
3. Crie uma sugestão de identificação
4. Verifique o console para ver o e-mail

### 2. **Gmail Real em Desenvolvimento**

Se quiser testar com e-mails reais mesmo em desenvolvimento:

#### 2.1 Configurar Gmail

1. **Gere App Password** (veja `GUIA_GMAIL_APP_PASSWORD.md`)
2. **Configure no projeto:**

```typescript
// data/services/EmailConfig.tsx
smtp: {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'seuemail@gmail.com',     // Seu e-mail real
    pass: 'abcd efgh ijkl mnop'     // App Password real
  }
},
```

#### 2.2 Testar

```typescript
import { testarConfiguracaoGmail } from "./data/services/EmailTest";
testarConfiguracaoGmail();
```

### 3. **Mailtrap (Para Testes Profissionais)**

Mailtrap é um serviço que captura e-mails em desenvolvimento:

#### 3.1 Criar Conta Mailtrap

1. **Acesse** [mailtrap.io](https://mailtrap.io)
2. **Crie** uma conta gratuita
3. **Crie** um inbox
4. **Obtenha** o API Token

#### 3.2 Configurar Mailtrap

```typescript
// data/services/EmailConfig.tsx
development: {
  mailtrap: {
    apiToken: 'api:1234567890abcdef...', // Seu token real
    fromEmail: 'noreply@sugflora.com'
  }
},
```

#### 3.3 Testar

```typescript
import { configurarMailtrap } from "./data/services/EmailTest";
configurarMailtrap("api:1234567890abcdef...", "noreply@sugflora.com");
```

## 🧪 Testando em Desenvolvimento

### 1. **Teste Básico (Simulação)**

```typescript
import { testarSistemaEmail } from "./data/services/EmailTest";

// Execute no console do navegador
await testarSistemaEmail();
```

**Resultado esperado:**

```
=== E-MAIL EM DESENVOLVIMENTO ===
Para: dono.coleta@email.com
Assunto: Nova sugestão de identificação para sua coleta "Coleta Teste - Espécie Rara"
Corpo: [conteúdo do e-mail]
HTML: [HTML do e-mail]
================================
```

### 2. **Visualizar E-mails Salvos Localmente**

```typescript
import EmailService from "./data/services/EmailService";

const emailService = EmailService.getInstance();
const emails = emailService.getEmailsLocais();
console.log("E-mails salvos:", emails);
```

### 3. **Limpar E-mails Locais**

```typescript
const emailService = EmailService.getInstance();
emailService.limparEmailsLocais();
```

### 4. **Teste Manual no App**

1. **Inicie** o app em desenvolvimento
2. **Crie** uma sugestão de identificação
3. **Verifique** o console do navegador
4. **Veja** o e-mail simulado

## 🔧 Configurações Avançadas

### Configuração Dinâmica

```typescript
import EmailService from "./data/services/EmailService";

const emailService = EmailService.getInstance();

// Configurar Gmail dinamicamente
emailService.configurarGmail("seuemail@gmail.com", "app_password");

// Configurar Mailtrap dinamicamente
emailService.configurarMailtrap("api_token", "from@email.com");
```

### Verificar Configuração

```typescript
import { validateEmailConfig } from "./data/services/EmailConfig";

const validation = validateEmailConfig();
console.log("Configuração válida:", validation.isValid);
console.log("Erros:", validation.errors);
```

## 📱 Funcionamento no App

### Fluxo em Desenvolvimento

1. **Usuário cria sugestão** no app
2. **Sistema detecta** `__DEV__ = true`
3. **Executa** `enviarEmailDesenvolvimento()`
4. **Mostra** e-mail no console
5. **Salva** no localStorage
6. **Retorna** sucesso

### Fluxo em Produção

1. **Usuário cria sugestão** no app
2. **Sistema detecta** `__DEV__ = false`
3. **Executa** `enviarEmail()`
4. **Envia** e-mail real
5. **Retorna** sucesso/erro

## 🎨 Personalização

### Modificar Template

Edite o método `gerarHtmlEmailSugestao()` em `EmailService.tsx`:

```typescript
private gerarHtmlEmailSugestao(data: SugestaoEmailData): string {
  // Personalize o HTML aqui
  return `
    <html>
      <body>
        <h1>Seu template personalizado</h1>
        <p>Coleta: ${data.coletaNome}</p>
        <!-- Mais conteúdo -->
      </body>
    </html>
  `;
}
```

### Modificar Comportamento

Edite `EmailConfig.tsx`:

```typescript
development: {
  options: {
    salvarLocalmente: false,  // Não salvar no localStorage
    mostrarConsole: false,    // Não mostrar no console
    simularEnvio: false       // Enviar e-mail real
  }
}
```

## 🚀 Próximos Passos

### Para Começar (Recomendado)

1. **Não configure nada** - use simulação
2. **Teste** criando sugestões no app
3. **Verifique** o console
4. **Visualize** e-mails salvos

### Para Testes Avançados

1. **Configure Gmail** para envio real
2. **Configure Mailtrap** para testes profissionais
3. **Teste** com e-mails reais
4. **Monitore** entregabilidade

### Para Produção

1. **Configure** Gmail ou SendGrid
2. **Teste** em ambiente de staging
3. **Monitore** logs de envio
4. **Configure** backup se necessário

## 🔍 Troubleshooting

### "E-mail não aparece no console"

- Verifique se `__DEV__ = true`
- Confirme se não há erros no console
- Verifique se a sugestão foi criada com sucesso

### "E-mail não é salvo localmente"

- Verifique se localStorage está disponível
- Confirme se não há erros de JSON
- Verifique permissões do navegador

### "Configuração não funciona"

- Execute `testarConfiguracao()`
- Verifique os logs de erro
- Confirme se as credenciais estão corretas

## 📞 Suporte

Para dúvidas ou problemas:

- **Documentação**: `data/services/README_Email.md`
- **Testes**: `data/services/EmailTest.tsx`
- **Configuração**: `data/services/EmailConfig.tsx`
- **Gmail**: `GUIA_GMAIL_APP_PASSWORD.md`

---

**Status**: ✅ Pronto para Desenvolvimento Local
**Modo Padrão**: Simulação (sem configuração)
**Opções Avançadas**: Gmail Real, Mailtrap
**Ambiente**: Localhost/Desenvolvimento
