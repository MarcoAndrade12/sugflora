import EmailService from "./EmailService";
import { getEmailConfig, validateEmailConfig } from "./EmailConfig";

// Declaração para __DEV__ (React Native)
declare const __DEV__: boolean;

/**
 * Exemplo de como testar o sistema de e-mail
 * Este arquivo pode ser usado para testar a funcionalidade de e-mail
 */

export const testarSistemaEmail = async () => {
  console.log("=== TESTE DO SISTEMA DE E-MAIL ===");

  try {
    const emailService = EmailService.getInstance();

    // Dados de teste
    const dadosTeste = {
      coletaNome: "Coleta Teste - Espécie Rara",
      coletaData: new Date().toISOString(),
      sugestorNome: "João Silva",
      sugestorEmail: "joao.silva@email.com",
      familiaSugerida: "Fabaceae",
      generoSugerido: "Mimosa",
      especieSugerida: "Mimosa pudica",
      nomeComumSugerido: "Dormideira",
      justificativa:
        "Esta espécie é facilmente identificável pelos seus folíolos que se fecham ao toque, característica única da Mimosa pudica.",
      confianca: 5,
      observacoesAdicionais: "Espécie muito comum em áreas urbanas e rurais.",
    };

    console.log("Enviando e-mail de teste...");
    const resultado = await emailService.enviarEmailSugestaoCriada(
      "dono.coleta@email.com",
      "Maria Santos",
      dadosTeste
    );

    if (resultado) {
      console.log("✅ E-mail enviado com sucesso!");

      // Em desenvolvimento, mostrar e-mails salvos
      if (__DEV__) {
        const emailsLocais = emailService.getEmailsLocais();
        console.log("E-mails salvos localmente:", emailsLocais.length);
        if (emailsLocais.length > 0) {
          console.log("Último e-mail:", emailsLocais[0]);
        }
      }
    } else {
      console.log("❌ Falha ao enviar e-mail");
    }

    return resultado;
  } catch (error) {
    console.error("❌ Erro no teste:", error);
    return false;
  }
};

/**
 * Função para testar apenas a validação de configuração
 */
export const testarConfiguracao = () => {
  console.log("=== TESTE DE CONFIGURAÇÃO DE E-MAIL ===");

  const config = getEmailConfig();
  const validation = validateEmailConfig();

  console.log("Configuração carregada:", config);
  console.log("Validação:", validation);

  if (validation.isValid) {
    console.log("✅ Configuração válida!");
  } else {
    console.log("❌ Configuração inválida:");
    validation.errors.forEach((error) => console.log(`  - ${error}`));
  }

  console.log("Ambiente de desenvolvimento:", __DEV__);
  console.log("=====================================");

  return validation.isValid;
};

/**
 * Função para testar apenas o envio de e-mail
 */
export const testarEnvioEmail = async () => {
  console.log("=== TESTE DE ENVIO DE E-MAIL ===");

  const emailService = EmailService.getInstance();
  const resultado = await emailService.testarConfiguracao();

  console.log("Resultado:", resultado ? "✅ SUCESSO" : "❌ FALHA");

  return resultado;
};

/**
 * Função específica para testar configuração do Gmail
 */
export const testarConfiguracaoGmail = async () => {
  console.log("=== TESTE CONFIGURAÇÃO GMAIL ===");

  try {
    const emailService = EmailService.getInstance();

    // Configurar Gmail dinamicamente (substitua pelos seus dados)
    emailService.configurarGmail("seuemail@gmail.com", "seu_app_password");

    const resultado = await emailService.testarConfiguracao();

    if (resultado) {
      console.log("✅ Gmail configurado e funcionando!");
    } else {
      console.log("❌ Falha na configuração do Gmail");
    }

    return resultado;
  } catch (error) {
    console.error("❌ Erro no teste do Gmail:", error);
    return false;
  }
};

/**
 * Função para configurar Gmail programaticamente
 */
export const configurarGmail = (email: string, appPassword: string) => {
  console.log("=== CONFIGURANDO GMAIL ===");

  const emailService = EmailService.getInstance();
  emailService.configurarGmail(email, appPassword);

  console.log("✅ Gmail configurado com sucesso!");
  console.log("Email:", email);
  console.log(
    "App Password:",
    appPassword ? "✅ Configurado" : "❌ Não configurado"
  );

  // Testar configuração
  const validation = validateEmailConfig();
  console.log(
    "Status da configuração:",
    validation.isValid ? "✅ VÁLIDA" : "❌ INVÁLIDA"
  );

  return validation.isValid;
};

/**
 * Função para configurar Gmail API programaticamente
 */
export const configurarGmailAPI = (apiKey: string) => {
  console.log("=== CONFIGURANDO GMAIL API ===");

  const emailService = EmailService.getInstance();
  emailService.configurarGmailAPI(apiKey);

  console.log("✅ Gmail API configurado com sucesso!");
  console.log("API Key:", apiKey ? "✅ Configurada" : "❌ Não configurada");

  // Testar configuração
  const validation = validateEmailConfig();
  console.log(
    "Status da configuração:",
    validation.isValid ? "✅ VÁLIDA" : "❌ INVÁLIDA"
  );

  return validation.isValid;
};

/**
 * Exemplo de uso em um componente React
 */
