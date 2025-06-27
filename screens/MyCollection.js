import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import HeaderInterno from "../components/HeaderInterno";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColetaData } from "../data/coletas/ColetaDataContext";
import { useProjetoData } from "../data/projetos/ProjetoDataContext";
import { useCampoData } from "../data/campos/CampoDataContext";

const MyCollectionsScreen = () => {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get("window").width;
  const isMobile = screenWidth < 768;
  const [organizedColetas, setOrganizedColetas] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedProjects, setExpandedProjects] = useState({});
  const [expandedFields, setExpandedFields] = useState({});

  // Contexts
  const { coletas } = useColetaData();
  const { projetos } = useProjetoData();
  const { campos } = useCampoData();

  const formatDate = (dateString) => {
    if (!dateString) return "Não definida";
    if (typeof dateString === "string" && dateString.includes("/")) return dateString;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Data inválida";
    return date.toLocaleDateString("pt-BR");
  };

  const toggleProject = (projectId) => {
    setExpandedProjects((prev) => ({ ...prev, [projectId]: !prev[projectId] }));
  };

  const toggleField = (fieldId) => {
    setExpandedFields((prev) => ({ ...prev, [fieldId]: !prev[fieldId] }));
  };

  const organizeColetasByProjectAndField = (coletasArray) => {
    const result = {};
    coletasArray.forEach((coleta) => {
      const campo = campos.find((c) => c.id === coleta.campo_id);
      if (!campo) return;
      const projeto = projetos.find((p) => p.id === campo.projeto_id);
      const projId = projeto?.id ?? 'sem_projeto';
      const projNome = projeto?.nome ?? 'Sem Projeto';
      const campoId = campo.id;
      const campoNome = campo.nome;

      if (!result[projId]) {
        result[projId] = { id: projId, nome: projNome, campos: {} };
      }
      if (!result[projId].campos[campoId]) {
        result[projId].campos[campoId] = { id: campoId, nome: campoNome, coletas: [] };
      }

      result[projId].campos[campoId].coletas.push({
        ...coleta,
        projeto_id: projId,
        dataFormatada: formatDate(coleta.data_coleta),
        status: coleta.identificada ? "Identificada" : "Não identificada",
        statusColor: coleta.identificada ? "#4caf50" : "#ff9800",
      });
    });
    return result;
  };

  const fetchColetas = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("user_id");
      if (!token) throw new Error("Token não encontrado. Faça login novamente.");
      if (!userId) throw new Error("Usuário não identificado");
      if (!coletas || !Array.isArray(coletas)) {
        setOrganizedColetas({});
        return;
      }

      const filtered = coletas.filter((c) => {
        const campo = campos.find((f) => f.id === c.campo_id);
        if (!campo) return false;
        const projeto = projetos.find((p) => p.id === campo.projeto_id);
        if (!projeto) return false;
        return projeto.usuario_dono_id === Number(userId) && !c.deleted;
      });

      const org = organizeColetasByProjectAndField(filtered);
      setOrganizedColetas(org);
    } catch (err) {
      console.error(err);
      setError(err.message || "Erro ao carregar coletas");
      Alert.alert("Erro", "Não foi possível carregar as coletas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColetas();
  }, [coletas, projetos, campos]);

  const handleAddCollection = () => navigation.navigate("SelectProjectAndField");
  const handleGenerateReport = () => navigation.navigate("MyReports");
  const handleBack = () => navigation.goBack();
  const handleColetaPress = (coleta) =>
    navigation.navigate("ColetaScreen", { coleta, campo: { id: coleta.campo_id }, projeto: { id: coleta.projeto_id } });

  const renderColetaItem = (coleta) => (
    <TouchableOpacity key={coleta.id} style={styles.coletaItem} onPress={() => handleColetaPress(coleta)}>
      <View style={styles.coletaInfo}>
        <Text style={styles.coletaNome}>{coleta.nome}</Text>
        <Text style={styles.coletaData}>{coleta.dataFormatada}</Text>
      </View>
      <View style={styles.coletaStatus}>
        <View style={[styles.statusBadge, { backgroundColor: coleta.statusColor }]}>
          <Text style={styles.statusText}>{coleta.status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFieldSection = (campo) => {
    const isExp = expandedFields[campo.id];
    return (
      <View key={campo.id} style={styles.fieldSection}>
        <TouchableOpacity style={styles.fieldHeader} onPress={() => toggleField(campo.id)}>
          <Text style={styles.expandIcon}>{isExp ? '▼' : '▶'}</Text>
          <Text style={styles.fieldName}>{campo.nome}</Text>
          <Text style={styles.coletaCount}>({campo.coletas.length} coletas)</Text>
        </TouchableOpacity>
        {isExp && <View style={styles.coletasList}>{campo.coletas.map(renderColetaItem)}</View>}
      </View>
    );
  };

  const renderProjectSection = (proj) => {
    const isExp = expandedProjects[proj.id];
    const total = Object.values(proj.campos).reduce((sum, f) => sum + f.coletas.length, 0);
    return (
      <View key={proj.id} style={styles.projectSection}>
        <TouchableOpacity style={styles.projectHeader} onPress={() => toggleProject(proj.id)}>
          <Text style={styles.expandIcon}>{isExp ? '▼' : '▶'}</Text>
          <Text style={styles.projectName}>{proj.nome}</Text>
          <Text style={styles.coletaCount}>({total} coletas)</Text>
        </TouchableOpacity>
        {isExp && <View style={styles.fieldsList}>{Object.values(proj.campos).map(renderFieldSection)}</View>}
      </View>
    );
  };

  if (loading) return (
    <View style={styles.container}><HeaderInterno />
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2e7d32" />
        <Text style={styles.loadingText}>Carregando coletas...</Text>
      </View>
    </View>
  );

  if (error) return (
    <View style={styles.container}><HeaderInterno />
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchColetas}>
          <Text style={styles.buttonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const projectsArray = Object.values(organizedColetas);

  return (
    <View style={styles.container}>
      <HeaderInterno />
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>MINHAS COLETAS</Text>
        {projectsArray.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma coleta encontrada</Text>
            <Text style={styles.emptySubtext}>Clique em "ADICIONAR COLETA" para começar</Text>
          </View>
        ) : (
          <View style={styles.hierarchicalList}>{projectsArray.map(renderProjectSection)}</View>
        )}
      </ScrollView>
      <View style={styles.buttonContainer}>
       
        <TouchableOpacity style={[styles.button, styles.reportButton]} onPress={handleGenerateReport}>
          <Text style={styles.buttonText}>GERAR RELATÓRIO</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.backButton]} onPress={handleBack}>
          <Text style={styles.buttonText}>VOLTAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1 },
  scrollContent: { padding: 15, paddingBottom: 100 },
  pageTitle: { fontSize: 24, fontWeight: "bold", color: "#2e7d32", marginBottom: 20, textAlign: "center" },
  hierarchicalList: { marginBottom: 20 },
  projectSection: { marginBottom: 15, backgroundColor: "#f8f9fa", borderRadius: 10, overflow: "hidden", borderWidth: 1, borderColor: "#e9ecef" },
  projectHeader: { flexDirection: "row", alignItems: "center", padding: 15, backgroundColor: "#2e7d32" },
  projectName: { fontSize: 18, fontWeight: "bold", color: "#fff", flex: 1, marginLeft: 10 },
  expandIcon: { fontSize: 16, color: "#fff", fontWeight: "bold" },
  coletaCount: { fontSize: 14, color: "#fff", opacity: 0.8 },
  fieldsList: { padding: 10 },
  fieldSection: { marginBottom: 10, backgroundColor: "#fff", borderRadius: 8, borderWidth: 1, borderColor: "#dee2e6" },
  fieldHeader: { flexDirection: "row", alignItems: "center", padding: 12, backgroundColor: "#e8f5e9" },
  fieldName: { fontSize: 16, fontWeight: "600", color: "#2e7d32", flex: 1, marginLeft: 10 },
  coletasList: { padding: 10 },
  coletaItem: { flexDirection: "row", alignItems: "center", padding: 12, backgroundColor: "#fff", borderRadius: 6, marginBottom: 8, borderWidth: 1, borderColor: "#f0f0f0", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  coletaInfo: { flex: 1 },
  coletaNome: { fontSize: 16, fontWeight: "600", color: "#333", marginBottom: 4 },
  coletaData: { fontSize: 14, color: "#666" },
  coletaStatus: { marginLeft: 10 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: "bold", color: "#fff" },
  buttonContainer: { flexDirection: "row", justifyContent: "space-around", padding: 15, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: "#eee", position: "absolute", bottom: 0, left: 0, right: 0 },
  button: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 5, minWidth: 110, maxWidth: 150, alignItems: "center", justifyContent: "center", flexGrow: 1, flexBasis: "30%", marginVertical: 5 },
  addButton: { backgroundColor: "#2e7d32" },
  reportButton: { backgroundColor: "#1565c0" },
  backButton: { backgroundColor: "#999" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 15, color: "#2e7d32", fontSize: 16 },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  errorText: { color: "#d32f2f", fontSize: 16, textAlign: "center", marginBottom: 20 },
  emptyContainer: { padding: 40, alignItems: "center" },
  emptyText: { color: "#666", fontSize: 18, fontWeight: "600", marginBottom: 10 },
  emptySubtext: { color: "#999", fontSize: 14, textAlign: "center" },
  retryButton: { backgroundColor: "#d32f2f", padding: 12, borderRadius: 5, alignItems: "center" },
});

export default MyCollectionsScreen;
