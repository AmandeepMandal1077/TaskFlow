import { Router } from 'express';
import { requireAuth } from '../../middlewares/authMiddleware.js';
import { validateResource } from '../../middlewares/validateResource.js';
import * as labelController from './label.controller.js';
import { createLabelSchema } from './label.schema.js';

const router = Router();

router.use(requireAuth);

router.route('/')
  .get(labelController.getAllLabels)
  .post(validateResource(createLabelSchema), labelController.createLabel);

export default router;
