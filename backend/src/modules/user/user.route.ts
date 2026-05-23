import { Router } from 'express';
import { requireAuth } from '../../middlewares/authMiddleware.js';
import { validateResource } from '../../middlewares/validateResource.js';
import * as userController from './user.controller.js';
import { emailParamSchema } from './user.schema.js';

const router = Router();

router.use(requireAuth);

router.route('/')
  .get(userController.getAllUsers);

router.route('/email/:email')
  .get(validateResource(emailParamSchema), userController.getUserByEmail);

export default router;
