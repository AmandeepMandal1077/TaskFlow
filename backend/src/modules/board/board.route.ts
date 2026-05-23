import { Router } from 'express';
import { requireAuth } from '../../middlewares/authMiddleware.js';
import { validateResource } from '../../middlewares/validateResource.js';
import * as boardController from './board.controller.js';
import { createBoardSchema, updateBoardSchema, boardIdParamSchema } from './board.schema.js';

const router = Router();

router.use(requireAuth);

router.route('/')
  .get(boardController.getBoards)
  .post(validateResource(createBoardSchema), boardController.createBoard);

router.route('/:id')
  .get(validateResource(boardIdParamSchema), boardController.getBoard)
  .patch(validateResource(updateBoardSchema), boardController.updateBoard);

export default router;
