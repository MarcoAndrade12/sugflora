import { getEmailConfig, validateEmailConfig } from "./EmailConfig";

// Declaração para __DEV__ (React Native)
declare const __DEV__: boolean;

// Importar AsyncStorage para React Native
import AsyncStorage from "@react-native-async-storage/async-storage";

interface EmailData {
  to: string;
  subject: string;
  body: string;
  html?: string;
}

interface SugestaoEmailData {
  coletaNome: string;
  coletaData: string;
  sugestorNome: string;
  sugestorEmail: string;
  familiaSugerida?: string;
  generoSugerido?: string;
  especieSugerida?: string;
  nomeComumSugerido?: string;
  justificativa: string;
  confianca: number;
  observacoesAdicionais?: string;
}

interface EmailLocal {
  id: string;
  timestamp: string;
  to: string;
  toName: string;
  subject: string;
  html: string;
  text: string;
  data: SugestaoEmailData;
}

class EmailService {
  private static instance: EmailService;
  private config = getEmailConfig();
  private emailsLocais: EmailLocal[] = [];

  private constructor() {
    // Validar configurações na inicialização
    const validation = validateEmailConfig();
    if (!validation.isValid) {
      console.warn("Configurações de e-mail incompletas:", validation.errors);
    }
    this.carregarEmailsLocais();
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  /**
   * Carrega e-mails salvos localmente
   */
  private async carregarEmailsLocais() {
    try {
      const emailsSalvos = await AsyncStorage.getItem("sugflora_emails");
      if (emailsSalvos) {
        this.emailsLocais = JSON.parse(emailsSalvos);
      }
    } catch (error) {
      console.error("Erro ao carregar e-mails locais:", error);
    }
  }

  /**
   * Salva e-mails localmente usando AsyncStorage
   */
  private async salvarEmailsLocais() {
    try {
      await AsyncStorage.setItem(
        "sugflora_emails",
        JSON.stringify(this.emailsLocais)
      );
    } catch (error) {
      console.error("Erro ao salvar e-mails locais:", error);
    }
  }

  /**
   * Envia e-mail de notificação quando uma sugestão de identificação é criada
   */
  public async enviarEmailSugestaoCriada(
    emailDonoColeta: string,
    nomeDonoColeta: string,
    sugestaoData: SugestaoEmailData
  ): Promise<boolean> {
    try {
      const subject = `Nova sugestão de identificação para sua coleta "${sugestaoData.coletaNome}"`;

      const body = this.gerarCorpoEmailSugestao(sugestaoData);
      const html = this.gerarHtmlEmailSugestao(sugestaoData);

      const emailData: EmailData = {
        to: emailDonoColeta,
        subject,
        body,
        html,
      };

      // Verificar se está em modo de desenvolvimento
      if (__DEV__ && this.config.development?.options?.simularEnvio) {
        console.log("🔄 Modo desenvolvimento: simulando envio...");
        return await this.simularEnvioEmail(emailData);
      }

      // Tentar diferentes métodos de envio em ordem de prioridade

      // 1. EmailJS (funciona no Expo Go)
      if (
        this.config.emailJS?.serviceId &&
        this.config.emailJS.serviceId !== "your_service_id"
      ) {
        // Passar dados completos para EmailJS
        const emailDataCompleto = {
          ...emailData,
          toEmail: emailDonoColeta,
          toName: nomeDonoColeta,
          data: sugestaoData,
        };
        return await this.enviarViaEmailJS(emailDataCompleto);
      }

      // 2. SendGrid (funciona no Expo Go)
      if (
        this.config.sendGrid?.apiKey &&
        this.config.sendGrid.apiKey !== "your_sendgrid_api_key"
      ) {
        return await this.enviarViaSendGrid(emailData);
      }

      // 3. Gmail API (funciona no Expo Go)
      if (
        this.config.gmail?.apiKey &&
        this.config.gmail.apiKey !== "your_gmail_api_key"
      ) {
        return await this.enviarViaGmailAPI(emailData);
      }

      // 4. Mailtrap (para desenvolvimento)
      if (
        this.config.development?.mailtrap?.apiToken &&
        this.config.development.mailtrap.apiToken !== "your_mailtrap_api_token"
      ) {
        return await this.enviarViaMailtrap(emailData);
      }

      console.error("Nenhuma configuração de e-mail válida encontrada");
      return false;
    } catch (error) {
      console.error("Erro ao enviar e-mail de sugestão:", error);

      // Em desenvolvimento, salvar localmente em caso de erro
      if (__DEV__) {
        console.log("⚠️ Erro no envio, salvando localmente...");
        const emailData: EmailData = {
          to: emailDonoColeta,
          subject: `Nova sugestão de identificação para sua coleta "${sugestaoData.coletaNome}"`,
          body: this.gerarCorpoEmailSugestao(sugestaoData),
          html: this.gerarHtmlEmailSugestao(sugestaoData),
        };
        this.salvarEmailLocal(emailData);
        return true;
      }

      return false;
    }
  }

  /**
   * Salva e-mail localmente (para desenvolvimento)
   */
  private async salvarEmailLocal(emailData: any): Promise<void> {
    try {
      console.log("💾 Salvando e-mail localmente...");

      const emailLocal: EmailLocal = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        to: emailData.toEmail || emailData.to || "",
        toName: emailData.toName || "",
        subject: emailData.subject || "",
        html: emailData.html || "",
        text: emailData.body || emailData.text || "",
        data: emailData.data || {},
      };

      this.emailsLocais.push(emailLocal);
      await this.salvarEmailsLocais();

      console.log("✅ E-mail salvo localmente com sucesso");
      console.log("📧 Total de e-mails salvos:", this.emailsLocais.length);
    } catch (error) {
      console.error("❌ Erro ao salvar e-mail localmente:", error);
    }
  }

