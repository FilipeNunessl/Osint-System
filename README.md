# Osint-System

Plataforma SaaS para Prestação de Contas Municipais ao TCE-CE

## 📋 Sobre o Projeto

Sistema modular para automatizar, organizar e garantir a conformidade da prestação de contas anual das prefeituras cearenses junto ao Tribunal de Contas do Estado do Ceará (TCE-CE).

## 🏗️ Arquitetura

O sistema é organizado em microserviços:

### Serviços Implementados

#### 1. Contabilidade Service ✅
Serviço de contabilidade com motor de lançamentos baseado em partida dobrada.

**Localização**: [`contabilidade-service/`](./contabilidade-service/)

**Funcionalidades**:
- Motor de lançamentos contábeis automático
- Processamento de eventos em lançamentos de débito e crédito
- Validação de partida dobrada
- API RESTful completa
- Plano de contas configurável

**Tipos de Eventos Suportados**:
- VENDA
- PAGAMENTO
- RECEBIMENTO
- COMPRA
- DESPESA

**Documentação**: Ver [README do serviço](./contabilidade-service/README.md) e [exemplos práticos](./contabilidade-service/EXEMPLOS.md)

**Como executar**:
```bash
cd contabilidade-service
npm install
npm run dev
# Servidor em http://localhost:3000
```

## 📚 Documentação

- [Especificação da Plataforma](./docs/plataforma_saas_tce_ce.md)
- [Resumo da Implementação](./IMPLEMENTATION_SUMMARY.md)

## 🚀 Próximos Passos

- [ ] Integração com fila de mensagens (Issue #3)
- [ ] Persistência em banco de dados
- [ ] Módulo de gestão de documentação
- [ ] Módulo de checklist normativo
- [ ] Frontend da plataforma
- [ ] Integração com Portal TCE-CE

## 📄 Licença

MIT