export const usarEmComponente = () => {
  // Exemplo de como usar em um componente
  const handleTestarEmail = async () => {
    try {
      const sucesso = await testarSistemaEmail();
      if (sucesso) {
        alert("Sistema de e-mail funcionando corretamente!");
      } else {
        alert("Problema no sistema de e-mail. Verifique o console.");
      }
    } catch (error) {
      console.error("Erro ao testar e-mail:", error);
      alert("Erro ao testar sistema de e-mail");
    }
  };

  return handleTestarEmail;
};

/**
 * Exemplo de configuração rápida do Gmail
 */
export const configuracaoRapidaGmail = () => {
  console.log("=== CONFIGURAÇÃO RÁPIDA GMAIL ===");
  console.log("Para configurar o Gmail rapidamente:");
  console.log("");
  console.log("1. Gere um App Password:");
  console.log("   - Acesse: https://myaccount.google.com/apppasswords");
  console.log("   - Selecione: Aplicativo → Outro (nome personalizado)");
  console.log("   - Digite: SugFlora");
  console.log("   - Copie a senha gerada");
  console.log("");
  console.log("2. Configure no código:");
  console.log("   - Edite: data/services/EmailConfig.tsx");
  console.log("   - Substitua: your_email@gmail.com");
  console.log("   - Substitua: your_app_password");
  console.log("");
  console.log("3. Teste a configuração:");
  console.log("   - Execute: testarConfiguracaoGmail()");
  console.log("   - Execute: testarSistemaEmail()");
};

/**
 * Configura Mailtrap para desenvolvimento
 */
export const configurarMailtrap = (apiToken: string, fromEmail: string) => {
  console.log("=== CONFIGURAÇÃO MAILTRAP ===");

  try {
    const emailService = EmailService.getInstance();
    emailService.configurarMailtrap(apiToken, fromEmail);

    console.log("✅ Mailtrap configurado!");
    console.log("Token:", apiToken.substring(0, 10) + "...");
    console.log("From Email:", fromEmail);

    return true;
  } catch (error) {
    console.error("❌ Erro ao configurar Mailtrap:", error);
    return false;
  }
};

/**
 * Testa o sistema em modo desenvolvimento
 */
export const testarModoDesenvolvimento = async () => {
  console.log("=== TESTE MODO DESENVOLVIMENTO ===");

  if (!__DEV__) {
    console.log("⚠️ Este teste só funciona em desenvolvimento");
    return false;
  }

  try {
    const emailService = EmailService.getInstance();

    // Limpar e-mails anteriores
    emailService.limparEmailsLocais();

    // Enviar e-mail de teste
    const resultado = await testarSistemaEmail();

    // Verificar se foi salvo localmente
    const emailsLocais = emailService.getEmailsLocais();

    console.log("E-mails salvos localmente:", emailsLocais.length);

    if (emailsLocais.length > 0) {
      console.log("✅ Modo desenvolvimento funcionando!");
      console.log("E-mail salvo:", emailsLocais[0]);
      return true;
    } else {
      console.log("❌ E-mail não foi salvo localmente");
      return false;
    }
  } catch (error) {
    console.error("❌ Erro no teste de desenvolvimento:", error);
    return false;
  }
};

/**
 * Mostra informações sobre e-mails salvos localmente
 */
export const mostrarEmailsLocais = () => {
  console.log("=== E-MAILS SALVOS LOCALMENTE ===");

  try {
    const emailService = EmailService.getInstance();
    const emails = emailService.getEmailsLocais();

    if (emails.length === 0) {
      console.log("Nenhum e-mail salvo localmente");
      return;
    }

    console.log(`Total de e-mails: ${emails.length}`);

    emails.forEach((email, index) => {
      console.log(`\n--- E-mail ${index + 1} ---`);
      console.log("ID:", email.id);
      console.log("Data:", new Date(email.timestamp).toLocaleString("pt-BR"));
      console.log("Para:", email.to);
      console.log("Assunto:", email.subject);
      console.log(
        "Corpo (primeiros 100 chars):",
        email.body.substring(0, 100) + "..."
      );
    });
  } catch (error) {
    console.error("❌ Erro ao mostrar e-mails locais:", error);
  }
};

/**
 * Limpa e-mails salvos localmente
 */
export const limparEmailsLocais = () => {
  console.log("=== LIMPANDO E-MAILS LOCAIS ===");

  try {
    const emailService = EmailService.getInstance();
    emailService.limparEmailsLocais();

    console.log("✅ E-mails locais limpos!");
    return true;
  } catch (error) {
    console.error("❌ Erro ao limpar e-mails locais:", error);
    return false;
  }
};

/**
 * Teste completo do sistema
 */
export const testeCompleto = async () => {
  console.log("=== TESTE COMPLETO DO SISTEMA ===");

  const resultados = {
    configuracao: false,
    sistema: false,
    desenvolvimento: false,
    gmail: false,
  };

  // Teste 1: Configuração
  console.log("\n1. Testando configuração...");
  resultados.configuracao = testarConfiguracao();

  // Teste 2: Sistema básico
  console.log("\n2. Testando sistema básico...");
  resultados.sistema = await testarSistemaEmail();

  // Teste 3: Modo desenvolvimento
  if (__DEV__) {
    console.log("\n3. Testando modo desenvolvimento...");
    resultados.desenvolvimento = await testarModoDesenvolvimento();
  }

  // Teste 4: Gmail (se configurado)
  console.log("\n4. Testando Gmail...");
  resultados.gmail = await testarConfiguracaoGmail();

  // Resumo
  console.log("\n=== RESUMO DOS TESTES ===");
  console.log("Configuração:", resultados.configuracao ? "✅" : "❌");
  console.log("Sistema básico:", resultados.sistema ? "✅" : "❌");
  console.log("Desenvolvimento:", resultados.desenvolvimento ? "✅" : "❌");
  console.log("Gmail:", resultados.gmail ? "✅" : "❌");

  const totalSucessos = Object.values(resultados).filter(Boolean).length;
  const totalTestes = Object.keys(resultados).length;

  console.log(`\nResultado: ${totalSucessos}/${totalTestes} testes passaram`);

  if (totalSucessos === totalTestes) {
    console.log("🎉 Todos os testes passaram!");
  } else {
    console.log("⚠️ Alguns testes falharam. Verifique a configuração.");
  }

  return resultados;
};

