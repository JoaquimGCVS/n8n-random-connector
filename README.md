# n8n Random Connector

Conector personalizado para o [n8n](https://n8n.io/) que gera números aleatórios utilizando a API do [Random.org](https://www.random.org/).

## ✨ Funcionalidades

- **Node:** Random
- **Operação:** True Random Number Generator
- **Inputs:**  
  - `Min` (número inteiro, obrigatório)
  - `Max` (número inteiro, obrigatório)
- **Retorno:** Um número aleatório entre `Min` e `Max`, gerado via Random.org

## 📦 Estrutura do Projeto

```
n8n-random-connector/
├── custom_nodes/
│   └── n8n-nodes-random/
│       ├── nodes/
│       │   └── Random/
│       │       ├── Random.node.ts
│       │       └── random.svg
│       ├── tests/
│       │   └── Random.node.test.ts
│       ├── jest.config.js
│       ├── package.json
│       ├── package-lock.json
│       └── tsconfig.json
├── docker-compose.yml
└── README.md
```

## 🚀 Como rodar localmente

### 1. Clone o repositório

```sh
git clone https://github.com/JoaquimGCVS/n8n-random-connector.git
cd n8n-random-connector
```

### 2. Instale as dependências do custom node

```sh
cd custom_nodes/n8n-nodes-random
npm install
```

### 3. Compile o custom node

```sh
npm run build
```

### 4. Volte para a raiz do projeto

```sh
cd ../../
```

### 5. Suba a infraestrutura com Docker Compose

```sh
docker compose up -d
```

> **O n8n estará disponível em:** [http://localhost:5678](http://localhost:5678)

## ⚙️ Configuração do Ambiente

### Variáveis de Ambiente

O projeto usa as seguintes variáveis configuradas no `docker-compose.yml`:

| Variável | Valor | Descrição |
|----------|-------|-------------|
| `POSTGRES_DB` | `n8n` | Nome do banco de dados |
| `POSTGRES_USER` | `n8n` | Usuário do PostgreSQL |
| `POSTGRES_PASSWORD` | `n8n_password` | Senha do banco |
| `NODE_ENV` | `production` | Ambiente de execução |
| `DB_TYPE` | `postgresdb` | Tipo de banco de dados |
| `DB_POSTGRESDB_DATABASE` | `n8n` | Nome da base de dados do n8n |
| `DB_POSTGRESDB_HOST` | `postgres` | Host do banco |
| `GENERIC_TIMEZONE` | `America/Sao_Paulo` | Fuso horário |

### Banco de Dados

- **Tipo:** PostgreSQL 15
- **Porta:** 5432 (interna do container)
- **Volume:** `postgres_data` (persistência automática)

### Portas

| Serviço | Porta Local | Porta Container | Acesso |
|---------|-------------|-----------------|--------|
| n8n | 5678 | 5678 | http://localhost:5678 |
| PostgreSQL | Não exposta | 5432 | Interno apenas |

### Volumes Docker

| Volume | Origem | Destino | Descrição |
|--------|--------|---------|-----------|
| Custom Nodes | `./custom_nodes` | `/home/node/.n8n/custom` | Seus nodes customizados |
| Dados n8n | `n8n_data` | `/home/node/.n8n` | Workflows, configurações, credenciais |
| Dados PostgreSQL | `postgres_data` | `/var/lib/postgresql/data` | Banco de dados persistente |

## 🧪 Testes

O projeto inclui testes unitários que cobrem:

- ✅ Validação da estrutura do node
- ✅ Geração de números aleatórios com sucesso  
- ✅ Validação de entrada (min > max)
- ✅ Tratamento de erros de API
- ✅ Tratamento de respostas inválidas da API
- ✅ Verificação de chamadas corretas para a API Random.org

### Executar testes:

```sh
cd custom_nodes/n8n-nodes-random
npm test
```

## 🧩 Como usar o node Random no n8n

1. **Acesse o n8n** em [http://localhost:5678](http://localhost:5678)
2. **Crie um novo workflow** ou abra um existente
3. **Procure pelo node "Random"** na lista de nodes disponíveis
4. **Arraste o node** para o canvas do workflow
5. **Configure os parâmetros:**
   - `Minimum Number`: Valor mínimo (ex: 1)
   - `Maximum Number`: Valor máximo (ex: 100)
6. **Execute o workflow** para obter um número aleatório
7. **Visualize o resultado** no output do node

### Exemplo de retorno:

```json
{
  "randomNumber": 42,
  "min": 1,
  "max": 100,
  "source": "Random.org",
  "timestamp": "2025-09-22T12:30:45.123Z"
}
```

## 🛠️ Tecnologias utilizadas

- **Node.js 22 LTS** - Runtime JavaScript
- **TypeScript** - Linguagem de programação
- **Docker Compose** - Orquestração de containers
- **PostgreSQL** - Banco de dados para o n8n
- **n8n 1.85.4** - Plataforma de automação (self-hosted)
- **Random.org API** - Geração de números aleatórios
- **Jest** - Framework de testes unitários

## 📁 Detalhes dos arquivos

| Arquivo | Descrição |
|---------|-----------|
| `docker-compose.yml` | Configuração do n8n + PostgreSQL |
| `custom_nodes/n8n-nodes-random/` | Pacote completo do node customizado |
| `nodes/Random/Random.node.ts` | Código principal do node com lógica de execução |
| `nodes/Random/random.svg` | Ícone SVG do node (aparece na interface) |
| `tests/Random.node.test.ts` | Testes unitários |
| `jest.config.js` | Configuração do Jest para testes |
| `package.json` | Dependências e scripts do node |
| `tsconfig.json` | Configuração do TypeScript |

---

**Desenvolvido por Joaquim Vilela**