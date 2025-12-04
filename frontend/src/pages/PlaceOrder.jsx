import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";

import { validatePlaceOrderForm } from "../utils/validatePlaceOrderForm";

const PlaceOrder = () => {
	const [method, setMethod] = useState("cod");
	const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } =
		useContext(ShopContext);

	const [isSubmitting, setIsSubmitting] = useState(false);

	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		street: "",
		city: "",
		state: "",
		zipcode: "",
		country: "",
		phone: "",
	});

	const [errors, setErrors] = useState({});

	const onChangeHandler = (event) => {
		setFormData({ ...formData, [event.target.name]: event.target.value });
	};

	const onSubmitHandler = async (event) => {
		event.preventDefault();

		if (isSubmitting) return;

		const { isValid, errors: validationErrors } = await validatePlaceOrderForm(formData);

		if (!isValid) {
			setErrors(validationErrors);
			toast.error("Please fix the highlighted fields.");
			return;
		}

		setErrors({});
		setIsSubmitting(true);

		try {
			let orderItems = [];

			for (const productId in cartItems) {
				for (const size in cartItems[productId]) {
					if (cartItems[productId][size] > 0) {
						const info = structuredClone(products.find((p) => p._id === productId));
						info.size = size;
						info.quantity = cartItems[productId][size];
						orderItems.push(info);
					}
				}
			}

			const orderData = {
				userId: localStorage.getItem("userId"),
				address: formData,
				items: orderItems,
				amount: getCartAmount() + delivery_fee,
				payment_method: method,
			};

			// COD ORDER
			if (method === "cod") {
				const response = await axios.post(backendUrl + "/api/order/place", orderData, { headers: { token } });

				if (response.data.success) {
					toast.success("Order placed successfully!");
					setCartItems({});
					navigate("/orders");
				} else {
					toast.error(response.data.message);
				}
			}
		} catch (error) {
			console.log(error);
			toast.error("Something went wrong.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form
			onSubmit={onSubmitHandler}
			className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] px-4"
		>
			{/* LEFT SIDE */}
			<div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
				<Title text1="DELIVERY" text2="INFORMATION" />

				{/* FIRST + LAST NAME */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<div>
						<input
							name="firstName"
							value={formData.firstName}
							onChange={onChangeHandler}
							className={`border p-2 rounded w-full ${errors.firstName ? "border-red-500" : ""}`}
							placeholder="First name"
						/>
						{errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
					</div>

					<div>
						<input
							name="lastName"
							value={formData.lastName}
							onChange={onChangeHandler}
							className={`border p-2 rounded w-full ${errors.lastName ? "border-red-500" : ""}`}
							placeholder="Last name"
						/>
						{errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
					</div>
				</div>

				{/* EMAIL */}
				<div>
					<input
						name="email"
						value={formData.email}
						onChange={onChangeHandler}
						className={`border p-2 rounded w-full ${errors.email ? "border-red-500" : ""}`}
						placeholder="Email"
					/>
					{errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
				</div>

				{/* STREET */}
				<div>
					<input
						name="street"
						value={formData.street}
						onChange={onChangeHandler}
						className={`border p-2 rounded w-full ${errors.street ? "border-red-500" : ""}`}
						placeholder="Street"
					/>
					{errors.street && <p className="text-red-500 text-xs">{errors.street}</p>}
				</div>

				{/* CITY + STATE */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<div>
						<input
							name="city"
							value={formData.city}
							onChange={onChangeHandler}
							className={`border p-2 rounded w-full ${errors.city ? "border-red-500" : ""}`}
							placeholder="City"
						/>
						{errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
					</div>

					<div>
						<input
							name="state"
							value={formData.state}
							onChange={onChangeHandler}
							className={`border p-2 rounded w-full ${errors.state ? "border-red-500" : ""}`}
							placeholder="State"
						/>
						{errors.state && <p className="text-red-500 text-xs">{errors.state}</p>}
					</div>
				</div>

				{/* ZIP + COUNTRY */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<div>
						<input
							name="zipcode"
							value={formData.zipcode}
							onChange={onChangeHandler}
							className={`border p-2 rounded w-full ${errors.zipcode ? "border-red-500" : ""}`}
							placeholder="Zip code"
						/>
						{errors.zipcode && <p className="text-red-500 text-xs">{errors.zipcode}</p>}
					</div>

					<div>
						<input
							name="country"
							value={formData.country}
							onChange={onChangeHandler}
							className={`border p-2 rounded w-full ${errors.country ? "border-red-500" : ""}`}
							placeholder="Country"
						/>
						{errors.country && <p className="text-red-500 text-xs">{errors.country}</p>}
					</div>
				</div>

				{/* PHONE */}
				<div>
					<input
						name="phone"
						value={formData.phone}
						onChange={onChangeHandler}
						className={`border p-2 rounded w-full ${errors.phone ? "border-red-500" : ""}`}
						placeholder="Phone"
					/>
					{errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
				</div>
			</div>

			{/* RIGHT SIDE */}
			<div className="mt-8 w-full sm:max-w-[480px]">
				<CartTotal />

				<div className="mt-16">
					<Title text1="PAYMENT" text2="METHOD" />

					<div
						onClick={() => setMethod("cod")}
						className={`flex items-center gap-3 border p-2 cursor-pointer mt-0.5 ${
							method === "cod" ? "border-green-500" : "border-gray-300"
						}`}
					>
						<p className={`w-3.5 h-3.5 rounded-full ${method === "cod" ? "bg-green-500" : "bg-gray-300"}`} />
						<p className="text-gray-600 text-sm">CASH ON DELIVERY</p>
					</div>
				</div>

				<button
					disabled={isSubmitting || getCartAmount() === 0}
					className={`w-full mt-6 py-3 rounded-md text-white text-lg disabled:cursor-not-allowed disabled:bg-gray-500 ${
						isSubmitting ? "bg-gray-500" : "bg-black hover:bg-gray-800"
					}`}
				>
					{isSubmitting ? "Processing..." : "Place Order"}
				</button>
			</div>
		</form>
	);
};

export default PlaceOrder;
