import { PlanoDeContas, LancamentoContabil, TipoConta, NaturezaSaldo } from '../models';

/**
 * Armazenamento em memória para dados
 * Em produção, seria substituído por um banco de dados
 */
class DataStore {
  private planoDeContas: Map<string, PlanoDeContas> = new Map();
  private lancamentos: Map<string, LancamentoContabil> = new Map();

  constructor() {
    this.inicializarPlanoDeContasPadrao();
  }

  /**
   * Inicializa um plano de contas básico para testes
   */
  private inicializarPlanoDeContasPadrao(): void {
    const contas: Omit<PlanoDeContas, 'criadoEm' | 'atualizadoEm'>[] = [
      {
        id: '1',
        codigo: '1.1.1.01',
        nome: 'Caixa',
        tipo: TipoConta.ATIVO,
        natureza: NaturezaSaldo.DEVEDORA,
        descricao: 'Conta de caixa',
        ativo: true
      },
      {
        id: '2',
        codigo: '1.1.2.01',
        nome: 'Bancos',
        tipo: TipoConta.ATIVO,
        natureza: NaturezaSaldo.DEVEDORA,
        descricao: 'Conta bancária',
        ativo: true
      },
      {
        id: '3',
        codigo: '1.1.3.01',
        nome: 'Contas a Receber',
        tipo: TipoConta.ATIVO,
        natureza: NaturezaSaldo.DEVEDORA,
        descricao: 'Valores a receber',
        ativo: true
      },
      {
        id: '4',
        codigo: '2.1.1.01',
        nome: 'Fornecedores',
        tipo: TipoConta.PASSIVO,
        natureza: NaturezaSaldo.CREDORA,
        descricao: 'Contas a pagar a fornecedores',
        ativo: true
      },
      {
        id: '5',
        codigo: '3.1.1.01',
        nome: 'Receita de Vendas',
        tipo: TipoConta.RECEITA,
        natureza: NaturezaSaldo.CREDORA,
        descricao: 'Receita proveniente de vendas',
        ativo: true
      },
      {
        id: '6',
        codigo: '4.1.1.01',
        nome: 'Despesas Operacionais',
        tipo: TipoConta.DESPESA,
        natureza: NaturezaSaldo.DEVEDORA,
        descricao: 'Despesas com operações',
        ativo: true
      },
      {
        id: '7',
        codigo: '1.2.1.01',
        nome: 'Estoque',
        tipo: TipoConta.ATIVO,
        natureza: NaturezaSaldo.DEVEDORA,
        descricao: 'Estoque de mercadorias',
        ativo: true
      }
    ];

    const agora = new Date();
    contas.forEach(conta => {
      this.planoDeContas.set(conta.id, {
        ...conta,
        criadoEm: agora,
        atualizadoEm: agora
      });
    });
  }

  // Métodos para Plano de Contas
  adicionarConta(conta: PlanoDeContas): void {
    this.planoDeContas.set(conta.id, conta);
  }

  obterConta(id: string): PlanoDeContas | undefined {
    return this.planoDeContas.get(id);
  }

  listarContas(): PlanoDeContas[] {
    return Array.from(this.planoDeContas.values());
  }

  buscarContaPorCodigo(codigo: string): PlanoDeContas | undefined {
    return Array.from(this.planoDeContas.values()).find(c => c.codigo === codigo);
  }

  // Métodos para Lançamentos
  adicionarLancamento(lancamento: LancamentoContabil): void {
    this.lancamentos.set(lancamento.id, lancamento);
  }

  obterLancamento(id: string): LancamentoContabil | undefined {
    return this.lancamentos.get(id);
  }

  listarLancamentos(): LancamentoContabil[] {
    return Array.from(this.lancamentos.values());
  }
}

export const dataStore = new DataStore();