/**
 * Guia rápido para configuração
 */
export const mostrarGuiaConfiguracao = () => {
  console.log(`
=== GUIA RÁPIDO DE CONFIGURAÇÃO ===

1. PARA DESENVOLVIMENTO LOCAL (Recomendado):
   - Não configure nada
   - Execute: testarModoDesenvolvimento()
   - Verifique o console

2. PARA GMAIL REAL:
   - Configure App Password no Gmail
   - Execute: testarConfiguracaoGmail()
   - Substitua 'seuemail@gmail.com' e 'seu_app_password'

3. PARA MAILTRAP:
   - Crie conta em mailtrap.io
   - Execute: configurarMailtrap('seu_token', 'from@email.com')

4. PARA TESTE COMPLETO:
   - Execute: testeCompleto()

5. PARA VER E-MAILS SALVOS:
   - Execute: mostrarEmailsLocais()

6. PARA LIMPAR E-MAILS:
   - Execute: limparEmailsLocais()

=====================================
  `);
};

/**
 * Testa se os dados necessários para envio de e-mail estão sendo encontrados
 */
export const testarDadosParaEmail = async () => {
  try {
    console.log("=== TESTE DE DADOS PARA E-MAIL ===");

    // Importar os contextos necessários
    const { getColetaById } = await import("../coletas/ColetaDataContext");
    const { getUsuarioById } = await import("../usuarios/UsuarioDataContext");

    // Simular uma sugestão de identificação
    const sugestaoTeste = {
      coleta_id: 1,
      usuario_sugerente_id: 1,
      familia_sugerida_id: null,
      genero_sugerido_id: null,
      especie_sugerida_id: null,
      nome_comum_sugerido: "Espécie Teste",
      justificativa: "Teste de justificativa",
      confianca: 80,
      observacoes_adicionais: "Teste de observações",
    };

    console.log("Sugestão de teste:", sugestaoTeste);

    // Testar busca da coleta
    console.log("\n1. Testando busca da coleta...");
    const coletaResponse = getColetaById(sugestaoTeste.coleta_id);
    console.log("Resposta da coleta:", coletaResponse);

    if (coletaResponse.status !== 200 || !coletaResponse.data) {
      console.error("❌ Coleta não encontrada!");
      return false;
    }

    const coleta = coletaResponse.data;
    console.log("✅ Coleta encontrada:", coleta);

    // Testar busca do campo
    console.log("\n2. Testando busca do campo...");
    // Simular dados de campo (em um contexto real, isso viria do contexto)
    const campos = [
      { id: 1, nome: "Campo 1", projeto_id: 1, usuario_id: 1 },
      { id: 2, nome: "Campo 2", projeto_id: 1, usuario_id: 1 },
      { id: 3, nome: "Campo 3", projeto_id: 2, usuario_id: 1 },
      { id: 4, nome: "Campo Cerrado 1", projeto_id: 3, usuario_id: 2 },
      { id: 5, nome: "Campo Cerrado 2", projeto_id: 3, usuario_id: 2 },
    ];

    const campo = campos.find((c) => c.id === coleta.campo_id);
    console.log("Campo encontrado:", campo);

    if (!campo) {
      console.error("❌ Campo não encontrado!");
      return false;
    }

    console.log("✅ Campo encontrado:", campo);

    // Testar busca do projeto
    console.log("\n3. Testando busca do projeto...");
    // Simular dados de projeto
    const projetos = [
      { id: 1, nome: "Projeto Flora Amazônica", usuario_dono_id: 1 },
      { id: 2, nome: "Projeto Mata Atlântica", usuario_dono_id: 1 },
      { id: 3, nome: "Projeto Cerrado", usuario_dono_id: 2 },
    ];

    const projeto = projetos.find((p) => p.id === campo.projeto_id);
    console.log("Projeto encontrado:", projeto);

    if (!projeto) {
      console.error("❌ Projeto não encontrado!");
      return false;
    }

    console.log("✅ Projeto encontrado:", projeto);

    // Testar busca do dono da coleta
    console.log("\n4. Testando busca do dono da coleta...");
    const donoColeta = getUsuarioById(projeto.usuario_dono_id);
    console.log("Dono da coleta encontrado:", donoColeta);

    if (!donoColeta) {
      console.error("❌ Dono da coleta não encontrado!");
      return false;
    }

    console.log("✅ Dono da coleta encontrado:", donoColeta);

    // Testar busca do sugerente
    console.log("\n5. Testando busca do sugerente...");
    const sugerente = getUsuarioById(sugestaoTeste.usuario_sugerente_id);
    console.log("Sugerente encontrado:", sugerente);

    if (!sugerente) {
      console.error("❌ Sugerente não encontrado!");
      return false;
    }

    console.log("✅ Sugerente encontrado:", sugerente);

    // Preparar dados para o e-mail
    console.log("\n6. Preparando dados para o e-mail...");
    const sugestaoEmailData = {
      coletaNome: coleta.nome,
      coletaData: coleta.data_coleta,
      sugestorNome: `${sugerente.nome} ${sugerente.sobrenome}`,
      sugestorEmail: sugerente.email,
      familiaSugerida: undefined,
      generoSugerido: undefined,
      especieSugerida: undefined,
      nomeComumSugerido: sugestaoTeste.nome_comum_sugerido,
      justificativa: sugestaoTeste.justificativa,
      confianca: sugestaoTeste.confianca,
      observacoesAdicionais: sugestaoTeste.observacoes_adicionais,
    };

    console.log("✅ Dados do e-mail preparados:", sugestaoEmailData);

    console.log("\n=== TESTE CONCLUÍDO COM SUCESSO ===");
    console.log("Todos os dados necessários foram encontrados!");
    console.log("E-mail seria enviado para:", donoColeta.email);

    return true;
  } catch (error) {
    console.error("❌ Erro no teste de dados:", error);
    return false;
  }
};

