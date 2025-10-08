import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import lancamentosRoutes from './routes/lancamentos';
import planoDeContasRoutes from './routes/planoDeContas';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logger middleware
app.use((req: Request, res: Response, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/lancamentos', lancamentosRoutes);
app.use('/api/plano-de-contas', planoDeContasRoutes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    servico: 'contabilidade-service',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint with API documentation
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    servico: 'Contabilidade Service',
    versao: '1.0.0',
    descricao: 'Serviço de contabilidade com motor de lançamentos de partida dobrada',
    endpoints: {
      health: 'GET /health',
      planoDeContas: {
        listar: 'GET /api/plano-de-contas',
        obter: 'GET /api/plano-de-contas/:id',
        criar: 'POST /api/plano-de-contas'
      },
      lancamentos: {
        processarEvento: 'POST /api/lancamentos',
        criarManual: 'POST /api/lancamentos/manual',
        listar: 'GET /api/lancamentos',
        obter: 'GET /api/lancamentos/:id'
      }
    },
    exemplos: {
      processarEvento: {
        metodo: 'POST',
        url: '/api/lancamentos',
        body: {
          tipo: 'VENDA',
          valor: 1000.00,
          descricao: 'Venda de produto X',
          data: '2024-01-15T10:30:00Z',
          metadados: {
            clienteId: '123',
            produtoId: '456'
          }
        }
      },
      tiposDeEvento: [
        'VENDA - Registra uma venda (Débito: Caixa, Crédito: Receita)',
        'PAGAMENTO - Registra um pagamento (Débito: Fornecedores, Crédito: Caixa)',
        'RECEBIMENTO - Registra um recebimento (Débito: Caixa, Crédito: Contas a Receber)',
        'COMPRA - Registra uma compra (Débito: Estoque, Crédito: Fornecedores)',
        'DESPESA - Registra uma despesa (Débito: Despesas, Crédito: Caixa)'
      ]
    }
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({
    sucesso: false,
    erro: 'Erro interno do servidor'
  });
});

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log(`🚀 Contabilidade Service iniciado`);
  console.log(`📍 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📚 Documentação disponível em http://localhost:${PORT}/`);
  console.log('='.repeat(60));
});

export default app;
