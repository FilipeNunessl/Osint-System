import { Router } from 'express';
import { lancamentosController } from '../controllers/LancamentosController';

const router = Router();

/**
 * POST /api/lancamentos
 * Processa um evento e cria o lançamento contábil
 */
router.post('/', (req, res) => lancamentosController.processarEvento(req, res));

/**
 * POST /api/lancamentos/manual
 * Cria um lançamento manualmente
 */
router.post('/manual', (req, res) => lancamentosController.criarLancamento(req, res));

/**
 * GET /api/lancamentos
 * Lista todos os lançamentos
 */
router.get('/', (req, res) => lancamentosController.listarLancamentos(req, res));

/**
 * GET /api/lancamentos/:id
 * Obtém um lançamento específico
 */
router.get('/:id', (req, res) => lancamentosController.obterLancamento(req, res));

export default router;