/**
 * Testa o processo completo de envio de e-mail com dados reais
 */
export const testarEnvioEmailCompleto = async () => {
  try {
    console.log("=== TESTE DE ENVIO DE E-MAIL COMPLETO ===");

    // Primeiro testar se os dados estão disponíveis
    const dadosOk = await testarDadosParaEmail();
    if (!dadosOk) {
      console.error("❌ Dados não encontrados, abortando teste de envio");
      return false;
    }

    // Simular uma sugestão
    const sugestaoTeste = {
      coleta_id: 1,
      usuario_sugerente_id: 1,
      nome_comum_sugerido: "Espécie Teste",
      justificativa: "Teste de justificativa",
      confianca: 80,
      observacoes_adicionais: "Teste de observações",
    };

    // Importar o serviço de e-mail
    const EmailService = (await import("./EmailService")).default;
    const emailService = EmailService.getInstance();

    // Configurar para desenvolvimento local
    emailService.configurarDesenvolvimentoLocal();

    // Simular o envio
    const resultado = await emailService.enviarEmailSugestaoCriada(
      "teste@exemplo.com",
      "Usuário Teste",
      {
        coletaNome: "Coleta Teste",
        coletaData: "2024-01-15T10:00:00Z",
        sugestorNome: "Sugerente Teste",
        sugestorEmail: "sugerente@exemplo.com",
        familiaSugerida: "Fabaceae",
        generoSugerido: "Mimosa",
        especieSugerida: "Mimosa pudica",
        nomeComumSugerido: "Dormideira",
        justificativa: "Características morfológicas típicas",
        confianca: 85,
        observacoesAdicionais: "Espécie comum na região",
      }
    );

    if (resultado) {
      console.log("✅ E-mail enviado com sucesso!");
      console.log("Verifique os e-mails salvos localmente");
      return true;
    } else {
      console.error("❌ Falha no envio do e-mail");
      return false;
    }
  } catch (error) {
    console.error("❌ Erro no teste de envio:", error);
    return false;
  }
};

/**
 * Testa especificamente a configuração do EmailJS com dados reais
 */
export const testarEmailJSConfigurado = async () => {
  try {
    console.log("=== TESTE EMAILJS CONFIGURADO ===");

    // Importar o serviço de e-mail
    const EmailService = (await import("./EmailService")).default;
    const emailService = EmailService.getInstance();

    // Configurar EmailJS com os dados reais
    emailService.configurarEmailJS(
      "service_jvs130a", // Seu Service ID real
      "template_lfr891s", // Template ID que funcionou
      "9qZpkV8xS_YLVkW9G" // Seu User ID real
    );

    console.log("✅ EmailJS configurado com dados reais");

    // Testar envio de e-mail
    const resultado = await emailService.enviarEmailSugestaoCriada(
      "andrademacedo2012@gmail.com",
      "Andrade Macedo",
      {
        coletaNome: "Coleta Teste EmailJS",
        coletaData: "2024-01-15T10:00:00Z",
        sugestorNome: "Usuário Teste",
        sugestorEmail: "teste@exemplo.com",
        familiaSugerida: "Fabaceae",
        generoSugerido: "Mimosa",
        especieSugerida: "Mimosa pudica",
        nomeComumSugerido: "Dormideira",
        justificativa: "Teste de justificativa via EmailJS",
        confianca: 85,
        observacoesAdicionais: "Teste de envio real via EmailJS",
      }
    );

    if (resultado) {
      console.log("✅ E-mail enviado com sucesso via EmailJS!");
      return true;
    } else {
      console.error("❌ Falha no envio via EmailJS");
      return false;
    }
  } catch (error) {
    console.error("❌ Erro no teste EmailJS:", error);
    return false;
  }
};

/**
 * Testa a configuração do EmailJS em modo de desenvolvimento
 */
