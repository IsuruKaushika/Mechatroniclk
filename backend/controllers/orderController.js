import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import dotenv from 'dotenv';
import crypto from 'crypto';
import { sendOrderConfirmationEmail } from "../config/email.js";

// Load environment variables
dotenv.config();



const placeOrder = async(req, res) => {
    try {
        const {userId, items, amount, address} = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
            
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId, {cartData: {}})
        if (address?.email) {
        try {
            await sendOrderConfirmationEmail({
            to: address.email,
            orderId: newOrder._id,
            items,
            amount,
            address,
            paymentMethod: orderData.paymentMethod,
            });
        } catch (emailErr) {
            console.error("Failed to send order confirmation email:", emailErr.message);
        }
        }
        res.json({success: true, message: "Order Placed Successfully"})
    } catch(error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}



// All Orders Data from Admin Panel
const allOrders = async(req, res) => {
    try {
        const orders = await orderModel.find({})
        res.json({success: true, orders})
    } catch(error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

// User ordered data for frontend
const userOrders = async(req, res) => {
    try {
        const {userId} = req.body;
        const orders = await orderModel.find({userId})
        res.json({success: true, orders})
    } catch(error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

// Update order status from admin
const updateStatus = async(req, res) => {
    try {
        const {orderId, status} = req.body;
        await orderModel.findByIdAndUpdate(orderId, {status})
        res.json({success: true, message: "Order Status Updated Successfully"})
    } catch(error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

// Delete order from admin
const deleteOrder = async(req, res) => {
    try {
        const {orderId} = req.body;
        
        // Check if order exists
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.json({success: false, message: "Order not found"});
        }
        
        // Delete the order
        await orderModel.findByIdAndDelete(orderId);
        
        res.json({success: true, message: "Order deleted successfully"});
    } catch(error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
}

export {
    placeOrder, 
    userOrders, 
    updateStatus, 
    allOrders, 
    deleteOrder
}