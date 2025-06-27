# Guia para Testar Dados de E-mail

Este guia ajuda a identificar e resolver problemas com dados não encontrados no sistema de envio de e-mail.

## Problema Identificado

O erro "campo não encontrado" ou "dados não encontrados" pode ocorrer por várias razões:

1. **Incompatibilidade de tipos**: As funções `getUsuarioById` retornam `Usuario | undefined`, mas estavam sendo tratadas como se retornassem `Message<Usuario>`
2. **Dados não carregados**: Os contextos podem não estar inicializados corretamente
3. **IDs incorretos**: Os relacionamentos entre coleta → campo → projeto → usuário podem estar incorretos

## Soluções Implementadas

### 1. Correção de Tipos

As funções foram corrigidas para usar o tipo correto:

- `getUsuarioById(id)` retorna `Usuario | undefined`
- `getColetaById(id)` retorna `Message<Coleta>`

### 2. Funções de Teste

Foram criadas funções específicas para testar os dados:

```javascript
// Testar se os dados estão disponíveis
import { testarDadosParaEmail } from "./data/services/EmailTest";
await testarDadosParaEmail();

// Testar envio completo
import { testarEnvioEmailCompleto } from "./data/services/EmailTest";
await testarEnvioEmailCompleto();
```

## Como Testar

### 1. Teste Básico de Dados

Execute no console do Expo Go:

```javascript
import { testarDadosParaEmail } from "./data/services/EmailTest";
await testarDadosParaEmail();
```

Este teste verifica:

- ✅ Coleta existe
- ✅ Campo existe
- ✅ Projeto existe
- ✅ Dono da coleta existe
- ✅ Sugerente existe
- ✅ Dados do e-mail podem ser preparados

### 2. Teste de Envio Completo

Execute no console do Expo Go:

```javascript
import { testarEnvioEmailCompleto } from "./data/services/EmailTest";
await testarEnvioEmailCompleto();
```

Este teste:

- Executa o teste de dados
- Configura o serviço de e-mail para desenvolvimento local
- Simula o envio de um e-mail
- Salva o e-mail localmente para visualização

### 3. Verificar E-mails Salvos

```javascript
import { mostrarEmailsLocais } from "./data/services/EmailTest";
mostrarEmailsLocais();
```

## Estrutura de Dados Esperada

### Coletas de Exemplo

```javascript
// Coleta ID 1
{
  id: 1,
  nome: "Coleta 1 - Espécie A",
  campo_id: 1,  // Campo 1
  // ... outros campos
}

// Coleta ID 5 (Cerrado)
{
  id: 5,
  nome: "Coleta 5 - Espécie E (Cerrado)",
  campo_id: 4,  // Campo Cerrado 1
  // ... outros campos
}
```

### Campos de Exemplo

```javascript
// Campo ID 1
{
  id: 1,
  nome: "Campo 1",
  projeto_id: 1,  // Projeto Flora Amazônica
  usuario_id: 1
}

// Campo ID 4 (Cerrado)
{
  id: 4,
  nome: "Campo Cerrado 1",
  projeto_id: 3,  // Projeto Cerrado
  usuario_id: 2
}
```

### Projetos de Exemplo

```javascript
// Projeto ID 1
{
  id: 1,
  nome: "Projeto Flora Amazônica",
  usuario_dono_id: 1  // Usuário 1
}

// Projeto ID 3 (Cerrado)
{
  id: 3,
  nome: "Projeto Cerrado",
  usuario_dono_id: 2  // Usuário 2
}
```

### Usuários de Exemplo

```javascript
// Usuário ID 1
{
  id: 1,
  nome: "Administrador",
  sobrenome: "do sistema",
  email: "adm1@email.com"
}

// Usuário ID 2
{
  id: 2,
  nome: "Administrador II",
  sobrenome: "do sistema",
  email: "adm2@email.com"
}
```

## Fluxo de Dados para E-mail

1. **Sugestão criada** → `coleta_id: 1`
2. **Buscar coleta** → `campo_id: 1`
3. **Buscar campo** → `projeto_id: 1`
4. **Buscar projeto** → `usuario_dono_id: 1`
5. **Buscar dono** → `email: "adm1@email.com"`
6. **Buscar sugerente** → `usuario_sugerente_id: 1`
7. **Enviar e-mail** para o dono da coleta

## Troubleshooting

### Erro: "Coleta não encontrada"

- Verificar se a coleta com o ID especificado existe
- Verificar se a coleta não foi deletada (`deleted: false`)

### Erro: "Campo não encontrado"

- Verificar se o `campo_id` da coleta existe na lista de campos
- Verificar se o campo não foi deletado

### Erro: "Projeto não encontrado"

- Verificar se o `projeto_id` do campo existe na lista de projetos
- Verificar se o projeto não foi deletado

### Erro: "Dono da coleta não encontrado"

- Verificar se o `usuario_dono_id` do projeto existe na lista de usuários
- Verificar se o usuário não foi deletado

### Erro: "Sugerente não encontrado"

- Verificar se o `usuario_sugerente_id` da sugestão existe na lista de usuários
- Verificar se o usuário não foi deletado

## Logs de Debug

O sistema agora inclui logs detalhados para facilitar o debug:

```javascript
console.log("=== TESTE DE DADOS PARA E-MAIL ===");
console.log("1. Testando busca da coleta...");
console.log("2. Testando busca do campo...");
console.log("3. Testando busca do projeto...");
console.log("4. Testando busca do dono da coleta...");
console.log("5. Testando busca do sugerente...");
console.log("6. Preparando dados para o e-mail...");
```

## Configuração para Desenvolvimento

Para testar em desenvolvimento local:

```javascript
import EmailService from "./data/services/EmailService";

const emailService = EmailService.getInstance();
emailService.configurarDesenvolvimentoLocal();
```

Isso permite:

- Simulação de envio sem servidor real
- Salvamento local de e-mails para visualização
- Logs detalhados do processo
