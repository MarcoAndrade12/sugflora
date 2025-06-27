# Correção dos Erros de E-mail

Este guia resolve os erros específicos que você está enfrentando:

- **Erro HTTP 400** no EmailJS
- **localStorage não existe** no React Native

## Problemas Identificados

### 1. Erro HTTP 400 no EmailJS

**Causa**: Parâmetros incorretos ou template não configurado corretamente
**Solução**: Melhorado o debug e tratamento de erros

### 2. localStorage não existe no React Native

**Causa**: React Native não tem localStorage, precisa usar AsyncStorage
**Solução**: Substituído por AsyncStorage

## Correções Implementadas

### ✅ AsyncStorage Corrigido

- Substituído `localStorage` por `AsyncStorage`
- Adicionado tratamento de erros assíncrono
- Implementado carregamento automático de dados

### ✅ EmailJS Melhorado

- Debug detalhado dos parâmetros
- Tratamento de erros HTTP 400
- Fallback automático para salvamento local

### ✅ Logs Melhorados

- Logs detalhados para identificar problemas
- Informações de debug do EmailJS
- Status de cada etapa do processo

## Como Testar as Correções

### 1. Teste do AsyncStorage

Execute no console do Expo Go:

```javascript
import { testarAsyncStorage } from "./data/services/EmailTest";
await testarAsyncStorage();
```

Este teste verifica se o AsyncStorage está funcionando corretamente.

### 2. Teste Completo com AsyncStorage

```javascript
import { testarEmailComAsyncStorage } from "./data/services/EmailTest";
await testarEmailComAsyncStorage();
```

Este teste:

- Verifica AsyncStorage
- Configura EmailService
- Simula envio de e-mail
- Salva localmente
- Verifica se foi salvo

### 3. Teste de Envio Real (com fallback)

```javascript
import { enviarEmailParaEnderecoEspecifico } from "./data/services/EmailTest";
await enviarEmailParaEnderecoEspecifico("andrademacedo2012@gmail.com");
```

Este teste:

- Tenta enviar via EmailJS
- Se falhar (HTTP 400), salva localmente
- Fornece logs detalhados

### 4. Verificar E-mails Salvos

```javascript
import { mostrarEmailsLocais } from "./data/services/EmailTest";
mostrarEmailsLocais();
```

## Logs de Debug Melhorados

Agora você verá logs mais detalhados:

```javascript
📤 Enviando via EmailJS...
📋 Parâmetros do template: { to_email: "...", ... }
📤 Request body: { service_id: "...", ... }
📡 Resposta do EmailJS: 400 Bad Request
🔍 Debug EmailJS:
- Service ID: service_jvs130a
- Template ID: template_lfr891s
- User ID: 9qZpkV8xS_YLVkW9G
- Parâmetros: { ... }
⚠️ Tentando salvar localmente como fallback...
💾 Salvando e-mail localmente...
✅ E-mail salvo localmente com sucesso
```

## Troubleshooting Específico

### Se o AsyncStorage falhar:

```javascript
// Verificar se a dependência está instalada
npm install @react-native-async-storage/async-storage
```

### Se o EmailJS retornar HTTP 400:

1. **Verificar template**: Certifique-se de que o template `template_lfr891s` existe
2. **Verificar variáveis**: Confirme se as variáveis estão corretas no template
3. **Verificar Service ID**: Confirme se `service_jvs130a` está ativo

### Se o salvamento local falhar:

- Verifique se o AsyncStorage está funcionando
- Execute o teste `testarAsyncStorage()`

## Template EmailJS Necessário

Certifique-se de que seu template tenha estas variáveis:

```html
{{to_email}} - E-mail do destinatário {{to_name}} - Nome do destinatário
{{coleta_nome}} - Nome da coleta {{sugestor_nome}} - Nome do sugerente
{{sugestor_email}} - E-mail do sugerente {{familia}} - Família sugerida
(opcional) {{genero}} - Gênero sugerido (opcional) {{especie}} - Espécie
sugerida (opcional) {{nome_comum}} - Nome comum (opcional) {{justificativa}} -
Justificativa da sugestão {{confianca}} - Nível de confiança (%)
{{observacoes_adicionais}} - Observações (opcional) {{data_coleta}} - Data da
coleta
```

## Fluxo de Correção

1. **Execute o teste AsyncStorage** para verificar se está funcionando
2. **Execute o teste completo** para verificar todo o fluxo
3. **Se EmailJS falhar**, o sistema salvará localmente automaticamente
4. **Verifique os e-mails salvos** para confirmar que funcionou

## Status das Correções

✅ **AsyncStorage implementado**
✅ **EmailJS com debug melhorado**
✅ **Fallback automático para salvamento local**
✅ **Logs detalhados para troubleshooting**
⏳ **Aguardando testes do usuário**

## Próximos Passos

1. Execute `testarAsyncStorage()` para verificar AsyncStorage
2. Execute `testarEmailComAsyncStorage()` para teste completo
3. Se ainda houver problemas, verifique os logs detalhados
4. Configure o template EmailJS se necessário
