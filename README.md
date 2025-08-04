# 💰 Sistema de Registro Financeiro

Um sistema simples e eficiente para controle de transações financeiras com operações CRUD completas.

![Imagens](https://github.com/Mochizabb/Registro-Financeiro/blob/main/image.png)

![Dashboard](https://img.shields.io/badge/Status-Funcionando-brightgreen)
![Versão](https://img.shields.io/badge/Versão-1.0.0-blue)
![Licença](https://img.shields.io/badge/Licença-MIT-yellow)

## 📋 Funcionalidades

- ✅ **Adicionar** transações (entradas e saídas)
- ✅ **Visualizar** histórico de transações ordenado por data
- ✅ **Editar** transações existentes (modo inline)
- ✅ **Deletar** transações com modal de confirmação
- ✅ **Gráfico de barras** visual de entradas/saídas por data
- ✅ **Dashboard** com 3 seções principais
- ✅ **Sincronização** automática com backend
- ✅ **Notificações** toast de sucesso/erro
- ✅ **Interface** responsiva e moderna
- ✅ **CRUD completo** com IDs únicos

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5** - Estrutura da aplicação (`index.html`)
- **CSS3** - Estilização e layout responsivo (`src/style.css`)
- **JavaScript ES6** - Lógica e interações (`src/script.js`)
- **Chart.js** - Biblioteca para gráficos (`src/chartGraph.js`)
- **Fetch API** - Comunicação com backend

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web (`API/server.js`)
- **SQLite** - Banco de dados (`database/data.db`)
- **CORS** - Cross-Origin Resource Sharing

### Scripts Utilitários
- **create_db.js** - Inicialização do banco de dados
- **clear_db.js** - Limpeza de dados para desenvolvimento

## 📁 Estrutura do Projeto

```
sistema-financeiro/
├── API/
│   └── server.js
├── database/
│   └── data.db
├── databaseScripts/
│   ├── clear_db.js
│   └── create_db.js
├── node_modules/
├── src/
│   ├── chartGraph.js
│   ├── script.js
│   └── style.css
├── .gitignore
├── index.html
├── package-lock.json
├── package.json
└── README.md
```

### 📋 Descrição dos Arquivos

#### **Raiz do Projeto**
- `index.html` - Página principal da aplicação
- `package.json` - Dependências e scripts do Node.js
- `package-lock.json` - Lock das versões das dependências
- `README.md` - Documentação do projeto

#### **API/**
- `server.js` - Servidor Express com endpoints REST

#### **database/**
- `data.db` - Banco de dados SQLite com as transações

#### **databaseScripts/**
- `create_db.js` - Script para criar/inicializar o banco
- `clear_db.js` - Script para limpar dados do banco

#### **src/**
- `script.js` - Lógica principal do frontend (CRUD)
- `chartGraph.js` - Lógica específica para gráficos
- `style.css` - Estilos da aplicação

## 🗄️ Estrutura do Banco de Dados

```sql
-- Script em databaseScripts/create_db.js
CREATE TABLE transacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    descricao TEXT NOT NULL,
    entradas DECIMAL(10,2) DEFAULT 0,
    saidas DECIMAL(10,2) DEFAULT 0,
    data DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js v14 ou superior
- npm ou yarn

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/sistema-financeiro.git
cd sistema-financeiro
```

### 2. Configure o Banco de Dados
```bash
# Criar o banco de dados
node databaseScripts/create_db.js

# (Opcional) Limpar dados existentes
node databaseScripts/clear_db.js
```

### 3. Configure o Backend
```bash
npm install
node API/server.js
# Servidor rodando em http://localhost:3030
```

### 4. Abra o Frontend
```bash
# Abra o arquivo index.html no navegador
# ou use um servidor local como Live Server
```

## 📡 API Endpoints

### GET `/api/data`
Retorna todas as transações
```json
[
    {
        "id": 1,
        "descricao": "Salário",
        "entradas": 5000.00,
        "saidas": 0.00,
        "data": "2024-01-15"
    }
]
```

### POST `/api/data`
Cria nova transação
```json
// Request
{
    "descricao": "Salário Janeiro",
    "data": "2024-01-15",
    "entradas": 5000.00,
    "saidas": 0.00
}

// Response
{
    "id": 1,
    "descricao": "Salário Janeiro",
    "entradas": 5000.00,
    "saidas": 0.00,
    "data": "2024-01-15"
}
```

### PUT `/api/data`
Atualiza transação existente
```json
// Request
{
    "id": 1,
    "novos_dados": {
        "descricao": "Salário Janeiro 2024",
        "entradas": 5500.00,
        "saidas": 0.00,
        "data": "2024-01-15"
    }
}

// Response
{
    "message": "Transação atualizada com sucesso",
    "id": 1,
    "dados_atualizados": { ... }
}
```

### DELETE `/api/data/:id`
Remove transação
```json
// Response
{
    "message": "Transação deletada com sucesso",
    "id": 1
}
```

## 💻 Funcionalidades do Frontend

### 📊 Dashboard com 3 Seções

#### 1. **Card Movimento** (Esquerda)
- Formulário para adicionar transações
- Campos: Descrição, Valor, Data
- Botões "ENTRADA" (verde) e "SAÍDA" (vermelha)

#### 2. **Card Gráfico de Gastos** (Centro)  
- Visualização em barras das transações por data
- **Barras verdes**: Representam entradas
- **Barras vermelhas**: Representam saídas
- Legenda colorida explicativa
- Agrupamento automático por data

#### 3. **Card Histórico** (Direita)
- Tabela com todas as transações
- Ordenação por data (mais recente primeiro)
- Colunas: Descrição, Entrou, Saiu, Data, Ações
- Ícones de ação: ✏️ (editar) e 🗑️ (deletar)

### Adicionar Transação
1. Preencha a descrição, valor e data
2. Clique em "ENTRADA" ou "SAÍDA"
3. Transação é automaticamente:
   - Salva no backend
   - Adicionada à variável global `transacoes[]`
   - Exibida na tabela
   - Refletida no gráfico

### Visualizar Gráfico
- **Eixo X**: Datas das transações
- **Eixo Y**: Valores (altura das barras)
- **Cores**: Verde para entradas, vermelho para saídas
- **Interativo**: Barras se ajustam automaticamente aos dados

### Editar Transação
1. Clique no ícone ✏️ na linha desejada
2. Edite os campos diretamente na tabela
3. Clique em ✓ para salvar ou ✕ para cancelar

### Deletar Transação
1. Clique no ícone 🗑️ na linha desejada
2. Confirme a exclusão no modal
3. Transação é removida automaticamente

### Sincronização
- Variável global `transacoes[]` mantém dados sincronizados
- Sem necessidade de recarregar página
- Atualizações instantâneas na interface

## 🎨 Características da Interface

- **Design Verde Elegante** - Visual moderno e profissional
- **Layout Dashboard** - 3 cards organizados horizontalmente
- **Cards com Glassmorphism** - Efeito de vidro translúcido
- **Gráfico de Barras Interativo** - Visualização clara de entradas/saídas
  - Barras proporcionais aos valores
  - Cores diferenciadas (verde/vermelho)
  - Legenda explicativa
  - Agrupamento por data
- **Tabela Interativa** - Edição inline e hover effects
- **Notificações Toast** - Feedback visual das ações
- **Modal de Confirmação** - Para operações de delete
- **Layout Responsivo** - Funciona em desktop e mobile
- **Ícones Intuitivos** - ✏️ para editar, 🗑️ para deletar

## 🔧 Configurações

### Porta do Servidor
```javascript
// backend/server.js
const PORT = process.env.PORT || 3030;
```

### URL da API
```javascript
// src/script.js
const API_URL = 'http://localhost:3030/api/data';
```

### Scripts do Banco
```javascript
// Recriar banco limpo
node databaseScripts/clear_db.js
node databaseScripts/create_db.js
```

## 🐛 Resolução de Problemas

### Erro de CORS
Certifique-se que o backend tem as configurações CORS:
```javascript
app.use(cors());
```

### Banco não encontrado
O SQLite criará automaticamente o arquivo `data.db` na primeira execução.

### Transações não aparecem
Verifique se o backend está rodando na porta correta e se a API_URL está configurada.

## 📈 Melhorias Futuras

- [ ] **Gráficos avançados** (pizza, linha, área)
- [ ] **Filtros por período** no gráfico
- [ ] **Zoom e pan** no gráfico
- [ ] **Tooltip** com detalhes ao hover nas barras
- [ ] **Gráfico de saldo acumulado** ao longo do tempo
- [ ] Autenticação de usuários
- [ ] Categorias para transações com cores
- [ ] Filtros por período na tabela
- [ ] Exportação para CSV/PDF
- [ ] Dashboard com métricas (saldo, média, etc.)
- [ ] Modo escuro
- [ ] Backup automático

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

**Seu Nome**
- GitHub: [@Carlos Daniel](https://github.com/Mochizabb)
- Email: danielmouraaguiar@gmail.com

---

⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!