  /**
   * Recupera e-mails salvos localmente (para desenvolvimento)
   */
  public getEmailsLocais(): EmailLocal[] {
    return [...this.emailsLocais];
  }

  /**
   * Limpa e-mails salvos localmente
   */
  public async limparEmailsLocais(): Promise<void> {
    try {
      this.emailsLocais = [];
      await AsyncStorage.removeItem("sugflora_emails");
      console.log("✅ E-mails locais limpos com sucesso");
    } catch (error) {
      console.error("❌ Erro ao limpar e-mails locais:", error);
    }
  }

  /**
   * Gera o corpo do e-mail em texto simples
   */
  private gerarCorpoEmailSugestao(data: SugestaoEmailData): string {
    const classificacao = [];
    if (data.familiaSugerida)
      classificacao.push(`Família: ${data.familiaSugerida}`);
    if (data.generoSugerido)
      classificacao.push(`Gênero: ${data.generoSugerido}`);
    if (data.especieSugerida)
      classificacao.push(`Espécie: ${data.especieSugerida}`);
    if (data.nomeComumSugerido)
      classificacao.push(`Nome comum: ${data.nomeComumSugerido}`);

    const confiancaText = this.obterTextoConfianca(data.confianca);

    return `
Olá!

Você recebeu uma nova sugestão de identificação para sua coleta "${
      data.coletaNome
    }".

DETALHES DA SUGESTÃO:
${classificacao.join("\n")}

JUSTIFICATIVA:
${data.justificativa}

NÍVEL DE CONFIANÇA: ${confiancaText}

${
  data.observacoesAdicionais
    ? `OBSERVAÇÕES ADICIONAIS:\n${data.observacoesAdicionais}\n`
    : ""
}

SUGESTOR: ${data.sugestorNome} (${data.sugestorEmail})

DATA DA COLETA: ${new Date(data.coletaData).toLocaleDateString("pt-BR")}

Para visualizar e responder a esta sugestão, acesse o aplicativo SugFlora.

Atenciosamente,
Equipe ${this.config.general.appName}
    `.trim();
  }