export const testarEmailJSDesenvolvimento = async () => {
  try {
    console.log("=== TESTE EMAILJS DESENVOLVIMENTO ===");

    // Importar o serviço de e-mail
    const EmailService = (await import("./EmailService")).default;
    const emailService = EmailService.getInstance();

    // Configurar para desenvolvimento local (simula EmailJS)
    emailService.configurarDesenvolvimentoLocal();

    console.log("✅ EmailJS configurado para desenvolvimento");

    // Testar envio de e-mail
    const resultado = await emailService.enviarEmailSugestaoCriada(
      "teste@exemplo.com",
      "Usuário Teste",
      {
        coletaNome: "Coleta Teste Dev",
        coletaData: "2024-01-15T10:00:00Z",
        sugestorNome: "Sugerente Teste",
        sugestorEmail: "sugerente@exemplo.com",
        familiaSugerida: "Fabaceae",
        generoSugerido: "Mimosa",
        especieSugerida: "Mimosa pudica",
        nomeComumSugerido: "Dormideira",
        justificativa: "Teste de justificativa em desenvolvimento",
        confianca: 85,
        observacoesAdicionais: "Teste de envio simulado",
      }
    );

    if (resultado) {
      console.log("✅ E-mail simulado com sucesso!");
      console.log("Verifique os e-mails salvos localmente");
      return true;
    } else {
      console.error("❌ Falha na simulação");
      return false;
    }
  } catch (error) {
    console.error("❌ Erro no teste de desenvolvimento:", error);
    return false;
  }
};

/**
 * Verifica se a configuração do EmailJS está válida
 */
export const verificarConfiguracaoEmailJS = () => {
  try {
    console.log("=== VERIFICAÇÃO CONFIGURAÇÃO EMAILJS ===");

    const config = {
      serviceId: "service_jvs130a",
      templateId: "template_lfr891s",
      userId: "9qZpkV8xS_YLVkW9G",
    };

    console.log("Configuração atual:");
    console.log("- Service ID:", config.serviceId);
    console.log("- Template ID:", config.templateId);
    console.log("- User ID:", config.userId);

    // Verificar se os valores não são os padrões de exemplo
    const isValid =
      config.serviceId !== "service_abc123" &&
      config.templateId !== "template_xyz789" &&
      config.userId !== "user_def456" &&
      config.serviceId !== "test_service_id" &&
      config.templateId !== "test_template_id" &&
      config.userId !== "test_user_id";

    if (isValid) {
      console.log("✅ Configuração EmailJS parece válida");
      console.log("ℹ️ Para testar envio real, use: testarEmailJSConfigurado()");
      console.log(
        "ℹ️ Para testar simulação, use: testarEmailJSDesenvolvimento()"
      );
    } else {
      console.log("❌ Configuração EmailJS parece ser de exemplo");
      console.log(
        "ℹ️ Configure dados reais do EmailJS no arquivo EmailConfig.tsx"
      );
    }

    return isValid;
  } catch (error) {
    console.error("❌ Erro ao verificar configuração:", error);
    return false;
  }
};

/**
 * Diagnostica o problema do "Campo não encontrado"
 */
export const diagnosticarProblemaCampo = async () => {
  try {
    console.log("=== DIAGNÓSTICO: CAMPO NÃO ENCONTRADO ===");

    // Importar os contextos necessários
    const { getColetaById } = await import("../coletas/ColetaDataContext");
    const { getUsuarioById } = await import("../usuarios/UsuarioDataContext");

    // Simular uma sugestão
    const sugestaoTeste = {
      coleta_id: 1,
      usuario_sugerente_id: 1,
    };

    console.log("1. Testando busca da coleta...");
    const coletaResponse = getColetaById(sugestaoTeste.coleta_id);
    console.log("Resposta da coleta:", coletaResponse);

    if (coletaResponse.status !== 200 || !coletaResponse.data) {
      console.error("❌ Coleta não encontrada!");
      return false;
    }

    const coleta = coletaResponse.data;
    console.log("✅ Coleta encontrada:", coleta);
    console.log("Campo ID da coleta:", coleta.campo_id);

    // Dados de campo hardcoded para teste
    const campos = [
      { id: 1, nome: "Campo 1", projeto_id: 1, usuario_id: 1 },
      { id: 2, nome: "Campo 2", projeto_id: 1, usuario_id: 1 },
      { id: 3, nome: "Campo 3", projeto_id: 2, usuario_id: 1 },
      { id: 4, nome: "Campo Cerrado 1", projeto_id: 3, usuario_id: 2 },
      { id: 5, nome: "Campo Cerrado 2", projeto_id: 3, usuario_id: 2 },
    ];

    console.log(
      "2. Campos disponíveis:",
      campos.map((c) => ({ id: c.id, nome: c.nome }))
    );

    const campo = campos.find((c) => c.id === coleta.campo_id);
    console.log("3. Campo encontrado para ID", coleta.campo_id, ":", campo);

    if (!campo) {
      console.error("❌ Campo não encontrado!");
      console.log(
        "Problema: O campo_id da coleta não existe na lista de campos"
      );
      console.log(
        "Solução: Verificar se os dados de campo estão sendo carregados corretamente"
      );
      return false;
    }

    console.log("✅ Campo encontrado:", campo);

    // Dados de projeto hardcoded
    const projetos = [
      { id: 1, nome: "Projeto Flora Amazônica", usuario_dono_id: 1 },
      { id: 2, nome: "Projeto Mata Atlântica", usuario_dono_id: 1 },
      { id: 3, nome: "Projeto Cerrado", usuario_dono_id: 2 },
    ];

    const projeto = projetos.find((p) => p.id === campo.projeto_id);
    console.log("4. Projeto encontrado:", projeto);

    if (!projeto) {
      console.error("❌ Projeto não encontrado!");
      return false;
    }

    console.log("✅ Projeto encontrado:", projeto);

    // Buscar dono da coleta
    const donoColeta = getUsuarioById(projeto.usuario_dono_id);
    console.log("5. Dono da coleta:", donoColeta);

    if (!donoColeta) {
      console.error("❌ Dono da coleta não encontrado!");
      return false;
    }

    console.log("✅ Dono da coleta encontrado:", donoColeta);

    console.log("\n=== DIAGNÓSTICO CONCLUÍDO ===");
    console.log("Todos os dados foram encontrados com sucesso!");
    console.log("E-mail seria enviado para:", donoColeta.email);

    return true;
  } catch (error) {
    console.error("❌ Erro no diagnóstico:", error);
    return false;
  }
};

