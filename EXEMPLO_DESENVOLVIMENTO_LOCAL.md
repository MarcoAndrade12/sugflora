# Exemplo Prático - Desenvolvimento Local

## 🚀 Como Usar Agora

### 1. **Teste Imediato (Sem Configuração)**

Execute no console do navegador:

```javascript
// Importar as funções de teste
import {
  testarModoDesenvolvimento,
  mostrarEmailsLocais,
} from "./data/services/EmailTest";

// Testar o sistema
await testarModoDesenvolvimento();

// Ver e-mails salvos
mostrarEmailsLocais();
```

**Resultado esperado:**

```
=== TESTE MODO DESENVOLVIMENTO ===
=== TESTE DO SISTEMA DE E-MAIL ===
Enviando e-mail de teste...
=== E-MAIL EM DESENVOLVIMENTO ===
Para: dono.coleta@email.com
Assunto: Nova sugestão de identificação para sua coleta "Coleta Teste - Espécie Rara"
Corpo: [conteúdo do e-mail]
HTML: [HTML do e-mail]
================================
✅ E-mail enviado com sucesso!
E-mails salvos localmente: 1
✅ Modo desenvolvimento funcionando!
```

### 2. **Teste no App Real**

1. **Inicie** o app em desenvolvimento
2. **Crie** uma sugestão de identificação
3. **Verifique** o console do navegador
4. **Veja** o e-mail simulado

### 3. **Visualizar E-mails Salvos**

```javascript
import { mostrarEmailsLocais } from "./data/services/EmailTest";

mostrarEmailsLocais();
```

**Saída:**

```
=== E-MAILS SALVOS LOCALMENTE ===
Total de e-mails: 2

--- E-mail 1 ---
ID: 1703123456789
Data: 21/12/2023 15:30:45
Para: dono.coleta@email.com
Assunto: Nova sugestão de identificação para sua coleta "Coleta Teste"
Corpo (primeiros 100 chars): Olá! Você recebeu uma nova sugestão de identificação...
```

## 📱 Exemplo no Contexto Real

### Quando uma Sugestão é Criada

```typescript
// Em SugestaoIdentificacaoContext.tsx
const criarSugestao = async (dados) => {
  try {
    // ... criar sugestão no banco ...

    // Enviar e-mail automaticamente
    const emailService = EmailService.getInstance();
    await emailService.enviarEmailSugestaoCriada(
      coleta.usuario.email,
      coleta.usuario.nome,
      {
        coletaNome: coleta.nome,
        coletaData: coleta.data,
        sugestorNome: usuarioAtual.nome,
        sugestorEmail: usuarioAtual.email,
        familiaSugerida: dados.familia,
        generoSugerido: dados.genero,
        especieSugerida: dados.especie,
        justificativa: dados.justificativa,
        confianca: dados.confianca,
      }
    );

    console.log("✅ Sugestão criada e e-mail enviado!");
  } catch (error) {
    console.error("❌ Erro:", error);
  }
};
```

### Em Desenvolvimento

O sistema automaticamente:

1. **Detecta** `__DEV__ = true`
2. **Mostra** o e-mail no console
3. **Salva** no localStorage
4. **Não envia** e-mail real

### Em Produção

O sistema automaticamente:

1. **Detecta** `__DEV__ = false`
2. **Envia** e-mail real via Gmail/SendGrid
3. **Retorna** sucesso/erro

## 🧪 Comandos de Teste

### Teste Básico

```javascript
import { testarSistemaEmail } from "./data/services/EmailTest";
await testarSistemaEmail();
```

### Teste Completo

```javascript
import { testeCompleto } from "./data/services/EmailTest";
await testeCompleto();
```

### Ver Configuração

```javascript
import { testarConfiguracao } from "./data/services/EmailTest";
testarConfiguracao();
```

### Limpar E-mails

```javascript
import { limparEmailsLocais } from "./data/services/EmailTest";
limparEmailsLocais();
```

### Guia Rápido

```javascript
import { mostrarGuiaConfiguracao } from "./data/services/EmailTest";
mostrarGuiaConfiguracao();
```

## 🎯 Fluxo Completo

### 1. **Usuário A Cria Sugestão**

```
Usuário A → Cria sugestão para coleta de Usuário B
```

### 2. **Sistema Processa**

```
Sistema → Busca dados da coleta
Sistema → Busca dados do usuário A (sugestor)
Sistema → Busca dados do usuário B (dono da coleta)
```

### 3. **E-mail é Gerado**

```
Sistema → Gera HTML e texto do e-mail
Sistema → Inclui todos os dados da sugestão
```

### 4. **E-mail é Enviado**

```
Em Desenvolvimento:
  → Mostra no console
  → Salva no localStorage
  → Retorna sucesso

Em Produção:
  → Envia via Gmail/SendGrid
  → Retorna sucesso/erro
```

### 5. **Usuário B Recebe**

```
Usuário B → Recebe e-mail com detalhes da sugestão
Usuário B → Pode responder no app
```

## 🔧 Personalização

### Modificar Template

Edite `EmailService.tsx`:

```typescript
private gerarHtmlEmailSugestao(data: SugestaoEmailData): string {
  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .header { background: #2e7d32; color: white; padding: 20px; }
          .content { padding: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🌿 ${this.config.general.appName}</h1>
        </div>
        <div class="content">
          <h2>Nova Sugestão para "${data.coletaNome}"</h2>
          <p><strong>Sugestor:</strong> ${data.sugestorNome}</p>
          <p><strong>Espécie:</strong> ${data.especieSugerida}</p>
          <p><strong>Justificativa:</strong> ${data.justificativa}</p>
        </div>
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
    salvarLocalmente: true,   // Salvar no localStorage
    mostrarConsole: true,     // Mostrar no console
    simularEnvio: true        // Não enviar real
  }
}
```

## 📊 Monitoramento

### Ver E-mails Enviados

```javascript
import EmailService from "./data/services/EmailService";

const emailService = EmailService.getInstance();
const emails = emailService.getEmailsLocais();

console.log("Total de e-mails:", emails.length);
emails.forEach((email) => {
  console.log(`${email.timestamp}: ${email.subject}`);
});
```

### Estatísticas

```javascript
const emails = emailService.getEmailsLocais();
const hoje = new Date().toDateString();

const emailsHoje = emails.filter(
  (email) => new Date(email.timestamp).toDateString() === hoje
);

console.log(`E-mails hoje: ${emailsHoje.length}`);
```

## 🚨 Troubleshooting

### "E-mail não aparece"

- Verifique se `__DEV__ = true`
- Confirme se não há erros no console
- Verifique se a sugestão foi criada

### "localStorage não funciona"

- Verifique se o navegador suporta localStorage
- Confirme se não há modo privado
- Verifique permissões

### "Configuração não funciona"

- Execute `testarConfiguracao()`
- Verifique os logs de erro
- Confirme se as credenciais estão corretas

## ✅ Status Atual

**Sistema**: ✅ Funcionando em Desenvolvimento Local
**Modo Padrão**: Simulação (sem configuração)
**E-mails**: Salvos no localStorage
**Console**: Mostra detalhes completos
**Pronto para**: Testes e desenvolvimento

---

**Próximo passo**: Teste criando uma sugestão no app e verifique o console!
