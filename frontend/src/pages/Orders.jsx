import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = () => {
	const { backendUrl, token, currency } = useContext(ShopContext);
	const [orderData, setOrderData] = useState([]);

	// Load the order data from the backend
	const loadOrderData = async () => {
		try {
			if (!token) {
				return null;
			}

			const response = await axios.post(backendUrl + "/api/order/userorders", {}, { headers: { token } });
			if (response.data.success) {
				let allOrders = [];
				response.data.orders.forEach((order) => {
					let orderItems = order.items.map((item) => ({
						...item,
						status: order.status,
						payment: order.payment,
						paymentMethod: order.paymentMethod,
						date: order.date,
					}));
					allOrders.push({
						orderId: order._id,
						items: orderItems,
						status: order.status,
						paymentMethod: order.paymentMethod,
						date: order.date,
						totalAmount: orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
					});
				});
				setOrderData(allOrders.reverse()); // Reverse the orders to show the most recent first
			}
		} catch (error) {
			console.log(error);
			toast.error("Failed to fetch orders");
		}
	};

	useEffect(() => {
		loadOrderData();
	}, [token]);

	return (
		<div className="border-t pt-16">
			<div className="text-2xl">
				<Title text1={"YOUR"} text2={"ORDERS"} />
			</div>

			<div>
				{orderData.map((order, index) => (
					<div key={index} className="py-4 border-t border-b text-gray-700">
						<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
							{/* Order Information */}
							<div className="flex flex-col md:w-1/2">
								<div className="flex items-center gap-3 mb-4">
									<p className="text-lg font-semibold">Order ID : {order.orderId}</p>
									<p className="text-sm text-gray-500">{new Date(order.date).toDateString()}</p>
								</div>
								<div className="flex items-center gap-3 text-base text-gray-700">
									<p className="text-lg">Payment: {order.paymentMethod}</p>
									<p>
										Total: {currency}
										{order.totalAmount.toFixed(2)}
									</p>
								</div>
							</div>

							{/* Order Status */}
							<div className="md:w-1/4 flex items-center gap-2">
								<p className="min-w-2 h-2 rounded-full bg-green-500"></p>
								<p className="text-sm md:text-base">{order.status}</p>
							</div>
						</div>

						{/* Order Items */}
						<div className="mt-6">
							{order.items.map((item, idx) => (
								<div key={idx} className="flex flex-col md:flex-row md:items-center gap-4 py-4 border-t">
									<div className="flex items-start gap-6 text-sm">
										<img className="w-16 sm:w-20" src={item.image[0]} alt="" />
										<div>
											<p className="sm:text-base font-medium">{item.name}</p>
											<div className="flex items-center gap-3 mt-1 text-base text-gray-700">
												<p className="text-lg">
													{currency}
													{item.price}
												</p>
												<p>Quantity: {item.quantity}</p>
												<p>Size: {item.size}</p>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>

						{/* Track Order Button */}
						<div className="flex justify-end mt-4">
							<button onClick={loadOrderData} className="border px-4 py-2 text-sm font-medium rounded-sm">
								Track Order
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Orders;
