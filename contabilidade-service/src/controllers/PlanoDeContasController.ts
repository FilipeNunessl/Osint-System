import { Request, Response } from 'express';
import { dataStore } from '../utils/dataStore';
import { PlanoDeContas, CriarPlanoDeContasDto } from '../models';
import { v4 as uuidv4 } from 'uuid';

/**
 * Controller para endpoints do Plano de Contas
 */
export class PlanoDeContasController {
  /**
   * GET /api/plano-de-contas
   * Lista todas as contas
   */
  async listarContas(req: Request, res: Response): Promise<void> {
    try {
      const contas = dataStore.listarContas();
      res.status(200).json({
        sucesso: true,
        total: contas.length,
        contas
      });
    } catch (erro: any) {
      console.error('Erro ao listar contas:', erro);
      res.status(500).json({
        sucesso: false,
        erro: erro.message || 'Erro ao listar contas'
      });
    }
  }

  /**
   * GET /api/plano-de-contas/:id
   * Obtém uma conta específica
   */
  async obterConta(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const conta = dataStore.obterConta(id);

      if (!conta) {
        res.status(404).json({
          sucesso: false,
          erro: 'Conta não encontrada'
        });
        return;
      }

      res.status(200).json({
        sucesso: true,
        conta
      });
    } catch (erro: any) {
      console.error('Erro ao obter conta:', erro);
      res.status(500).json({
        sucesso: false,
        erro: erro.message || 'Erro ao obter conta'
      });
    }
  }

  /**
   * POST /api/plano-de-contas
   * Cria uma nova conta
   */
  async criarConta(req: Request, res: Response): Promise<void> {
    try {
      const dto: CriarPlanoDeContasDto = req.body;

      // Validação básica
      if (!dto.codigo) {
        res.status(400).json({ erro: 'Campo "codigo" é obrigatório' });
        return;
      }
      if (!dto.nome) {
        res.status(400).json({ erro: 'Campo "nome" é obrigatório' });
        return;
      }
      if (!dto.tipo) {
        res.status(400).json({ erro: 'Campo "tipo" é obrigatório' });
        return;
      }
      if (!dto.natureza) {
        res.status(400).json({ erro: 'Campo "natureza" é obrigatório' });
        return;
      }

      // Verifica se o código já existe
      const contaExistente = dataStore.buscarContaPorCodigo(dto.codigo);
      if (contaExistente) {
        res.status(400).json({ 
          erro: `Já existe uma conta com o código ${dto.codigo}` 
        });
        return;
      }

      const agora = new Date();
      const conta: PlanoDeContas = {
        id: uuidv4(),
        codigo: dto.codigo,
        nome: dto.nome,
        tipo: dto.tipo,
        natureza: dto.natureza,
        descricao: dto.descricao,
        contaPai: dto.contaPai,
        ativo: true,
        criadoEm: agora,
        atualizadoEm: agora
      };

      dataStore.adicionarConta(conta);

      res.status(201).json({
        sucesso: true,
        mensagem: 'Conta criada com sucesso',
        conta
      });
    } catch (erro: any) {
      console.error('Erro ao criar conta:', erro);
      res.status(400).json({
        sucesso: false,
        erro: erro.message || 'Erro ao criar conta'
      });
    }
  }
}

export const planoDeContasController = new PlanoDeContasController();
