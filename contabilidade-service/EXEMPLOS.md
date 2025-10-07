# Exemplos de Uso - Contabilidade Service

Este arquivo contém exemplos práticos de como usar o serviço de contabilidade.

## 1. Consultar Status do Serviço

```bash
curl http://localhost:3000/health
```

**Resposta:**
```json
{
  "status": "ok",
  "servico": "contabilidade-service",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 2. Listar Plano de Contas

```bash
curl http://localhost:3000/api/plano-de-contas
```

**Resposta:**
```json
{
  "sucesso": true,
  "total": 7,
  "contas": [
    {
      "id": "1",
      "codigo": "1.1.1.01",
      "nome": "Caixa",
      "tipo": "ATIVO",
      "natureza": "DEVEDORA",
      "descricao": "Conta de caixa",
      "ativo": true
    },
    ...
  ]
}
```

## 3. Processar Eventos Contábeis

### 3.1 Evento de Venda

```bash
curl -X POST http://localhost:3000/api/lancamentos \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "VENDA",
    "valor": 1500.00,
    "descricao": "Venda de produto X para cliente Y",
    "metadados": {
      "clienteId": "C001",
      "produtoId": "P456",
      "notaFiscal": "NF-12345"
    }
  }'
```

**Lançamentos gerados:**
- **Débito**: Conta "Caixa" (1.1.1.01) - R$ 1.500,00
- **Crédito**: Conta "Receita de Vendas" (3.1.1.01) - R$ 1.500,00

### 3.2 Evento de Pagamento

```bash
curl -X POST http://localhost:3000/api/lancamentos \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "PAGAMENTO",
    "valor": 800.00,
    "descricao": "Pagamento a fornecedor ABC Ltda",
    "metadados": {
      "fornecedorId": "F789",
      "numeroDocumento": "DOC-98765"
    }
  }'
```

**Lançamentos gerados:**
- **Débito**: Conta "Fornecedores" (2.1.1.01) - R$ 800,00
- **Crédito**: Conta "Caixa" (1.1.1.01) - R$ 800,00

### 3.3 Evento de Recebimento

```bash
curl -X POST http://localhost:3000/api/lancamentos \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "RECEBIMENTO",
    "valor": 2000.00,
    "descricao": "Recebimento de cliente XYZ",
    "metadados": {
      "clienteId": "C002",
      "duplicataId": "DUP-555"
    }
  }'
```

**Lançamentos gerados:**
- **Débito**: Conta "Caixa" (1.1.1.01) - R$ 2.000,00
- **Crédito**: Conta "Contas a Receber" (1.1.3.01) - R$ 2.000,00

### 3.4 Evento de Compra

```bash
curl -X POST http://localhost:3000/api/lancamentos \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "COMPRA",
    "valor": 1200.00,
    "descricao": "Compra de mercadorias para estoque",
    "metadados": {
      "fornecedorId": "F123",
      "notaFiscal": "NF-99999"
    }
  }'
```

**Lançamentos gerados:**
- **Débito**: Conta "Estoque" (1.2.1.01) - R$ 1.200,00
- **Crédito**: Conta "Fornecedores" (2.1.1.01) - R$ 1.200,00

### 3.5 Evento de Despesa

```bash
curl -X POST http://localhost:3000/api/lancamentos \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "DESPESA",
    "valor": 350.00,
    "descricao": "Pagamento de aluguel",
    "metadados": {
      "categoria": "aluguel",
      "periodo": "2024-01"
    }
  }'
```

**Lançamentos gerados:**
- **Débito**: Conta "Despesas Operacionais" (4.1.1.01) - R$ 350,00
- **Crédito**: Conta "Caixa" (1.1.1.01) - R$ 350,00

## 4. Criar Lançamento Manual

Para casos onde é necessário criar um lançamento específico sem usar os eventos pré-definidos:

```bash
curl -X POST http://localhost:3000/api/lancamentos/manual \
  -H "Content-Type: application/json" \
  -d '{
    "historico": "Transferência entre contas",
    "numeroDocumento": "TRANS-001",
    "data": "2024-01-15T14:30:00Z",
    "itens": [
      {
        "contaId": "2",
        "tipo": "DEBITO",
        "valor": 1000.00,
        "historico": "Transferência para banco"
      },
      {
        "contaId": "1",
        "tipo": "CREDITO",
        "valor": 1000.00,
        "historico": "Saída do caixa"
      }
    ]
  }'
