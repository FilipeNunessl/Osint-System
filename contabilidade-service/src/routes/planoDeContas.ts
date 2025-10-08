import { Router } from 'express';
import { planoDeContasController } from '../controllers/PlanoDeContasController';

const router = Router();

/**
 * GET /api/plano-de-contas
 * Lista todas as contas
 */
router.get('/', (req, res) => planoDeContasController.listarContas(req, res));

/**
 * GET /api/plano-de-contas/:id
 * Obtém uma conta específica
 */
router.get('/:id', (req, res) => planoDeContasController.obterConta(req, res));

/**
 * POST /api/plano-de-contas
 * Cria uma nova conta
 */
router.post('/', (req, res) => planoDeContasController.criarConta(req, res));

export default router;