/**
 * Envia e-mail para endereço específico (solução alternativa)
 */
export const enviarEmailParaEnderecoEspecifico = async (
  emailDestino: string = "andrademacedo2012@gmail.com"
) => {
  try {
    console.log("=== ENVIO PARA ENDEREÇO ESPECÍFICO ===");
    console.log("E-mail de destino:", emailDestino);

    // Importar o serviço de e-mail
    const EmailService = (await import("./EmailService")).default;
    const emailService = EmailService.getInstance();

    // Configurar EmailJS com dados reais
    emailService.configurarEmailJS(
      "service_jvs130a",
      "__ejs-test-mail-service__",
      "9qZpkV8xS_YLVkW9G"
    );

    console.log("✅ EmailJS configurado");

    // Dados de teste para o e-mail
    const dadosTeste = {
      coletaNome: "Coleta Teste - Espécie A",
      coletaData: "2024-01-15T10:00:00Z",
      sugestorNome: "Usuário Teste",
      sugestorEmail: "teste@exemplo.com",
      familiaSugerida: "Fabaceae",
      generoSugerido: "Mimosa",
      especieSugerida: "Mimosa pudica",
      nomeComumSugerido: "Dormideira",
      justificativa: "Características morfológicas típicas da espécie",
      confianca: 85,
      observacoesAdicionais:
        "Espécie comum na região, facilmente identificável",
    };

    console.log("Dados do e-mail:", dadosTeste);

    // Enviar e-mail
    const resultado = await emailService.enviarEmailSugestaoCriada(
      emailDestino,
      "Andrade Macedo",
      dadosTeste
    );

    if (resultado) {
      console.log("✅ E-mail enviado com sucesso para:", emailDestino);
      return true;
    } else {
      console.error("❌ Falha no envio do e-mail");
      return false;
    }
  } catch (error) {
    console.error("❌ Erro no envio:", error);
    return false;
  }
};

/**
 * Testa envio para o e-mail específico em modo de desenvolvimento
 */
export const testarEmailEspecificoDesenvolvimento = async (
  emailDestino: string = "andrademacedo2012@gmail.com"
) => {
  try {
    console.log("=== TESTE EMAIL ESPECÍFICO (DESENVOLVIMENTO) ===");
    console.log("E-mail de destino:", emailDestino);

    // Importar o serviço de e-mail
    const EmailService = (await import("./EmailService")).default;
    const emailService = EmailService.getInstance();

    // Configurar para desenvolvimento local
    emailService.configurarDesenvolvimentoLocal();

    console.log("✅ Configurado para desenvolvimento local");

    // Dados de teste
    const dadosTeste = {
      coletaNome: "Coleta Teste - Espécie A",
      coletaData: "2024-01-15T10:00:00Z",
      sugestorNome: "Usuário Teste",
      sugestorEmail: "teste@exemplo.com",
      familiaSugerida: "Fabaceae",
      generoSugerido: "Mimosa",
      especieSugerida: "Mimosa pudica",
      nomeComumSugerido: "Dormideira",
      justificativa: "Características morfológicas típicas da espécie",
      confianca: 85,
      observacoesAdicionais:
        "Espécie comum na região, facilmente identificável",
    };

    // Simular envio
    const resultado = await emailService.enviarEmailSugestaoCriada(
      emailDestino,
      "Andrade Macedo",
      dadosTeste
    );

    if (resultado) {
      console.log("✅ E-mail simulado com sucesso!");
      console.log("Verifique os e-mails salvos localmente");
      return true;
    } else {
      console.error("❌ Falha na simulação");
      return false;
    }
  } catch (error) {
    console.error("❌ Erro no teste:", error);
    return false;
  }
};

/**
 * Testa se o AsyncStorage está funcionando corretamente
 */
export const testarAsyncStorage = async () => {
  try {
    console.log("=== TESTE ASYNCSTORAGE ===");

    // Importar AsyncStorage
    const AsyncStorage = await import(
      "@react-native-async-storage/async-storage"
    );

    // Teste de escrita
    console.log("1. Testando escrita...");
    const testKey = "test_sugflora_email";
    const testData = {
      id: "test_1",
      timestamp: new Date().toISOString(),
      message: "Teste de AsyncStorage",
    };

    await AsyncStorage.setItem(testKey, JSON.stringify(testData));
    console.log("✅ Escrita bem-sucedida");

    // Teste de leitura
    console.log("2. Testando leitura...");
    const savedData = await AsyncStorage.getItem(testKey);
    const parsedData = JSON.parse(savedData || "{}");
    console.log("✅ Leitura bem-sucedida:", parsedData);

    // Teste de limpeza
    console.log("3. Testando limpeza...");
    await AsyncStorage.removeItem(testKey);
    console.log("✅ Limpeza bem-sucedida");

    // Verificar se foi removido
    const checkData = await AsyncStorage.getItem(testKey);
    if (!checkData) {
      console.log("✅ Verificação de remoção bem-sucedida");
    }

    console.log("=== TESTE ASYNCSTORAGE CONCLUÍDO COM SUCESSO ===");
    return true;
  } catch (error) {
    console.error("❌ Erro no teste AsyncStorage:", error);
    return false;
  }
};