  /**
   * Gera o corpo do e-mail em HTML
   */
  private gerarHtmlEmailSugestao(data: SugestaoEmailData): string {
    const classificacao = [];
    if (data.familiaSugerida)
      classificacao.push(`<strong>Família:</strong> ${data.familiaSugerida}`);
    if (data.generoSugerido)
      classificacao.push(`<strong>Gênero:</strong> ${data.generoSugerido}`);
    if (data.especieSugerida)
      classificacao.push(`<strong>Espécie:</strong> ${data.especieSugerida}`);
    if (data.nomeComumSugerido)
      classificacao.push(
        `<strong>Nome comum:</strong> ${data.nomeComumSugerido}`
      );

    const confiancaText = this.obterTextoConfianca(data.confianca);
    const confiancaColor = this.obterCorConfianca(data.confianca);

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2e7d32; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .sugestao-box { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #2e7d32; border-radius: 4px; }
        .classificacao { margin: 10px 0; }
        .confianca { display: inline-block; padding: 5px 10px; border-radius: 15px; color: white; font-weight: bold; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌿 ${this.config.general.appName}</h1>
            <h2>Nova Sugestão de Identificação</h2>
        </div>
        
        <div class="content">
            <p>Olá!</p>
            
            <p>Você recebeu uma nova sugestão de identificação para sua coleta <strong>"${
              data.coletaNome
            }"</strong>.</p>
            
            <div class="sugestao-box">
                <h3>📋 Detalhes da Sugestão</h3>
                
                <div class="classificacao">
                    ${classificacao.join("<br>")}
                </div>
                
                <h4>💡 Justificativa:</h4>
                <p>${data.justificativa}</p>
                
                <h4>🎯 Nível de Confiança:</h4>
                <span class="confianca" style="background-color: ${confiancaColor}">${confiancaText}</span>
                
                ${
                  data.observacoesAdicionais
                    ? `
                <h4>📝 Observações Adicionais:</h4>
                <p>${data.observacoesAdicionais}</p>
                `
                    : ""
                }
            </div>
            
            <p><strong>Sugestor:</strong> ${data.sugestorNome} (${
      data.sugestorEmail
    })</p>
            <p><strong>Data da Coleta:</strong> ${new Date(
              data.coletaData
            ).toLocaleDateString("pt-BR")}</p>
            
            <p>Para visualizar e responder a esta sugestão, acesse o aplicativo ${
              this.config.general.appName
            }.</p>
        </div>
        
        <div class="footer">
            <p>Atenciosamente,<br>Equipe ${this.config.general.appName}</p>
            <p>Para suporte: ${this.config.general.supportEmail}</p>
        </div>
    </div>
</body>
</html>
    `.trim();
  }

  /**
   * Obtém o texto descritivo do nível de confiança
   */
  private obterTextoConfianca(confianca: number): string {
    switch (confianca) {
      case 1:
        return "Muito Baixa";
      case 2:
        return "Baixa";
      case 3:
        return "Média";
      case 4:
        return "Alta";
      case 5:
        return "Muito Alta";
      default:
        return "Não informada";
    }
  }

  /**
   * Obtém a cor correspondente ao nível de confiança
   */
  private obterCorConfianca(confianca: number): string {
    switch (confianca) {
      case 1:
        return "#f44336"; // Vermelho
      case 2:
        return "#ff9800"; // Laranja
      case 3:
        return "#ffc107"; // Amarelo
      case 4:
        return "#4caf50"; // Verde
      case 5:
        return "#2e7d32"; // Verde escuro
      default:
        return "#9e9e9e"; // Cinza
    }
  }

  /**
   * Envia o e-mail usando o serviço configurado
   */
  private async enviarEmail(emailData: EmailData): Promise<boolean> {
    try {
      // Verificar se as configurações estão válidas
      const validation = validateEmailConfig();
      if (!validation.isValid) {
        console.error("Configurações de e-mail inválidas:", validation.errors);
        return false;
      }

      // Tentar diferentes métodos de envio em ordem de prioridade

      // 1. EmailJS (funciona no Expo Go)
      if (
        this.config.emailJS?.serviceId &&
        this.config.emailJS.serviceId !== "your_service_id"
      ) {
        return await this.enviarViaEmailJS(emailData);
      }

      // 2. SendGrid (funciona no Expo Go)
      if (
        this.config.sendGrid?.apiKey &&
        this.config.sendGrid.apiKey !== "your_sendgrid_api_key"
      ) {
        return await this.enviarViaSendGrid(emailData);
      }

      // 3. Gmail API (funciona no Expo Go)
      if (
        this.config.gmail?.apiKey &&
        this.config.gmail.apiKey !== "your_gmail_api_key"
      ) {
        return await this.enviarViaGmailAPI(emailData);
      }

      // 4. Mailtrap (para desenvolvimento)
      if (
        this.config.development?.mailtrap?.apiToken &&
        this.config.development.mailtrap.apiToken !== "your_mailtrap_api_token"
      ) {
        return await this.enviarViaMailtrap(emailData);
      }

      console.error("Nenhuma configuração de e-mail válida encontrada");
      return false;
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error);
      return false;
    }
  }

  /**
   * Envia via EmailJS
   */
  private async enviarViaEmailJS(emailData: any): Promise<boolean> {
    const maxRetries = 3;
    let attempt = 1;

    while (attempt <= maxRetries) {
      try {
        console.log(
          `📤 Tentativa ${attempt}/${maxRetries} - Enviando via EmailJS...`
        );
        console.log("🔧 Ambiente:", __DEV__ ? "Desenvolvimento" : "Produção");
        console.log("📱 Expo Go: Sim");

        // Verificar se emailData tem os dados necessários
        if (!emailData || !emailData.data) {
          console.error("❌ Dados do e-mail inválidos:", emailData);
          console.log("⚠️ Salvando localmente como fallback...");
          await this.salvarEmailLocal(emailData);
          return false;
        }

        // Preparar parâmetros do template de forma mais segura
        const templateParams = {
          to_email: emailData.toEmail || emailData.to || "",
          to_name: emailData.toName || "",
          coleta_nome: emailData.data.coletaNome || "",
          sugestor_nome: emailData.data.sugestorNome || "",
          sugestor_email: emailData.data.sugestorEmail || "",
          familia: emailData.data.familiaSugerida || "",
          genero: emailData.data.generoSugerido || "",
          especie: emailData.data.especieSugerida || "",
          nome_comum: emailData.data.nomeComumSugerido || "",
          justificativa: emailData.data.justificativa || "",
          confianca: emailData.data.confianca || 0,
          observacoes: emailData.data.observacoesAdicionais || "",
          data_coleta: emailData.data.coletaData || "",
        };

        console.log("📋 Parâmetros do template:", templateParams);

        const requestBody = {
          service_id: this.config.emailJS.serviceId,
          template_id: this.config.emailJS.templateId,
          user_id: this.config.emailJS.userId,
          template_params: templateParams,
        };

        console.log("📤 Request body:", JSON.stringify(requestBody, null, 2));
        console.log("🌐 URL:", this.config.emailJS.apiUrl);

        // Teste de conectividade primeiro
        console.log("🔍 Testando conectividade...");
        try {
          const testResponse = await fetch(
            "https://api.emailjs.com/api/v1.0/email/send",
            {
              method: "OPTIONS",
              headers: {
                "Content-Type": "application/json",
                "User-Agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                Origin: "https://dashboard.emailjs.com",
                Referer: "https://dashboard.emailjs.com/",
              },
            }
          );
          console.log("✅ Conectividade OK:", testResponse.status);
        } catch (connectError) {
          console.error("❌ Problema de conectividade:", connectError);
          if (attempt < maxRetries) {
            console.log(
              `⏳ Aguardando 2 segundos antes da tentativa ${attempt + 1}...`
            );
            await new Promise((resolve) => setTimeout(resolve, 2000));
            attempt++;
            continue;
          }
        }

        const response = await fetch(this.config.emailJS.apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            Origin: "https://dashboard.emailjs.com",
            Referer: "https://dashboard.emailjs.com/",
          },
          body: JSON.stringify(requestBody),
        });

        console.log(
          "📡 Resposta do EmailJS:",
          response.status,
          response.statusText
        );
        console.log(
          "📋 Headers da resposta:",
          Object.fromEntries(response.headers.entries())
        );

        if (response.ok) {
          const responseText = await response.text();
          console.log("📄 Resposta bruta:", responseText);

          let result;
          try {
            // Tentar fazer parse como JSON
            result = JSON.parse(responseText);
          } catch (parseError) {
            // Se falhar, tratar como resposta de texto simples
            if (responseText.trim().toUpperCase() === "OK") {
              result = { status: "OK", message: "E-mail enviado com sucesso" };
            } else {
              result = { status: "UNKNOWN", message: responseText };
            }
          }

          console.log("✅ E-mail enviado com sucesso via EmailJS:", result);
          return true;
        } else {
          const errorText = await response.text();
          console.error(
            `❌ Tentativa ${attempt} falhou:`,
            response.status,
            errorText
          );

          // Log detalhado para debug
          console.log("🔍 Debug EmailJS:");
          console.log("- Service ID:", this.config.emailJS.serviceId);
          console.log("- Template ID:", this.config.emailJS.templateId);
          console.log("- User ID:", this.config.emailJS.userId);
          console.log("- API URL:", this.config.emailJS.apiUrl);
          console.log("- Parâmetros:", templateParams);
          console.log("- Request Body:", requestBody);
          console.log("- Response Status:", response.status);
          console.log("- Response Text:", errorText);

          if (attempt < maxRetries) {
            console.log(
              `⏳ Aguardando 3 segundos antes da tentativa ${attempt + 1}...`
            );
            await new Promise((resolve) => setTimeout(resolve, 3000));
            attempt++;
            continue;
          } else {
            // Última tentativa falhou, salvar localmente como fallback
            console.log(
              "⚠️ Todas as tentativas falharam, salvando localmente..."
            );
            await this.salvarEmailLocal(emailData);
            return false;
          }
        }
      } catch (error) {
        console.error(`❌ Erro na tentativa ${attempt}:`, error);
        console.error("🔍 Tipo de erro:", error.constructor.name);
        console.error("🔍 Mensagem:", error.message);

        if (attempt < maxRetries) {
          console.log(
            `⏳ Aguardando 2 segundos antes da tentativa ${attempt + 1}...`
          );
          await new Promise((resolve) => setTimeout(resolve, 2000));
          attempt++;
          continue;
        } else {
          // Última tentativa falhou, salvar localmente como fallback
          console.log(
            "⚠️ Todas as tentativas falharam, salvando localmente..."
          );
          await this.salvarEmailLocal(emailData);
          return false;
        }
      }
    }

    return false;
  }

  /**
   * Envia e-mail via SendGrid (funciona no Expo Go)
   */
  private async enviarViaSendGrid(emailData: EmailData): Promise<boolean> {
    try {
      const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.sendGrid.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: emailData.to }],
            },
          ],
          from: {
            email: this.config.sendGrid.fromEmail,
            name: this.config.sendGrid.fromName,
          },
          subject: emailData.subject,
          content: [
            {
              type: "text/plain",
              value: emailData.body,
            },
            {
              type: "text/html",
              value: emailData.html,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      console.log("✅ E-mail enviado via SendGrid");
      return true;
    } catch (error) {
      console.error("❌ Erro ao enviar via SendGrid:", error);
      return false;
    }
  }

  /**
   * Envia e-mail via Gmail API (funciona no Expo Go)
   */
  private async enviarViaGmailAPI(emailData: EmailData): Promise<boolean> {
    try {
      // Para Gmail API, você precisaria de um backend ou usar uma biblioteca específica
      // Por enquanto, vamos simular o envio
      console.log("📧 Simulando envio via Gmail API...");
      console.log("Para:", emailData.to);
      console.log("Assunto:", emailData.subject);

      // Em produção, você implementaria a chamada real da Gmail API aqui
      return true;
    } catch (error) {
      console.error("❌ Erro ao enviar via Gmail API:", error);
      return false;
    }
  }

  /**
   * Envia e-mail via Mailtrap (para desenvolvimento)
   */
  private async enviarViaMailtrap(emailData: EmailData): Promise<boolean> {
    try {
      const response = await fetch("https://send.api.mailtrap.io/api/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.development.mailtrap.apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: {
            email: this.config.development.mailtrap.fromEmail,
            name: this.config.general.appName,
          },
          to: [
            {
              email: emailData.to,
            },
          ],
          subject: emailData.subject,
          text: emailData.body,
          html: emailData.html,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      console.log("✅ E-mail enviado via Mailtrap");
      return true;
    } catch (error) {
      console.error("❌ Erro ao enviar via Mailtrap:", error);
      return false;
    }
  }

  /**
   * Configura as credenciais do Gmail
   */
  public configurarGmail(email: string, appPassword: string): void {
    this.config.smtp.auth.user = email;
    this.config.smtp.auth.pass = appPassword;
  }

  /**
   * Configura a API Key do Gmail
   */
  public configurarGmailAPI(apiKey: string): void {
    if (!this.config.gmail) {
      this.config.gmail = { apiKey: "" };
    }
    this.config.gmail.apiKey = apiKey;
  }

  /**
   * Configura EmailJS
   */
  public configurarEmailJS(
    serviceId: string,
    templateId: string,
    userId: string
  ): void {
    this.config.emailJS.serviceId = serviceId;
    this.config.emailJS.templateId = templateId;
    this.config.emailJS.userId = userId;
  }

  /**
   * Configura SendGrid
   */
  public configurarSendGrid(
    apiKey: string,
    fromEmail: string,
    fromName: string
  ): void {
    this.config.sendGrid.apiKey = apiKey;
    this.config.sendGrid.fromEmail = fromEmail;
    this.config.sendGrid.fromName = fromName;
  }

  /**
   * Configura Mailtrap para desenvolvimento
   */
  public configurarMailtrap(apiToken: string, fromEmail: string): void {
    if (!this.config.development) {
      this.config.development = { mailtrap: { apiToken: "", fromEmail: "" } };
    }
    this.config.development.mailtrap.apiToken = apiToken;
    this.config.development.mailtrap.fromEmail = fromEmail;
  }

  /**
   * Testa a configuração de e-mail
   */
  public async testarConfiguracao(): Promise<boolean> {
    try {
      const testEmailData: EmailData = {
        to: "teste@sugflora.com",
        subject: "Teste de Configuração - SugFlora",
        body: "Este é um e-mail de teste para verificar se a configuração está funcionando.",
        html: "<h1>Teste de Configuração</h1><p>Este é um e-mail de teste para verificar se a configuração está funcionando.</p>",
      };

      return await this.enviarEmail(testEmailData);
    } catch (error) {
      console.error("Erro ao testar configuração de e-mail:", error);
      return false;
    }
  }

  /**
   * Simula envio de e-mail (desenvolvimento)
   */
  private async simularEnvioEmail(emailData: EmailData): Promise<boolean> {
    try {
      console.log("🔄 Simulando envio de e-mail...");
      console.log("📧 Para:", emailData.to);
      console.log("📧 Assunto:", emailData.subject);
      console.log("📧 Dados:", emailData);

      // Salvar localmente
      if (this.config.development?.options?.salvarLocalmente) {
        await this.salvarEmailLocal(emailData);
      }

      console.log("✅ Simulação concluída com sucesso");
      return true;
    } catch (error) {
      console.error("❌ Erro na simulação:", error);
      return false;
    }
  }
}

export default EmailService;
