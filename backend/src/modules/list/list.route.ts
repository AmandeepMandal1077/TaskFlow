import { Router } from 'express';
import { requireAuth } from '../../middlewares/authMiddleware.js';
import { validateResource } from '../../middlewares/validateResource.js';
import * as listController from './list.controller.js';
import {
  listIdParamSchema,
  boardIdParamSchema,
  createListSchema,
  updateListSchema,
  reorderListsSchema,
} from './list.schema.js';

const router = Router();

router.use(requireAuth);

router.route('/')
  .post(validateResource(createListSchema), listController.createList);

router.route('/reorder')
  .patch(validateResource(reorderListsSchema), listController.reorderLists);

router.route('/board/:boardId')
  .get(validateResource(boardIdParamSchema), listController.getListsByBoard);

router.route('/:id')
  .patch(validateResource(updateListSchema), listController.updateList)
  .delete(validateResource(listIdParamSchema), listController.deleteList);

export default router;
