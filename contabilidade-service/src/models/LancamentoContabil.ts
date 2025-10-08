/**
 * Tipo de lançamento contábil
 */
export enum TipoLancamento {
  DEBITO = 'DEBITO',
  CREDITO = 'CREDITO'
}

/**
 * Status do lançamento contábil
 */
export enum StatusLancamento {
  PENDENTE = 'PENDENTE',
  CONFIRMADO = 'CONFIRMADO',
  CANCELADO = 'CANCELADO'
}

/**
 * Item de lançamento - representa um débito ou crédito individual
 */
export interface ItemLancamento {
  id: string;
  contaId: string; // Referência ao ID da conta no plano de contas
  tipo: TipoLancamento;
  valor: number;
  historico: string; // Descrição do lançamento
}

/**
 * Lançamento Contábil - Agrupa débitos e créditos de uma mesma operação
 * Segue o princípio da partida dobrada: soma dos débitos = soma dos créditos
 */
export interface LancamentoContabil {
  id: string;
  data: Date;
  numeroDocumento?: string;
  historico: string; // Descrição geral da operação
  itens: ItemLancamento[];
  status: StatusLancamento;
  eventoOrigem?: string; // Tipo do evento que originou o lançamento
  metadados?: Record<string, any>; // Dados adicionais do evento
  criadoEm: Date;
  atualizadoEm: Date;
}

/**
 * DTO para criação de lançamento contábil
 */
export interface CriarLancamentoDto {
  data?: Date;
  numeroDocumento?: string;
  historico: string;
  itens: Omit<ItemLancamento, 'id'>[];
  eventoOrigem?: string;
  metadados?: Record<string, any>;
}

/**
 * Evento genérico que o motor de lançamentos irá processar
 */
export interface EventoContabil {
  tipo: string; // Ex: 'VENDA', 'PAGAMENTO', 'RECEBIMENTO'
  data: Date;
  valor: number;
  descricao: string;
  metadados?: Record<string, any>;
}
