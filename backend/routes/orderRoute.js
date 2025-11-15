import express from 'express';
import {
  placeOrder,
  userOrders,
  updateStatus,
  allOrders,
  deleteOrder
} from '../controllers/orderController.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const orderRouter = express.Router();

//for admin
orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);

//payment
orderRouter.post('/place', authUser, placeOrder);

  
//User Feature
orderRouter.post('/userorders', authUser, userOrders);
orderRouter.post('/delete', adminAuth, deleteOrder)

export default orderRouter;