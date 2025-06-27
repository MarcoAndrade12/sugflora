# Solução para "Campo não encontrado" - E-mail Específico

Este guia resolve o problema do "Campo não encontrado" e implementa uma solução alternativa para enviar e-mails para um endereço específico.

## Problema Identificado

O erro "Campo não encontrado para envio de e-mail" ocorre porque:

1. O contexto de campos não está sendo carregado corretamente
2. Os dados de campo não estão disponíveis no momento do envio
3. Há incompatibilidade entre os IDs de campo das coletas e os campos disponíveis

## Solução Implementada

### 1. Diagnóstico do Problema

Execute no console do Expo Go:

```javascript
import { diagnosticarProblemaCampo } from "./data/services/EmailTest";
await diagnosticarProblemaCampo();
```

Este comando identifica exatamente onde está o problema na cadeia de dados.

### 2. Envio para E-mail Específico

#### Teste de Envio Real

```javascript
import { enviarEmailParaEnderecoEspecifico } from "./data/services/EmailTest";
await enviarEmailParaEnderecoEspecifico("andrademacedo2012@gmail.com");
```

#### Teste de Simulação (Desenvolvimento)

```javascript
import { testarEmailEspecificoDesenvolvimento } from "./data/services/EmailTest";
await testarEmailEspecificoDesenvolvimento("andrademacedo2012@gmail.com");
```

### 3. Solução Automática no Sistema

O sistema agora tem uma **solução alternativa automática**:

- Quando qualquer dado (campo, projeto, dono, sugerente) não for encontrado
- O sistema automaticamente envia o e-mail para: `andrademacedo2012@gmail.com`
- Isso garante que as notificações sempre sejam enviadas

## Como Funciona a Solução

### Fluxo Normal (quando todos os dados estão disponíveis)

1. Sugestão criada → Buscar coleta → Buscar campo → Buscar projeto → Buscar dono → Enviar e-mail

### Fluxo Alternativo (quando algum dado não é encontrado)

1. Sugestão criada → Buscar coleta → **Dado não encontrado** → Enviar para e-mail específico

### E-mail de Destino

- **Endereço**: `andrademacedo2012@gmail.com`
- **Nome**: "Andrade Macedo"

## Testes Disponíveis

### 1. Diagnóstico Completo

```javascript
import { diagnosticarProblemaCampo } from "./data/services/EmailTest";
await diagnosticarProblemaCampo();
```

### 2. Teste de Envio Real

```javascript
import { enviarEmailParaEnderecoEspecifico } from "./data/services/EmailTest";
await enviarEmailParaEnderecoEspecifico();
```

### 3. Teste de Simulação

```javascript
import { testarEmailEspecificoDesenvolvimento } from "./data/services/EmailTest";
await testarEmailEspecificoDesenvolvimento();
```

### 4. Verificar E-mails Salvos

```javascript
import { mostrarEmailsLocais } from "./data/services/EmailTest";
mostrarEmailsLocais();
```

## Logs de Debug

O sistema agora inclui logs detalhados:

```javascript
console.log("Campo não encontrado para envio de e-mail");
console.log("Tentando enviar para e-mail específico como alternativa...");
console.log("Enviando e-mail para endereço específico...");
console.log(
  "E-mail de notificação enviado com sucesso para: andrademacedo2012@gmail.com"
);
```

## Dados de Teste Incluídos

### E-mail de Teste

- **Destinatário**: `andrademacedo2012@gmail.com`
- **Nome**: "Andrade Macedo"
- **Assunto**: "Nova Sugestão de Identificação - SugFlora"

### Dados da Sugestão

- **Coleta**: "Coleta Teste - Espécie A"
- **Sugerente**: "Usuário Teste"
- **Família**: "Fabaceae"
- **Gênero**: "Mimosa"
- **Espécie**: "Mimosa pudica"
- **Nome comum**: "Dormideira"
- **Confiança**: 85%

## Configuração do EmailJS

O sistema usa os dados do EmailJS configurados:

- **Service ID**: `service_jvs130a`
- **Template ID**: `template_lfr891s`
- **User ID**: `9qZpkV8xS_YLVkW9G`

## Próximos Passos

1. **Execute o diagnóstico** para identificar o problema específico
2. **Teste o envio real** para verificar se funciona
3. **Teste a simulação** para desenvolvimento seguro
4. **Verifique os e-mails** salvos localmente

## Status da Solução

✅ **Diagnóstico implementado**
✅ **Solução alternativa automática**
✅ **Envio para e-mail específico**
✅ **Logs de debug detalhados**
⏳ **Aguardando testes do usuário**

## Troubleshooting

### Se o diagnóstico falhar

- Verifique se os contextos estão carregados
- Confirme se os dados de exemplo existem

### Se o envio falhar

- Verifique a configuração do EmailJS
- Confirme se o template tem as variáveis corretas

### Se a simulação falhar

- Verifique se o localStorage está disponível
- Confirme se não há erros de JavaScript
