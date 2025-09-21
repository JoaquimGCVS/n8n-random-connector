# n8n Random Connector

Conector personalizado para o [n8n](https://n8n.io/) que gera números aleatórios utilizando a API do [Random.org](https://www.random.org/).

## ✨ Funcionalidades

- **Node:** Random
- **Operação:** True Random Number Generator
- **Inputs:**  
  - `Min` (número inteiro, obrigatório)
  - `Max` (número inteiro, obrigatório)
- **Retorno:** Um número aleatório entre `Min` e `Max` (inclusive), gerado via Random.org

## 📦 Estrutura do Projeto

```
custom_nodes/
  n8n-nodes-random/
    nodes/
      Random/
        Random.node.ts
        random.svg
    package.json
    tsconfig.json
docker-compose.yml
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

> O n8n estará disponível em [http://localhost:5678](http://localhost:5678)

## 🧩 Como usar o node Random no n8n

1. Acesse o n8n em [http://localhost:5678](http://localhost:5678)
2. Procure pelo node **Random** na lista de nodes.
3. Arraste para o canvas.
4. Preencha os campos `Min` e `Max` com os valores desejados.
5. Execute o workflow para obter um número aleatório.

## 🛠️ Tecnologias utilizadas

- Node.js 22 LTS
- TypeScript
- Docker Compose
- PostgreSQL
- n8n (self-hosted, versão 1.85.4)
- Random.org API

## 📁 Organização dos arquivos

- `docker-compose.yml`: Sobe o n8n e o banco Postgres.
- `custom_nodes/n8n-nodes-random`: Pacote do node customizado.
- `nodes/Random/Random.node.ts`: Código principal do node.
- `nodes/Random/random.svg`: Ícone SVG do node.

## 📝 Observações

- O node utiliza a API pública do Random.org. Para uso em produção, consulte limites e políticas da API.
- O ícone SVG é carregado automaticamente após o build.

## 📚 Referências

- [Documentação oficial do n8n](https://docs.n8n.io/)
- [Como criar nodes customizados](https://docs.n8n.io/integrations/creating-nodes/create-node/)
- [Random.org API](https://www.random.org/clients/http/)

---

Desenvolvido por Joaquim Vilela.