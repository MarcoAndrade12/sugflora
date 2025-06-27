# Sistema de E-mail - SugFlora

Este documento explica como configurar e usar o sistema de e-mail do SugFlora para enviar notificações quando sugestões de identificação são criadas.

## Funcionalidades

- **Notificação de Sugestão Criada**: Envia e-mail para o dono da coleta quando alguém cria uma sugestão de identificação
- **Template HTML Responsivo**: E-mails com design moderno e responsivo
- **Configuração Flexível**: Suporte para diferentes provedores de e-mail
- **Modo de Desenvolvimento**: Simulação de envio em ambiente de desenvolvimento

## Configuração

### 1. EmailJS (Recomendado para começar)

1. Acesse [EmailJS](https://www.emailjs.com/) e crie uma conta
2. Crie um novo serviço de e-mail (Gmail, Outlook, etc.)
3. Crie um template de e-mail
4. Obtenha suas credenciais:
   - Service ID
   - Template ID
   - User ID

### 2. Configurar no Projeto

Edite o arquivo `data/services/EmailConfig.tsx`:

```typescript
export const EmailConfig = {
  emailJS: {
    serviceId: "seu_service_id_aqui",
    templateId: "seu_template_id_aqui",
    userId: "seu_user_id_aqui",
    apiUrl: "https://api.emailjs.com/api/v1.0/email/send",
  },
  // ... outras configurações
};
```

### 3. Template do EmailJS

Crie um template no EmailJS com as seguintes variáveis:

- `to_email`: E-mail do destinatário
- `subject`: Assunto do e-mail
- `message`: Conteúdo HTML do e-mail
- `app_name`: Nome do aplicativo
- `support_email`: E-mail de suporte

## Como Funciona

### Fluxo de Envio de E-mail

1. **Criação da Sugestão**: Quando um usuário cria uma sugestão de identificação
2. **Busca de Dados**: O sistema busca automaticamente:
   - Dados da coleta
   - Dados do dono da coleta (dono do projeto)
   - Dados do sugerente
   - Dados taxonômicos sugeridos
3. **Geração do E-mail**: Cria o conteúdo do e-mail com:
   - Detalhes da sugestão
   - Classificação taxonômica
   - Justificativa
   - Nível de confiança
   - Informações do sugerente
4. **Envio**: Envia o e-mail para o dono da coleta

### Estrutura do E-mail

O e-mail inclui:

- **Cabeçalho**: Logo e título do SugFlora
- **Informações da Coleta**: Nome e data da coleta
- **Detalhes da Sugestão**: Classificação taxonômica sugerida
- **Justificativa**: Explicação da identificação
- **Nível de Confiança**: Indicador visual (1-5)
- **Observações Adicionais**: Informações extras (se houver)
- **Informações do Sugerente**: Nome e e-mail
- **Rodapé**: Contato de suporte

## Desenvolvimento vs Produção

### Modo de Desenvolvimento (`__DEV__`)

Em desenvolvimento, o sistema:

- Não envia e-mails reais
- Exibe o conteúdo do e-mail no console
- Usa configurações de teste
- Retorna `true` para simular sucesso

### Modo de Produção

Em produção, o sistema:

- Envia e-mails reais
- Usa as configurações configuradas
- Valida as configurações antes do envio
- Trata erros adequadamente

## Testando

### Teste de Configuração

```typescript
import EmailService from "./data/services/EmailService";

const emailService = EmailService.getInstance();
const sucesso = await emailService.testarConfiguracao();

if (sucesso) {
  console.log("Configuração de e-mail funcionando!");
} else {
  console.log("Problema na configuração de e-mail");
}
```

### Teste Manual

1. Crie uma sugestão de identificação
2. Verifique o console (em desenvolvimento)
3. Verifique se o e-mail foi enviado (em produção)

## Troubleshooting

### Problemas Comuns

1. **"Configurações de e-mail incompletas"**

   - Verifique se todas as credenciais estão configuradas
   - Use `validateEmailConfig()` para verificar

2. **"Erro HTTP: 400"**

   - Verifique se o template do EmailJS está correto
   - Confirme se as variáveis do template estão corretas

3. **"E-mail não enviado"**
   - Verifique a conexão com a internet
   - Confirme se as credenciais estão corretas
   - Verifique os logs de erro

### Logs Úteis

```typescript
// Verificar configurações
const validation = validateEmailConfig();
console.log("Configuração válida:", validation.isValid);
console.log("Erros:", validation.errors);

// Testar envio
const emailService = EmailService.getInstance();
const resultado = await emailService.testarConfiguracao();
console.log("Teste de envio:", resultado);
```

## Segurança

- **Credenciais**: Nunca commite credenciais reais no código
- **Variáveis de Ambiente**: Use variáveis de ambiente para credenciais
- **Validação**: Sempre valide dados antes do envio
- **Rate Limiting**: Implemente limitação de taxa se necessário

## Próximos Passos

1. **Configurar Credenciais**: Adicione suas credenciais do EmailJS
2. **Testar**: Execute testes de configuração
3. **Personalizar**: Ajuste o template conforme necessário
4. **Monitorar**: Acompanhe o envio de e-mails em produção

## Suporte

Para dúvidas ou problemas:

- E-mail: suporte@sugflora.com
- Documentação: [EmailJS Docs](https://www.emailjs.com/docs/)
- Issues: Abra uma issue no repositório do projeto
