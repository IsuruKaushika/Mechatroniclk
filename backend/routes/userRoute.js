import express  from 'express';
import { loginUser,registerUser,adminLogin,resetPassword,listUsers } from '../controllers/userController.js';
import adminAuth from '../middleware/adminAuth.js';

const userRouter =express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)

userRouter.post('/reset-password', resetPassword);
userRouter.get('/list', adminAuth, listUsers);
export default userRouter;
