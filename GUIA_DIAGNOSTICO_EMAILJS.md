# Guia de Diagnóstico - EmailJS Não Está Enviando

## Problema

O EmailJS não está enviando e-mails. Vamos diagnosticar e resolver.

## Passos para Diagnosticar

### 1. Teste Direto via Console

Abra o console do navegador e execute este código:

```javascript
// Teste direto do EmailJS
async function testarEmailJS() {
  try {
    console.log("=== TESTE EMAILJS DIRETO ===");

    const requestBody = {
      service_id: "service_jvs130a",
      template_id: "__ejs-test-mail-service__",
      user_id: "9qZpkV8xS_YLVkW9G",
      template_params: {
        to_email: "andrademacedo2012@gmail.com",
        to_name: "Andrade Macedo",
        message: "Teste direto do EmailJS",
      },
    };

    console.log("📤 Enviando requisição...");
    console.log("📋 Request:", JSON.stringify(requestBody, null, 2));

    const response = await fetch(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    console.log("📡 Resposta:", response.status, response.statusText);

    if (response.ok) {
      const result = await response.json();
      console.log("✅ Sucesso:", result);
      return true;
    } else {
      const error = await response.text();
      console.error("❌ Erro:", error);
      return false;
    }
  } catch (error) {
    console.error("❌ Erro:", error);
    return false;
  }
}

// Executar o teste
testarEmailJS();
```

### 2. Verificar Configuração do EmailJS

1. **Acesse o EmailJS Dashboard**: https://dashboard.emailjs.com/
2. **Verifique o Service ID**: `service_jvs130a`
3. **Verifique o Template ID**: `__ejs-test-mail-service__`
4. **Verifique o User ID**: `9qZpkV8xS_YLVkW9G`

### 3. Possíveis Problemas e Soluções

#### Problema 1: Template não publicado

- **Sintoma**: Erro 400 ou template não encontrado
- **Solução**: Publique o template no EmailJS Dashboard

#### Problema 2: Service não ativo

- **Sintoma**: Erro 400 ou service não encontrado
- **Solução**: Ative o serviço no EmailJS Dashboard

#### Problema 3: User ID incorreto

- **Sintoma**: Erro 401 ou 403
- **Solução**: Verifique o User ID no dashboard

#### Problema 4: Parâmetros incorretos

- **Sintoma**: E-mail chega mas com dados errados
- **Solução**: Verifique os nomes dos parâmetros no template

### 4. Teste com Dados Mínimos

```javascript
// Teste com dados mínimos
async function testarMinimo() {
  const requestBody = {
    service_id: "service_jvs130a",
    template_id: "__ejs-test-mail-service__",
    user_id: "9qZpkV8xS_YLVkW9G",
    template_params: {
      to_email: "andrademacedo2012@gmail.com",
      to_name: "Teste",
      message: "Teste mínimo",
    },
  };

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  console.log("Status:", response.status);
  console.log("Resposta:", await response.text());
}

testarMinimo();
```

### 5. Verificar Logs do Console

Execute o teste e verifique:

- Status da resposta (200 = sucesso)
- Corpo da resposta (deve ser um JSON com status "OK")
- Erros no console

### 6. Teste no React Native

Se estiver testando no React Native, adicione este código:

```javascript
// No seu componente ou tela
import {
  testarEmailJSDireto,
  testarEmailJSCompleto,
} from "../data/services/EmailTest";

// Botão para testar
const handleTestarEmailJS = async () => {
  console.log("🧪 Testando EmailJS...");
  const resultado = await testarEmailJSDireto();
  if (resultado) {
    alert("✅ EmailJS funcionando! Verifique sua caixa de entrada.");
  } else {
    alert("❌ EmailJS falhou. Verifique o console para detalhes.");
  }
};
```

## Próximos Passos

1. Execute o teste direto no console
2. Verifique os logs de resposta
3. Confirme se o e-mail chegou em `andrademacedo2012@gmail.com`
4. Se funcionar, o problema está no código da aplicação
5. Se não funcionar, o problema está na configuração do EmailJS

## Contato para Suporte

Se o problema persistir, verifique:

- Dashboard do EmailJS: https://dashboard.emailjs.com/
- Documentação: https://www.emailjs.com/docs/
- Status da API: https://status.emailjs.com/
