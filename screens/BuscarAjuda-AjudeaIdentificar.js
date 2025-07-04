import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import CustomPicker from '../components/CustomPicker'
import HeaderInterno from '../components/HeaderInterno';

const HelpRequestFormScreen = () => {
  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <HeaderInterno />

      {/* Conteúdo */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>BUSCAR AJUDA</Text>
        <Text style={styles.description}>
          Insira abaixo as informações da espécie para solicitar ajuda a outros pesquisadores. Não é necessário preencher todos os campos, mas recomendamos fornecer o máximo de informações possível.
        </Text>

        <TextInput
          placeholder="Local onde foi encontrada"
          style={styles.input}
        />
        <TextInput
          placeholder="Nome da espécie"
          style={styles.input}
        />


        <TextInput
          placeholder="Insira informações sobre a espécie para ajudar outros pesquisadores. Obrigatório."
          multiline
          numberOfLines={4}
          style={styles.textArea}
        />

        {/* Imagem */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/images/sem-imagem.webp')}
            style={styles.imagePlaceholder}
          />
          <TouchableOpacity style={styles.uploadButton}>
            <Text style={styles.uploadButtonText}>Inserir Imagem</Text>
          </TouchableOpacity>
        </View>

        {/* Botão de envio */}
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Pedir ajuda</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerContainer: { height: 160 },
  headerBackgroundImage: { width: '100%', height: '100%', position: 'absolute' },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  logoImage: { width: 50, height: 50 },
  logoText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  menuTop: { flexDirection: 'row', marginLeft: 'auto' },
  menuItem: { marginHorizontal: 8 },
  menuText: { color: '#fff', fontSize: 14 },

  content: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2e5641', marginBottom: 10 },
  description: {
    fontSize: 12,
    color: '#333',
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    borderRadius: 4,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  pickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 4,
    marginHorizontal: 4,
    overflow: 'hidden',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 4,
    padding: 10,
    textAlignVertical: 'top',
    marginBottom: 25,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#cfe9c4',
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: '#365c4f',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  submitButton: {
    backgroundColor: '#365c4f',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HelpRequestFormScreen;
