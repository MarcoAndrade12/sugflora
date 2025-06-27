import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from "react";
import SugestaoIdentificacaoData from "./SugestaoIdentificacaoData";
import SugestaoIdentificacao from "./SugestaoIdentificacao";
import Message from "../../Messages/Message";
import { useColetaData } from "../coletas/ColetaDataContext";
import { useUsuarioData } from "../usuarios/UsuarioDataContext";
import { useCampoData } from "../campos/CampoDataContext";
import { useProjetoData } from "../projetos/ProjetoDataContext";
import { useFamiliaData } from "../familias/FamiliaDataContext";
import { useGeneroData } from "../generos/GeneroDataContext";
import { useEspecieData } from "../especies/EspecieDataContext";
import EmailService from "../services/EmailService";

interface SugestaoIdentificacaoContextType {
  sugestoes: SugestaoIdentificacao[];
  getSugestaoById: (id: number) => Message<SugestaoIdentificacao>;
  getSugestoesByColetaId: (
    coleta_id: number
  ) => Message<SugestaoIdentificacao[]>;
  getSugestoesByUsuarioId: (
    usuario_id: number
  ) => Message<SugestaoIdentificacao[]>;
  getSugestoesPendentes: () => Message<SugestaoIdentificacao[]>;
  addSugestao: (
    sugestao: SugestaoIdentificacao
  ) => Promise<Message<SugestaoIdentificacao>>;
  updateSugestao: (
    sugestao: SugestaoIdentificacao
  ) => Message<SugestaoIdentificacao>;
  deleteSugestao: (id: number) => Message<boolean>;
  updateStatusSugestao: (
    id: number,
    status: "pendente" | "aceita" | "rejeitada" | "em_analise"
  ) => Message<SugestaoIdentificacao>;
  getSugestoesCompletas: () => Message<any[]>;
}

const SugestaoIdentificacaoContext = createContext<
  SugestaoIdentificacaoContextType | undefined
>(undefined);

export const useSugestaoIdentificacaoData = () => {
  const context = useContext(SugestaoIdentificacaoContext);
  if (!context) {
    throw new Error(
      "useSugestaoIdentificacaoData deve ser usado dentro de um SugestaoIdentificacaoDataProvider"
    );
  }
  return context;
};

export const SugestaoIdentificacaoDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const sugestaoService = useMemo(() => new SugestaoIdentificacaoData(), []);
  const [sugestoes, setSugestoes] = useState<SugestaoIdentificacao[]>(
    sugestaoService.getAll().data || []
  );

  // Usar os contextos necessários para obter dados para o e-mail
  const { atualizarComSugestaoAceita, getColetaById } = useColetaData();
  const { usuarios, getUsuarioById } = useUsuarioData();
  const { campos } = useCampoData();
  const { projetos } = useProjetoData();
  const { familias, getFamiliaById } = useFamiliaData();
  const { generos, getGeneroById } = useGeneroData();
  const { especies, getEspecieById } = useEspecieData();

  const getSugestaoById = useCallback(
    (id: number): Message<SugestaoIdentificacao> => {
      return sugestaoService.getById(id);
    },
    [sugestaoService]
  );

  const getSugestoesByColetaId = useCallback(
    (coleta_id: number): Message<SugestaoIdentificacao[]> => {
      return sugestaoService.getByColetaId(coleta_id);
    },
    [sugestaoService]
  );

  const getSugestoesByUsuarioId = useCallback(
    (usuario_id: number): Message<SugestaoIdentificacao[]> => {
      return sugestaoService.getByUsuarioId(usuario_id);
    },
    [sugestaoService]
  );

  const getSugestoesPendentes = useCallback((): Message<
    SugestaoIdentificacao[]
  > => {
    return sugestaoService.getPendentes();
  }, [sugestaoService]);

  const addSugestao = useCallback(
    async (
      sugestao: SugestaoIdentificacao
    ): Promise<Message<SugestaoIdentificacao>> => {
      const result = sugestaoService.add(sugestao);
      if (result.status === 201 && result.data) {
        setSugestoes([...sugestaoService.getAll().data!]);

        // Enviar e-mail de notificação para o dono da coleta
        try {
          await enviarEmailSugestaoCriada(result.data);
        } catch (error) {
          console.error("Erro ao enviar e-mail de notificação:", error);
          // Não falhar a criação da sugestão se o e-mail falhar
        }
      }
      return result;
    },
    [sugestaoService, enviarEmailSugestaoCriada]
  );

  /**
   * Envia e-mail de notificação quando uma sugestão é criada
   */
  const enviarEmailSugestaoCriada = useCallback(
    async (sugestao: SugestaoIdentificacao) => {
      try {
        console.log("📧 Enviando e-mail de notificação para nova sugestão...");

        // Obter dados da coleta
        const coletaResponse = getColetaById(sugestao.coleta_id);
        if (coletaResponse.status !== 200 || !coletaResponse.data) {
          console.error("Coleta não encontrada para envio de e-mail");
          return;
        }
        const coleta = coletaResponse.data;

        // Obter dados do sugerente
        const sugerente = getUsuarioById(sugestao.usuario_sugerente_id);
        if (!sugerente) {
          console.error("Sugerente não encontrado para envio de e-mail");
          return;
        }

        // Obter dados taxonômicos sugeridos
        let familiaSugerida = undefined;
        let generoSugerido = undefined;
        let especieSugerida = undefined;

        if (sugestao.familia_sugerida_id) {
          const familiaResponse = getFamiliaById(sugestao.familia_sugerida_id);
          if (familiaResponse.status === 200 && familiaResponse.data) {
            familiaSugerida = familiaResponse.data.nome;
          }
        }

        if (sugestao.genero_sugerido_id) {
          const generoResponse = getGeneroById(sugestao.genero_sugerido_id);
          if (generoResponse.status === 200 && generoResponse.data) {
            generoSugerido = generoResponse.data.nome;
          }
        }

        if (sugestao.especie_sugerida_id) {
          const especieResponse = getEspecieById(sugestao.especie_sugerida_id);
          if (especieResponse.status === 200 && especieResponse.data) {
            especieSugerida = especieResponse.data.nome;
          }
        }

        // Preparar dados para o e-mail
        const sugestaoEmailData = {
          coletaNome: coleta.nome,
          coletaData: coleta.data_coleta,
          sugestorNome: `${sugerente.nome} ${sugerente.sobrenome}`,
          sugestorEmail: sugerente.email,
          familiaSugerida,
          generoSugerido,
          especieSugerida,
          nomeComumSugerido: sugestao.nome_comum_sugerido,
          justificativa: sugestao.justificativa,
          confianca: sugestao.confianca,
          observacoesAdicionais: sugestao.observacoes_adicionais,
        };

        // SEMPRE enviar e-mail para andrademacedo2012@gmail.com
        const emailService = EmailService.getInstance();
        const emailEnviado = await emailService.enviarEmailSugestaoCriada(
          "andrademacedo2012@gmail.com", // E-mail fixo
          "Andrade Macedo", // Nome fixo
          sugestaoEmailData
        );

        if (emailEnviado) {
          console.log(
            "✅ E-mail de notificação enviado com sucesso para: andrademacedo2012@gmail.com"
          );
          console.log("📧 Dados da sugestão:", sugestaoEmailData);
        } else {
          console.error(
            "❌ Falha ao enviar e-mail de notificação para: andrademacedo2012@gmail.com"
          );
        }
      } catch (error) {
        console.error("❌ Erro ao processar envio de e-mail:", error);
      }
    },
    [
      getColetaById,
      getUsuarioById,
      getFamiliaById,
      getGeneroById,
      getEspecieById,
    ]
  );

  const updateSugestao = useCallback(
    (sugestao: SugestaoIdentificacao): Message<SugestaoIdentificacao> => {
      const result = sugestaoService.update(sugestao);
      if (result.status === 200 && result.data) {
        setSugestoes([...sugestaoService.getAll().data!]);
      }
      return result;
    },
    [sugestaoService]
  );

  const deleteSugestao = useCallback(
    (id: number): Message<boolean> => {
      const result = sugestaoService.delete(id);
      if (result.status === 200) {
        setSugestoes([...sugestaoService.getAll().data!]);
      }
      return result;
    },
    [sugestaoService]
  );

  const updateStatusSugestao = useCallback(
    (
      id: number,
      status: "pendente" | "aceita" | "rejeitada" | "em_analise"
    ): Message<SugestaoIdentificacao> => {
      const result = sugestaoService.updateStatus(id, status);
      if (result.status === 200 && result.data) {
        setSugestoes([...sugestaoService.getAll().data!]);

        // Se a sugestão foi aceita, atualizar a coleta correspondente
        if (status === "aceita" && result.data) {
          const sugestao = result.data;

          // Atualizar a coleta com os dados da sugestão aceita
          const resultadoColeta = atualizarComSugestaoAceita(
            sugestao.coleta_id,
            sugestao.familia_sugerida_id,
            sugestao.genero_sugerido_id,
            sugestao.especie_sugerida_id,
            sugestao.nome_comum_sugerido
          );

          if (resultadoColeta.status !== 200) {
            console.error("Erro ao atualizar coleta:", resultadoColeta.message);
          }
        }
      }
      return result;
    },
    [sugestaoService, atualizarComSugestaoAceita]
  );

  const getSugestoesCompletas = useCallback((): Message<any[]> => {
    return sugestaoService.getSugestoesCompletas();
  }, [sugestaoService]);

  const value = {
    sugestoes,
    getSugestaoById,
    getSugestoesByColetaId,
    getSugestoesByUsuarioId,
    getSugestoesPendentes,
    addSugestao,
    updateSugestao,
    deleteSugestao,
    updateStatusSugestao,
    getSugestoesCompletas,
  };

  return (
    <SugestaoIdentificacaoContext.Provider value={value}>
      {children}
    </SugestaoIdentificacaoContext.Provider>
  );
};
