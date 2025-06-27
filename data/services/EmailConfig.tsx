// Declaração para __DEV__ (React Native)
declare const __DEV__: boolean;

// Configurações para o serviço de e-mail
export const EmailConfig = {
  // Configurações para EmailJS (exemplo)
  emailJS: {
    // ⚠️ SUBSTITUA ESTES VALORES PELOS SEUS DADOS REAIS DO EMAILJS ⚠️
    serviceId: "service_jvs130a", // Ex: 'service_abc123'
    templateId: "template_lfr891s", // Template ID que funcionou
    userId: "9qZpkV8xS_YLVkW9G", // Ex: 'user_def456'
    apiUrl: "https://api.emailjs.com/api/v1.0/email/send",
  },

  // Configurações para Gmail API
  gmail: {
    // ⚠️ SUBSTITUA PELA SUA API KEY DO GMAIL ⚠️
    apiKey: "your_gmail_api_key", // Ex: 'ya29.a0AfH6SMC...'
    clientId: "your_gmail_client_id",
    clientSecret: "your_gmail_client_secret",
  },

  // Configurações para outros serviços de e-mail
  sendGrid: {
    apiKey: "your_sendgrid_api_key", // Substitua pela sua API Key do SendGrid
    fromEmail: "noreply@sugflora.com",
    fromName: "SugFlora",
  },

  // Configurações para SMTP direto (Gmail com App Password)
  smtp: {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      // ⚠️ SUBSTITUA PELO SEU EMAIL E APP PASSWORD DO GMAIL ⚠️
      user: "your_email@gmail.com", // Ex: 'seuemail@gmail.com'
      pass: "your_app_password", // Ex: 'abcd efgh ijkl mnop'
    },
  },

  // Configurações para desenvolvimento local
  development: {
    // Mailtrap para desenvolvimento (opcional)
    mailtrap: {
      // ⚠️ SUBSTITUA PELO SEU TOKEN DO MAILTRAP ⚠️
      apiToken: "your_mailtrap_api_token", // Ex: 'api:1234567890abcdef...'
      fromEmail: "noreply@sugflora.com",
    },

    // Configurações específicas para desenvolvimento
    options: {
      salvarLocalmente: true, // Salvar e-mails no localStorage
      mostrarConsole: true, // Mostrar detalhes no console
      simularEnvio: false, // DESABILITADO: Forçar envio real
    },
  },

  // Configurações gerais
  general: {
    appName: "SugFlora",
    supportEmail: "suporte@sugflora.com",
    website: "https://sugflora.com",
  },
};

// Função para obter a configuração ativa baseada no ambiente
export const getEmailConfig = () => {
  // Sempre usar configurações reais (EmailJS está configurado)
  return EmailConfig;
};

// Função para validar se as configurações de e-mail estão corretas
export const validateEmailConfig = () => {
  const config = getEmailConfig();

  const errors = [];

  // Validar Gmail API (prioridade)
  if (config.gmail?.apiKey && config.gmail.apiKey !== "your_gmail_api_key") {
    // Gmail API configurado corretamente
    return { isValid: true, errors: [] };
  }

  // Validar SMTP Gmail
  if (
    config.smtp?.auth?.user &&
    config.smtp.auth.user !== "your_email@gmail.com" &&
    config.smtp.auth.pass &&
    config.smtp.auth.pass !== "your_app_password"
  ) {
    // SMTP Gmail configurado corretamente
    return { isValid: true, errors: [] };
  }

  // Validar EmailJS
  if (
    config.emailJS?.serviceId &&
    config.emailJS.serviceId !== "your_service_id" &&
    config.emailJS.serviceId !== "service_abc123" &&
    config.emailJS.serviceId !== "test_service_id" &&
    config.emailJS.templateId &&
    config.emailJS.templateId !== "your_template_id" &&
    config.emailJS.templateId !== "template_xyz789" &&
    config.emailJS.templateId !== "test_template_id" &&
    config.emailJS.userId &&
    config.emailJS.userId !== "your_user_id" &&
    config.emailJS.userId !== "user_def456" &&
    config.emailJS.userId !== "test_user_id"
  ) {
    // EmailJS configurado corretamente
    return { isValid: true, errors: [] };
  }

  // Validar SendGrid
  if (
    config.sendGrid?.apiKey &&
    config.sendGrid.apiKey !== "your_sendgrid_api_key"
  ) {
    // SendGrid configurado corretamente
    return { isValid: true, errors: [] };
  }

  // Validar Mailtrap (para desenvolvimento)
  if (
    config.development?.mailtrap?.apiToken &&
    config.development.mailtrap.apiToken !== "your_mailtrap_api_token"
  ) {
    // Mailtrap configurado corretamente
    return { isValid: true, errors: [] };
  }

  // Se chegou aqui, nenhuma configuração válida foi encontrada
  errors.push("Nenhuma configuração de e-mail válida encontrada");
  errors.push("Configure Gmail API, SMTP Gmail, EmailJS, SendGrid ou Mailtrap");

  return {
    isValid: false,
    errors,
  };
};
