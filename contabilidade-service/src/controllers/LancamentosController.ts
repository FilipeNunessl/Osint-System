import { Request, Response } from 'express';
import { motorLancamentos } from '../services/MotorLancamentos';
import { EventoContabil, CriarLancamentoDto } from '../models';

/**
 * Controller para endpoints de lançamentos contábeis
 */
export class LancamentosController {
  /**
   * POST /api/lancamentos
   * Recebe um evento e processa em lançamento contábil
   */
  async processarEvento(req: Request, res: Response): Promise<void> {
    try {
      const evento: EventoContabil = req.body;

      // Validação básica
      if (!evento.tipo) {
        res.status(400).json({ erro: 'Campo "tipo" é obrigatório' });
        return;
      }
      if (!evento.valor || evento.valor <= 0) {
        res.status(400).json({ erro: 'Campo "valor" deve ser um número positivo' });
        return;
      }
      if (!evento.descricao) {
        res.status(400).json({ erro: 'Campo "descricao" é obrigatório' });
        return;
      }

      // Garante que data seja um objeto Date
      if (evento.data) {
        evento.data = new Date(evento.data);
      } else {
        evento.data = new Date();
      }

      // Processa o evento
      const lancamento = motorLancamentos.processarEvento(evento);

      res.status(201).json({
        sucesso: true,
        mensagem: 'Lançamento criado com sucesso',
        lancamento
      });
    } catch (erro: any) {
      console.error('Erro ao processar evento:', erro);
      res.status(400).json({
        sucesso: false,
        erro: erro.message || 'Erro ao processar evento'
      });
    }
  }

  /**
   * POST /api/lancamentos/manual
   * Cria um lançamento manualmente
   */
  async criarLancamento(req: Request, res: Response): Promise<void> {
    try {
      const dto: CriarLancamentoDto = req.body;

      // Validação básica
      if (!dto.historico) {
        res.status(400).json({ erro: 'Campo "historico" é obrigatório' });
        return;
      }
      if (!dto.itens || dto.itens.length < 2) {
        res.status(400).json({ 
          erro: 'Deve haver pelo menos 2 itens (débito e crédito)' 
        });
        return;
      }

      // Garante que data seja um objeto Date se fornecida
      if (dto.data) {
        dto.data = new Date(dto.data);
      }

      const lancamento = motorLancamentos.criarLancamento(dto);

      res.status(201).json({
        sucesso: true,
        mensagem: 'Lançamento criado com sucesso',
        lancamento
      });
    } catch (erro: any) {
      console.error('Erro ao criar lançamento:', erro);
      res.status(400).json({
        sucesso: false,
        erro: erro.message || 'Erro ao criar lançamento'
      });
    }
  }

  /**
   * GET /api/lancamentos
   * Lista todos os lançamentos
   */
  async listarLancamentos(req: Request, res: Response): Promise<void> {
    try {
      const lancamentos = motorLancamentos.listarLancamentos();
      res.status(200).json({
        sucesso: true,
        total: lancamentos.length,
        lancamentos
      });
    } catch (erro: any) {
      console.error('Erro ao listar lançamentos:', erro);
      res.status(500).json({
        sucesso: false,
        erro: erro.message || 'Erro ao listar lançamentos'
      });
    }
  }

  /**
   * GET /api/lancamentos/:id
   * Obtém um lançamento específico
   */
  async obterLancamento(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const lancamento = motorLancamentos.obterLancamento(id);

      if (!lancamento) {
        res.status(404).json({
          sucesso: false,
          erro: 'Lançamento não encontrado'
        });
        return;
      }

      res.status(200).json({
        sucesso: true,
        lancamento
      });
    } catch (erro: any) {
      console.error('Erro ao obter lançamento:', erro);
      res.status(500).json({
        sucesso: false,
        erro: erro.message || 'Erro ao obter lançamento'
      });
    }
  }
}

export const lancamentosController = new LancamentosController();