```

## 5. Adicionar Nova Conta ao Plano de Contas

```bash
curl -X POST http://localhost:3000/api/plano-de-contas \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "1.1.2.05",
    "nome": "Banco Bradesco C/C",
    "tipo": "ATIVO",
    "natureza": "DEVEDORA",
    "descricao": "Conta corrente Bradesco agência 1234"
  }'
```

## 6. Listar Todos os Lançamentos

```bash
curl http://localhost:3000/api/lancamentos
```

## 7. Obter Lançamento Específico

```bash
# Substitua {id} pelo ID retornado ao criar um lançamento
curl http://localhost:3000/api/lancamentos/{id}
```

## 8. Exemplo de Integração Completa

Cenário: Empresa realiza uma venda, depois recebe o pagamento.

### Passo 1: Registrar a venda

```bash
curl -X POST http://localhost:3000/api/lancamentos \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "VENDA",
    "valor": 5000.00,
    "descricao": "Venda de 10 unidades do produto XYZ",
    "metadados": {
      "clienteId": "C123",
      "quantidade": 10,
      "produtoId": "XYZ"
    }
  }'
```

Isso cria o lançamento:
- Débito: Caixa R$ 5.000,00 (se à vista)
- Crédito: Receita de Vendas R$ 5.000,00

### Passo 2: Se a venda foi a prazo, registrar o recebimento posterior

```bash
curl -X POST http://localhost:3000/api/lancamentos \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "RECEBIMENTO",
    "valor": 5000.00,
    "descricao": "Recebimento da venda ref. cliente C123",
    "metadados": {
      "clienteId": "C123",
      "vendaId": "VENDA-001"
    }
  }'
```

Isso cria o lançamento:
- Débito: Caixa R$ 5.000,00
- Crédito: Contas a Receber R$ 5.000,00

## 9. Validações Automáticas

O sistema valida automaticamente:

### 9.1 Partida Dobrada

Tentativa de criar lançamento desbalanceado:

```bash
curl -X POST http://localhost:3000/api/lancamentos/manual \
  -H "Content-Type: application/json" \
  -d '{
    "historico": "Lançamento inválido",
    "itens": [
      {
        "contaId": "1",
        "tipo": "DEBITO",
        "valor": 1000.00,
        "historico": "Débito"
      },
      {
        "contaId": "5",
        "tipo": "CREDITO",
        "valor": 500.00,
        "historico": "Crédito"
      }
    ]
  }'
```

**Resposta de erro:**
```json
{
  "sucesso": false,
  "erro": "Lançamento desbalanceado: Débito=1000, Crédito=500"
}
```

### 9.2 Campos Obrigatórios

Tentativa sem informar o tipo de evento:

```bash
curl -X POST http://localhost:3000/api/lancamentos \
  -H "Content-Type: application/json" \
  -d '{
    "valor": 100.00,
    "descricao": "Teste"
  }'
```

**Resposta de erro:**
```json
{
  "erro": "Campo \"tipo\" é obrigatório"
}
```

## 10. Usando com Scripts

### Script Python

```python
import requests
import json

BASE_URL = "http://localhost:3000"

def processar_venda(valor, descricao, metadados=None):
    url = f"{BASE_URL}/api/lancamentos"
    payload = {
        "tipo": "VENDA",
        "valor": valor,
        "descricao": descricao,
        "metadados": metadados or {}
    }
    response = requests.post(url, json=payload)
    return response.json()

# Exemplo de uso
resultado = processar_venda(
    valor=1500.00,
    descricao="Venda de serviço de consultoria",
    metadados={"clienteId": "C789", "projeto": "Proj-123"}
)

print(json.dumps(resultado, indent=2))
```

### Script Node.js

```javascript
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function processarVenda(valor, descricao, metadados = {}) {
  const response = await axios.post(`${BASE_URL}/api/lancamentos`, {
    tipo: 'VENDA',
    valor,
    descricao,
    metadados
  });
  return response.data;
}

// Exemplo de uso
(async () => {
  const resultado = await processarVenda(
    1500.00,
    'Venda de serviço de consultoria',
    { clienteId: 'C789', projeto: 'Proj-123' }
  );
  console.log(JSON.stringify(resultado, null, 2));
})();
```

## 11. Tipos de Eventos Suportados

| Tipo | Descrição | Débito | Crédito |
|------|-----------|--------|---------|
| VENDA | Venda de produto/serviço | Caixa | Receita de Vendas |
| PAGAMENTO | Pagamento a fornecedor | Fornecedores | Caixa |
| RECEBIMENTO | Recebimento de cliente | Caixa | Contas a Receber |
| COMPRA | Compra de mercadoria | Estoque | Fornecedores |
| DESPESA | Despesa operacional | Despesas Operacionais | Caixa |