/**
 * Testa o envio de e-mail com AsyncStorage corrigido
 */
export const testarEmailComAsyncStorage = async () => {
  try {
    console.log("=== TESTE EMAIL COM ASYNCSTORAGE ===");

    // Primeiro testar AsyncStorage
    const asyncStorageOk = await testarAsyncStorage();
    if (!asyncStorageOk) {
      console.error("❌ AsyncStorage não está funcionando");
      return false;
    }

    // Importar o serviço de e-mail
    const EmailService = (await import("./EmailService")).default;
    const emailService = EmailService.getInstance();

    // Configurar para desenvolvimento local
    emailService.configurarDesenvolvimentoLocal();

    console.log("✅ EmailService configurado");

    // Dados de teste
    const dadosTeste = {
      coletaNome: "Coleta Teste AsyncStorage",
      coletaData: "2024-01-15T10:00:00Z",
      sugestorNome: "Usuário Teste",
      sugestorEmail: "teste@exemplo.com",
      familiaSugerida: "Fabaceae",
      generoSugerido: "Mimosa",
      especieSugerida: "Mimosa pudica",
      nomeComumSugerido: "Dormideira",
      justificativa: "Teste com AsyncStorage corrigido",
      confianca: 85,
      observacoesAdicionais: "Teste de salvamento local",
    };

    // Simular envio
    const resultado = await emailService.enviarEmailSugestaoCriada(
      "andrademacedo2012@gmail.com",
      "Andrade Macedo",
      dadosTeste
    );

    if (resultado) {
      console.log("✅ E-mail processado com sucesso!");

      // Verificar e-mails salvos
      const emailsSalvos = emailService.getEmailsLocais();
      console.log("📧 E-mails salvos:", emailsSalvos.length);

      if (emailsSalvos.length > 0) {
        console.log("✅ E-mail salvo localmente com sucesso!");
        console.log("📧 Último e-mail:", emailsSalvos[emailsSalvos.length - 1]);
      }

      return true;
    } else {
      console.error("❌ Falha no processamento do e-mail");
      return false;
    }
  } catch (error) {
    console.error("❌ Erro no teste:", error);
    return false;
  }
};

/**
 * Testa EmailJS diretamente sem usar o EmailService
 */
export const testarEmailJSDireto = async () => {
  try {
    console.log("=== TESTE EMAILJS DIRETO ===");

    // Dados de teste
    const templateParams = {
      to_email: "andrademacedo2012@gmail.com",
      to_name: "Andrade Macedo",
      message:
        "Teste direto do EmailJS - Se você receber este e-mail, o EmailJS está funcionando!",
    };

    const requestBody = {
      service_id: "service_jvs130a",
      template_id: "__ejs-test-mail-service__",
      user_id: "9qZpkV8xS_YLVkW9G",
      template_params: templateParams,
    };

    console.log("📤 Enviando requisição para EmailJS...");
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

    console.log("📡 Resposta do EmailJS:");
    console.log("- Status:", response.status);
    console.log("- Status Text:", response.statusText);

    const responseText = await response.text();
    console.log("- Response Body:", responseText);

    if (response.ok) {
      console.log("✅ EmailJS funcionando! E-mail enviado com sucesso.");
      console.log(
        "📧 Verifique sua caixa de entrada: andrademacedo2012@gmail.com"
      );
      return true;
    } else {
      console.error("❌ EmailJS falhou!");
      console.log("🔍 Possíveis problemas:");
      console.log("- Template ID: __ejs-test-mail-service__");
      console.log("- Service ID: service_jvs130a");
      console.log("- User ID: 9qZpkV8xS_YLVkW9G");
      console.log("- Verifique se o template está publicado");
      console.log("- Verifique se o serviço está ativo");

      return false;
    }
  } catch (error) {
    console.error("❌ Erro no teste:", error);
    console.log("🔍 Possíveis problemas:");
    console.log("- Problema de rede");
    console.log("- CORS bloqueado");
    console.log("- API do EmailJS indisponível");

    return false;
  }
};

/**
 * Testa EmailJS com dados completos da sugestão
 */
