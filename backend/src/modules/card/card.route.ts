import { Router } from 'express';
import { requireAuth } from '../../middlewares/authMiddleware.js';
import { validateResource } from '../../middlewares/validateResource.js';
import * as cardController from './card.controller.js';
import {
  boardIdParamSchema,
  cardIdParamSchema,
  createCardSchema,
  updateCardSchema,
  moveCardSchema,
  reorderCardsSchema,
  cardLabelSchema,
  deleteCardLabelSchema,
  cardAssigneeSchema,
  deleteCardAssigneeSchema,
  createChecklistSchema,
  idParamSchema,
  createChecklistItemSchema,
  toggleChecklistItemSchema,
} from './card.schema.js';

const router = Router();

router.use(requireAuth);

router.route('/')
  .post(validateResource(createCardSchema), cardController.createCard);

router.route('/reorder')
  .patch(validateResource(reorderCardsSchema), cardController.reorderCards);

router.route('/board/:boardId')
  .get(validateResource(boardIdParamSchema), cardController.getCardsByBoard);

router.route('/:id')
  .get(validateResource(cardIdParamSchema), cardController.getCardById)
  .patch(validateResource(updateCardSchema), cardController.updateCard)
  .delete(validateResource(cardIdParamSchema), cardController.deleteCard);

router.route('/:id/move')
  .patch(validateResource(moveCardSchema), cardController.moveCard);

// Relations
router.route('/:id/labels')
  .post(validateResource(cardLabelSchema), cardController.addLabelToCard);
router.route('/:id/labels/:labelId')
  .delete(validateResource(deleteCardLabelSchema), cardController.removeLabelFromCard);

router.route('/:id/assignees')
  .post(validateResource(cardAssigneeSchema), cardController.addAssigneeToCard);
router.route('/:id/assignees/:userId')
  .delete(validateResource(deleteCardAssigneeSchema), cardController.removeAssigneeFromCard);

// Checklists
router.route('/:id/checklists')
  .post(validateResource(createChecklistSchema), cardController.createChecklist);

router.route('/checklists/:id')
  .delete(validateResource(idParamSchema), cardController.deleteChecklist);

router.route('/checklists/:id/items')
  .post(validateResource(createChecklistItemSchema), cardController.createChecklistItem);

router.route('/checklists/items/:id')
  .patch(validateResource(toggleChecklistItemSchema), cardController.toggleChecklistItem)
  .delete(validateResource(idParamSchema), cardController.deleteChecklistItem);

export default router;
