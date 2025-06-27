# Guia para Testar EmailJS

Este guia ajuda a testar o sistema de e-mail usando EmailJS com os dados que você configurou.

## Configuração Atual

Seus dados do EmailJS estão configurados no arquivo `EmailConfig.tsx`:

```javascript
emailJS: {
  serviceId: "service_jvs130a",
  templateId: "template_lfr891s",
  userId: "9qZpkV8xS_YLVkW9G",
  apiUrl: "https://api.emailjs.com/api/v1.0/email/send",
}
```

## Como Testar

### 1. Verificar Configuração

Execute no console do Expo Go:

```javascript
import { verificarConfiguracaoEmailJS } from "./data/services/EmailTest";
verificarConfiguracaoEmailJS();
```

Este comando verifica se os dados do EmailJS parecem válidos (não são de exemplo).

### 2. Teste de Envio Real via EmailJS

Execute no console do Expo Go:

```javascript
import { testarEmailJSConfigurado } from "./data/services/EmailTest";
await testarEmailJSConfigurado();
```

Este teste:

- Configura o EmailJS com seus dados reais
- Envia um e-mail real para `teste@exemplo.com`
- Usa o template configurado no EmailJS

### 3. Teste de Simulação (Desenvolvimento)

Execute no console do Expo Go:

```javascript
import { testarEmailJSDesenvolvimento } from "./data/services/EmailTest";
await testarEmailJSDesenvolvimento();
```

Este teste:

- Simula o envio via EmailJS
- Salva o e-mail localmente
- Não envia e-mail real (seguro para desenvolvimento)

### 4. Verificar E-mails Salvos

```javascript
import { mostrarEmailsLocais } from "./data/services/EmailTest";
mostrarEmailsLocais();
```

## Template do EmailJS

Certifique-se de que seu template no EmailJS (`template_lfr891s`) tenha as seguintes variáveis:

### Variáveis Obrigatórias

- `{{to_email}}` - E-mail do destinatário
- `{{to_name}}` - Nome do destinatário
- `{{coleta_nome}}` - Nome da coleta
- `{{sugestor_nome}}` - Nome do sugerente
- `{{sugestor_email}}` - E-mail do sugerente
- `{{justificativa}}` - Justificativa da sugestão
- `{{confianca}}` - Nível de confiança (%)

### Variáveis Opcionais

- `{{familia}}` - Família sugerida
- `{{genero}}` - Gênero sugerido
- `{{especie}}` - Espécie sugerida
- `{{nome_comum}}` - Nome comum sugerido
- `{{observacoes_adicionais}}` - Observações adicionais
- `{{data_coleta}}` - Data da coleta

## Exemplo de Template HTML

```html
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
        <h1>SugFlora</h1>
        <h2>Nova Sugestão de Identificação</h2>
      </div>

      <div class="content">
        <p>Olá {{to_name}}!</p>

        <p>
          Você recebeu uma nova sugestão de identificação para sua coleta
          <strong>"{{coleta_nome}}"</strong>.
        </p>

        <div class="sugestao-box">
          <h3>Detalhes da Sugestão:</h3>

          <p>
            <strong>Sugerente:</strong> {{sugestor_nome}} ({{sugestor_email}})
          </p>

          {{#if familia}}
          <p><strong>Família:</strong> {{familia}}</p>
          {{/if}} {{#if genero}}
          <p><strong>Gênero:</strong> {{genero}}</p>
          {{/if}} {{#if especie}}
          <p><strong>Espécie:</strong> {{especie}}</p>
          {{/if}} {{#if nome_comum}}
          <p><strong>Nome comum:</strong> {{nome_comum}}</p>
          {{/if}}

          <p><strong>Justificativa:</strong> {{justificativa}}</p>
          <p><strong>Confiança:</strong> {{confianca}}%</p>

          {{#if observacoes_adicionais}}
          <p>
            <strong>Observações adicionais:</strong> {{observacoes_adicionais}}
          </p>
          {{/if}}
        </div>

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

## Troubleshooting

### Erro: "Service ID inválido"

- Verifique se o Service ID está correto no EmailJS
- Confirme se o serviço está ativo

### Erro: "Template ID inválido"

- Verifique se o Template ID está correto
- Confirme se o template está publicado

### Erro: "User ID inválido"

- Verifique se o User ID está correto
- Confirme se a conta está ativa

### Erro: "Variável não encontrada no template"

- Verifique se todas as variáveis estão definidas no template
- Use as variáveis exatas listadas acima

### Erro: "CORS" ou "Network"

- Verifique se o domínio está autorizado no EmailJS
- Confirme se a API está acessível

## Logs de Debug

O sistema inclui logs detalhados:

```javascript
console.log("=== TESTE EMAILJS CONFIGURADO ===");
console.log("✅ EmailJS configurado com dados reais");
console.log("✅ E-mail enviado com sucesso via EmailJS!");
```

## Próximos Passos

1. **Teste a configuração**: `verificarConfiguracaoEmailJS()`
2. **Teste simulação**: `testarEmailJSDesenvolvimento()`
3. **Teste envio real**: `testarEmailJSConfigurado()`
4. **Verifique e-mails**: `mostrarEmailsLocais()`

## Status da Configuração

✅ **Service ID**: `service_jvs130a`
✅ **Template ID**: `template_lfr891s`
✅ **User ID**: `9qZpkV8xS_YLVkW9G`
⏳ **Aguardando testes**
