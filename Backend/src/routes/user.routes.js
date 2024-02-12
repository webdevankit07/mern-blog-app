import { Router } from 'express';
import { deleteUser, getUsers, logoutUser, updateUser } from '../controllers/user.controller.js';
import verifyToken from '../middlewares/auth.middleware.js';

const router = new Router();

// Routes....*:
router.route('/update/:userId').put(verifyToken, updateUser);
router.route('/delete/:userId').delete(verifyToken, deleteUser);
router.route('/logout/:userId').post(verifyToken, logoutUser);
router.route('/getusers').get(verifyToken, getUsers);

export { router as userRoutes };
