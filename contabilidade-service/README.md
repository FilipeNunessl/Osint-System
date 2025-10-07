# Contabilidade Service

Serviço de contabilidade com motor de lançamentos contábeis baseado no princípio da partida dobrada.

## 📋 Descrição

Este serviço implementa a funcionalidade central para processamento de eventos contábeis e geração automática de lançamentos de débito e crédito, seguindo o princípio contábil da partida dobrada.

### Funcionalidades Implementadas

- ✅ **Plano de Contas**: Estrutura hierárquica para definir as contas contábeis
- ✅ **Motor de Lançamentos**: Processamento automático de eventos em lançamentos contábeis
- ✅ **Partida Dobrada**: Validação automática de que débitos = créditos
- ✅ **API RESTful**: Endpoints para integração com outros serviços

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Instalação

```bash
# Instalar dependências
npm install

# Compilar TypeScript
npm run build

# Iniciar servidor em modo desenvolvimento
npm run dev

# Iniciar servidor em produção
npm start
```

## 📡 API Endpoints

### Health Check

```http
GET /health
```

Retorna o status do serviço.

### Plano de Contas

#### Listar todas as contas

```http
GET /api/plano-de-contas
```

#### Obter conta específica

```http
GET /api/plano-de-contas/:id
```

#### Criar nova conta

```http
POST /api/plano-de-contas
Content-Type: application/json

{
  "codigo": "1.1.1.05",
  "nome": "Banco Bradesco",
  "tipo": "ATIVO",
  "natureza": "DEVEDORA",
  "descricao": "Conta corrente Bradesco"
}
```

**Tipos de Conta**: `ATIVO`, `PASSIVO`, `PATRIMONIO_LIQUIDO`, `RECEITA`, `DESPESA`

**Natureza do Saldo**: `DEVEDORA`, `CREDORA`

### Lançamentos Contábeis

#### Processar Evento (Automático)

```http
POST /api/lancamentos
Content-Type: application/json

{
  "tipo": "VENDA",
  "valor": 1500.00,
  "descricao": "Venda de produto X para cliente Y",
  "data": "2024-01-15T10:30:00Z",
  "metadados": {
    "clienteId": "123",
    "produtoId": "456",
    "vendedorId": "789"
  }
}
```

**Tipos de Evento Suportados**:

- `VENDA`: Débito em Caixa, Crédito em Receita de Vendas
- `PAGAMENTO`: Débito em Fornecedores, Crédito em Caixa
- `RECEBIMENTO`: Débito em Caixa, Crédito em Contas a Receber
- `COMPRA`: Débito em Estoque, Crédito em Fornecedores
- `DESPESA`: Débito em Despesas Operacionais, Crédito em Caixa

#### Criar Lançamento Manual

```http
POST /api/lancamentos/manual
Content-Type: application/json

{
  "historico": "Lançamento de ajuste",
  "data": "2024-01-15T10:30:00Z",
  "itens": [
    {
      "contaId": "1",
      "tipo": "DEBITO",
      "valor": 500.00,
      "historico": "Débito em Caixa"
    },
    {
      "contaId": "5",
      "tipo": "CREDITO",
      "valor": 500.00,
      "historico": "Crédito em Receita"
    }
  ]
}
```

#### Listar Lançamentos

```http
GET /api/lancamentos
```

#### Obter Lançamento Específico

```http
GET /api/lancamentos/:id
```

## 🏗️ Arquitetura

```
contabilidade-service/
├── src/
│   ├── models/              # Modelos de dados
│   │   ├── PlanoDeContas.ts
│   │   └── LancamentoContabil.ts
│   ├── controllers/         # Controladores HTTP
│   │   ├── PlanoDeContasController.ts
│   │   └── LancamentosController.ts
│   ├── services/            # Lógica de negócio
│   │   └── MotorLancamentos.ts
│   ├── routes/              # Definição de rotas
│   │   ├── planoDeContas.ts
│   │   └── lancamentos.ts
│   ├── utils/               # Utilitários
│   │   └── dataStore.ts
│   └── index.ts             # Ponto de entrada
├── package.json
├── tsconfig.json
└── README.md
```

## 💡 Conceitos Contábeis

### Partida Dobrada

Cada lançamento contábil deve ter pelo menos um débito e um crédito, e a soma dos débitos deve ser igual à soma dos créditos.

**Exemplo de Venda**:
```
Débito: Caixa         R$ 1.000,00
Crédito: Receitas     R$ 1.000,00
```

### Plano de Contas Padrão

O serviço vem com um plano de contas básico pré-configurado:

| Código    | Nome                  | Tipo       | Natureza  |
|-----------|-----------------------|------------|-----------|
| 1.1.1.01  | Caixa                 | ATIVO      | DEVEDORA  |
| 1.1.2.01  | Bancos                | ATIVO      | DEVEDORA  |
| 1.1.3.01  | Contas a Receber      | ATIVO      | DEVEDORA  |
| 1.2.1.01  | Estoque               | ATIVO      | DEVEDORA  |
| 2.1.1.01  | Fornecedores          | PASSIVO    | CREDORA   |
| 3.1.1.01  | Receita de Vendas     | RECEITA    | CREDORA   |
| 4.1.1.01  | Despesas Operacionais | DESPESA    | DEVEDORA  |

## 🔄 Exemplo de Uso Completo

### 1. Listar o Plano de Contas

```bash
curl http://localhost:3000/api/plano-de-contas
```

### 2. Processar uma Venda

```bash
curl -X POST http://localhost:3000/api/lancamentos \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "VENDA",
    "valor": 1500.00,
    "descricao": "Venda de mercadoria",
    "metadados": {
      "clienteId": "C001"
    }
  }'
```

### 3. Listar Lançamentos

```bash
curl http://localhost:3000/api/lancamentos
```

## 🔮 Próximos Passos (Issue #3)

- [ ] Integração com fila de mensagens (RabbitMQ, Kafka, etc.)
- [ ] Processamento assíncrono de eventos
- [ ] Persistência em banco de dados (PostgreSQL, MongoDB)
- [ ] Autenticação e autorização
- [ ] Testes automatizados
- [ ] Documentação com Swagger/OpenAPI

## 📝 Notas Técnicas

- **Armazenamento**: Atualmente usa armazenamento em memória. Em produção, deve ser substituído por um banco de dados.
- **Validações**: O sistema valida automaticamente a partida dobrada e a existência das contas.
- **IDs**: Usa UUID v4 para garantir unicidade dos registros.
- **Datas**: Aceita datas em formato ISO 8601. Se não fornecida, usa a data/hora atual.

## 📄 Licença

MIT
