/**
 * Tipo de conta contábil conforme estrutura contábil brasileira
 */
export enum TipoConta {
  ATIVO = 'ATIVO',
  PASSIVO = 'PASSIVO',
  PATRIMONIO_LIQUIDO = 'PATRIMONIO_LIQUIDO',
  RECEITA = 'RECEITA',
  DESPESA = 'DESPESA'
}

/**
 * Natureza do saldo da conta
 */
export enum NaturezaSaldo {
  DEVEDORA = 'DEVEDORA',
  CREDORA = 'CREDORA'
}

/**
 * Plano de Contas - Define a estrutura das contas contábeis
 */
export interface PlanoDeContas {
  id: string;
  codigo: string; // Ex: 1.1.1.01 (código hierárquico)
  nome: string;
  tipo: TipoConta;
  natureza: NaturezaSaldo;
  descricao?: string;
  contaPai?: string; // ID da conta pai para hierarquia
  ativo: boolean;
  criadoEm: Date;
  atualizadoEm: Date;
}

/**
 * Dados para criação de uma conta no plano de contas
 */
export interface CriarPlanoDeContasDto {
  codigo: string;
  nome: string;
  tipo: TipoConta;
  natureza: NaturezaSaldo;
  descricao?: string;
  contaPai?: string;
}