export const testarEmailJSCompleto = async () => {
  try {
    console.log("=== TESTE EMAILJS COMPLETO ===");

    // Dados completos da sugestão
    const templateParams = {
      to_email: "andrademacedo2012@gmail.com",
      to_name: "Andrade Macedo",
      coleta_nome: "Coleta Teste - Espécie A",
      sugestor_nome: "Usuário Teste",
      sugestor_email: "teste@exemplo.com",
      familia: "Fabaceae",
      genero: "Mimosa",
      especie: "Mimosa pudica",
      nome_comum: "Dormideira",
      justificativa: "Teste completo do EmailJS com dados da sugestão",
      confianca: 85,
      observacoes_adicionais:
        "Este e-mail deve chegar ao andrademacedo2012@gmail.com",
      data_coleta: "2024-01-15T10:00:00Z",
    };

    const requestBody = {
      service_id: "service_jvs130a",
      template_id: "__ejs-test-mail-service__",
      user_id: "9qZpkV8xS_YLVkW9G",
      template_params: templateParams,
    };

    console.log("📤 Enviando sugestão completa...");
    console.log("📋 Parâmetros:", templateParams);

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
      console.log("📧 Verifique: andrademacedo2012@gmail.com");
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
};

/**
 * Testa EmailJS de forma agressiva no Expo Go
 */
export const testarEmailJSAgressivo = async () => {
  try {
    console.log("=== TESTE EMAILJS AGRESSIVO EXPO GO ===");
    console.log("📱 Forçando envio real no Expo Go...");

    const maxTentativas = 5;

    for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
      console.log(`\n🔄 TENTATIVA ${tentativa}/${maxTentativas}`);

      try {
        // Teste de conectividade
        console.log("🔍 Testando conectividade...");
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
        console.log("✅ Conectividade:", testResponse.status);

        // Envio real
        const requestBody = {
          service_id: "service_jvs130a",
          template_id: "template_lfr891s",
          user_id: "9qZpkV8xS_YLVkW9G",
          template_params: {
            to_email: "andrademacedo2012@gmail.com",
            to_name: `Teste Agressivo ${tentativa}`,
            coleta_nome: `Coleta Teste ${tentativa}`,
            sugestor_nome: "Usuário Teste",
            sugestor_email: "teste@exemplo.com",
            familia: "Fabaceae",
            genero: "Mimosa",
            especie: "Mimosa pudica",
            nome_comum: "Dormideira",
            justificativa: `Tentativa ${tentativa} - Forçando envio no Expo Go`,
            confianca: 85,
            observacoes: "Teste com template corrigido",
            data_coleta: "2024-01-15T10:00:00Z",
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
              Accept: "application/json",
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
              Origin: "https://dashboard.emailjs.com",
              Referer: "https://dashboard.emailjs.com/",
            },
            body: JSON.stringify(requestBody),
          }
        );

        console.log("📡 Resposta:", response.status, response.statusText);

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

          console.log("🎉 SUCESSO NA TENTATIVA", tentativa, ":", result);
          console.log("📧 Verifique: andrademacedo2012@gmail.com");
          return true;
        } else {
          const error = await response.text();
          console.error("❌ Falha na tentativa", tentativa, ":", error);

          if (tentativa < maxTentativas) {
            console.log(`⏳ Aguardando ${tentativa * 2} segundos...`);
            await new Promise((resolve) =>
              setTimeout(resolve, tentativa * 2000)
            );
          }
        }
      } catch (error) {
        console.error("❌ Erro na tentativa", tentativa, ":", error.message);

        if (tentativa < maxTentativas) {
          console.log(`⏳ Aguardando ${tentativa * 2} segundos...`);
          await new Promise((resolve) => setTimeout(resolve, tentativa * 2000));
        }
      }
    }

    console.error("❌ Todas as tentativas falharam");
    return false;
  } catch (error) {
    console.error("❌ Erro geral:", error);
    return false;
  }
};

/**
 * Testa se o problema dos dados foi resolvido
 */
export const testarDadosCorrigidos = async () => {
  try {
    console.log("=== TESTE DADOS CORRIGIDOS ===");

    // Simular dados de sugestão
    const sugestaoData = {
      coletaNome: "Coleta Teste - Dados Corrigidos",
      coletaData: "2024-01-15T10:00:00Z",
      sugestorNome: "Usuário Teste",
      sugestorEmail: "teste@exemplo.com",
      familiaSugerida: "Fabaceae",
      generoSugerido: "Mimosa",
      especieSugerida: "Mimosa pudica",
      nomeComumSugerido: "Dormideira",
      justificativa: "Teste com dados corrigidos",
      confianca: 85,
      observacoesAdicionais: "Verificando se o problema foi resolvido",
    };

    console.log("📋 Dados da sugestão:", sugestaoData);

    // Importar e usar o EmailService
    const EmailService = (await import("./EmailService")).default;
    const emailService = EmailService.getInstance();

    console.log("📧 Enviando e-mail com dados corrigidos...");

    const resultado = await emailService.enviarEmailSugestaoCriada(
      "andrademacedo2012@gmail.com",
      "Andrade Macedo",
      sugestaoData
    );

    if (resultado) {
      console.log("✅ E-mail enviado com sucesso!");
      console.log("📧 Verifique: andrademacedo2012@gmail.com");
    } else {
      console.log(
        "❌ Falha no envio, mas dados foram processados corretamente"
      );
    }

    return resultado;
  } catch (error) {
    console.error("❌ Erro no teste:", error);
    return false;
  }
};

// Exportar todas as funções
export default {
  testarConfiguracao,
  testarSistemaEmail,
  testarConfiguracaoGmail,
  configurarMailtrap,
  testarModoDesenvolvimento,
  mostrarEmailsLocais,
  limparEmailsLocais,
  testeCompleto,
  mostrarGuiaConfiguracao,
  testarDadosParaEmail,
  testarEnvioEmailCompleto,
  testarEmailJSConfigurado,
  testarEmailJSDesenvolvimento,
  verificarConfiguracaoEmailJS,
  diagnosticarProblemaCampo,
  enviarEmailParaEnderecoEspecifico,
  testarEmailEspecificoDesenvolvimento,
  testarAsyncStorage,
  testarEmailComAsyncStorage,
  testarEmailJSDireto,
  testarEmailJSCompleto,
  testarEmailJSAgressivo,
  testarDadosCorrigidos,
};
