import { v4 as uuidv4 } from 'uuid';
import {
  EventoContabil,
  LancamentoContabil,
  ItemLancamento,
  TipoLancamento,
  StatusLancamento,
  CriarLancamentoDto
} from '../models';
import { dataStore } from '../utils/dataStore';

/**
 * Motor de Lançamentos Contábeis
 * Responsável por processar eventos e criar lançamentos de partida dobrada
 */
export class MotorLancamentos {
  /**
   * Processa um evento contábil e gera os lançamentos correspondentes
   */
  processarEvento(evento: EventoContabil): LancamentoContabil {
    // Determina quais contas devem ser debitadas e creditadas baseado no tipo de evento
    const itens = this.determinarLancamentos(evento);
    
    // Valida se o lançamento está balanceado (partida dobrada)
    this.validarPartidaDobrada(itens);

    // Cria o lançamento contábil
    const lancamento = this.criarLancamento({
      data: evento.data,
      historico: evento.descricao,
      itens: itens,
      eventoOrigem: evento.tipo,
      metadados: evento.metadados
    });

    return lancamento;
  }

  /**
   * Determina os lançamentos de débito e crédito baseado no tipo de evento
   */
  private determinarLancamentos(evento: EventoContabil): Omit<ItemLancamento, 'id'>[] {
    const itens: Omit<ItemLancamento, 'id'>[] = [];

    switch (evento.tipo.toUpperCase()) {
      case 'VENDA':
        // Débito: Caixa/Bancos ou Contas a Receber
        // Crédito: Receita de Vendas
        itens.push({
          contaId: '1', // Caixa
          tipo: TipoLancamento.DEBITO,
          valor: evento.valor,
          historico: `Venda: ${evento.descricao}`
        });
        itens.push({
          contaId: '5', // Receita de Vendas
          tipo: TipoLancamento.CREDITO,
          valor: evento.valor,
          historico: `Venda: ${evento.descricao}`
        });
        break;

      case 'PAGAMENTO':
        // Débito: Fornecedores ou Despesas
        // Crédito: Caixa/Bancos
        itens.push({
          contaId: '4', // Fornecedores
          tipo: TipoLancamento.DEBITO,
          valor: evento.valor,
          historico: `Pagamento: ${evento.descricao}`
        });
        itens.push({
          contaId: '1', // Caixa
          tipo: TipoLancamento.CREDITO,
          valor: evento.valor,
          historico: `Pagamento: ${evento.descricao}`
        });
        break;

      case 'RECEBIMENTO':
        // Débito: Caixa/Bancos
        // Crédito: Contas a Receber
        itens.push({
          contaId: '1', // Caixa
          tipo: TipoLancamento.DEBITO,
          valor: evento.valor,
          historico: `Recebimento: ${evento.descricao}`
        });
        itens.push({
          contaId: '3', // Contas a Receber
          tipo: TipoLancamento.CREDITO,
          valor: evento.valor,
          historico: `Recebimento: ${evento.descricao}`
        });
        break;

      case 'COMPRA':
        // Débito: Estoque ou Despesas
        // Crédito: Fornecedores ou Caixa/Bancos
        itens.push({
          contaId: '7', // Estoque
          tipo: TipoLancamento.DEBITO,
          valor: evento.valor,
          historico: `Compra: ${evento.descricao}`
        });
        itens.push({
          contaId: '4', // Fornecedores
          tipo: TipoLancamento.CREDITO,
          valor: evento.valor,
          historico: `Compra: ${evento.descricao}`
        });
        break;

      case 'DESPESA':
        // Débito: Despesas Operacionais
        // Crédito: Caixa/Bancos
        itens.push({
          contaId: '6', // Despesas Operacionais
          tipo: TipoLancamento.DEBITO,
          valor: evento.valor,
          historico: `Despesa: ${evento.descricao}`
        });
        itens.push({
          contaId: '1', // Caixa
          tipo: TipoLancamento.CREDITO,
          valor: evento.valor,
          historico: `Despesa: ${evento.descricao}`
        });
        break;

      default:
        throw new Error(`Tipo de evento não suportado: ${evento.tipo}`);
    }

    return itens;
  }

  /**
   * Valida se os débitos e créditos estão balanceados (partida dobrada)
   */
  private validarPartidaDobrada(itens: Omit<ItemLancamento, 'id'>[]): void {
    const totalDebito = itens
      .filter(item => item.tipo === TipoLancamento.DEBITO)
      .reduce((sum, item) => sum + item.valor, 0);

    const totalCredito = itens
      .filter(item => item.tipo === TipoLancamento.CREDITO)
      .reduce((sum, item) => sum + item.valor, 0);

    // Considera uma pequena margem de erro para problemas de ponto flutuante
    const diferenca = Math.abs(totalDebito - totalCredito);
    if (diferenca > 0.01) {
      throw new Error(
        `Lançamento desbalanceado: Débito=${totalDebito}, Crédito=${totalCredito}`
      );
    }
  }

  /**
   * Cria um lançamento contábil
   */
  criarLancamento(dto: CriarLancamentoDto): LancamentoContabil {
    const agora = new Date();
    const id = uuidv4();

    // Gera IDs para os itens
    const itensComId: ItemLancamento[] = dto.itens.map(item => ({
      ...item,
      id: uuidv4()
    }));

    // Valida se as contas existem
    itensComId.forEach(item => {
      const conta = dataStore.obterConta(item.contaId);
      if (!conta) {
        throw new Error(`Conta não encontrada: ${item.contaId}`);
      }
      if (!conta.ativo) {
        throw new Error(`Conta inativa: ${conta.nome}`);
      }
    });

    // Valida partida dobrada
    this.validarPartidaDobrada(itensComId);

    const lancamento: LancamentoContabil = {
      id,
      data: dto.data || agora,
      numeroDocumento: dto.numeroDocumento,
      historico: dto.historico,
      itens: itensComId,
      status: StatusLancamento.CONFIRMADO,
      eventoOrigem: dto.eventoOrigem,
      metadados: dto.metadados,
      criadoEm: agora,
      atualizadoEm: agora
    };

    dataStore.adicionarLancamento(lancamento);

    return lancamento;
  }

  /**
   * Lista todos os lançamentos
   */
  listarLancamentos(): LancamentoContabil[] {
    return dataStore.listarLancamentos();
  }

  /**
   * Obtém um lançamento específico
   */
  obterLancamento(id: string): LancamentoContabil | undefined {
    return dataStore.obterLancamento(id);
  }
}

export const motorLancamentos = new MotorLancamentos();
