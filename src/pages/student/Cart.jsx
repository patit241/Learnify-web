import { createPaymentService } from '@/api/order';
import useAuthStore from '@/store/auth-store';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Cart() {

    const [cart, setCart] = useState([]);
    const user = useAuthStore(state => state.user);
    const navigate = useNavigate()
    const token = useAuthStore(state=>state.token)

    // Create Payment Service function (you may already have this in your code)
    async function createPayment(items) {
        if (user) {
            const updatedItems = items.map(item => ({
                courseId: item.courseId,          // Map courseId to course_id
                courseTitle: item.title,          // Map title to course_title
                courseImage: item.image,          // Map image to course_image
                instructorName: item.instructor, // Map instructor to instructor_name
                coursePricing: item.price,
                instructorId: item.id
            }));
            const paymentPayload = {
                userId: user.id,
                orderStatus: "pending",
                paymentMethod: "paypal",
                paymentStatus: "initiated",
                orderDate: new Date(),
                paymentId: "",
                payerId: "",
                items: updatedItems
            };

            console.log(paymentPayload)
            // Send payment details to the backend (your service function)
            const response = await createPaymentService(paymentPayload,token);

            if (response.success) {
                sessionStorage.setItem("currentOrderId", JSON.stringify(response?.data?.orderId));
                alert("Checkout successful! Proceed to payment.");
                window.location.href = response?.data?.approveUrl;
            } else {
                alert("Payment creation failed.");
            }
        } else {
            alert('Please login ')
            localStorage.setItem('lastVisitedPage', window.location.pathname);
            navigate('/auth')
        }
    }

    function getCart() {
        const cartData = JSON.parse(localStorage.getItem("cartData")) || {};
        return cartData[user ? user.id : "guest"] || [];
    }

    // Update localStorage after changes
    function updateCartData(updatedCart) {
        const cartData = JSON.parse(localStorage.getItem("cartData")) || {};
        cartData[user ? user.id : "guest"] = updatedCart;
        localStorage.setItem("cartData", JSON.stringify(cartData));
    }

    // Handle removing an item from the cart
    function removeFromCart(index) {
        const updatedCart = cart.filter((item, i) => i !== index);
        setCart(updatedCart);
        updateCartData(updatedCart);
    }

    // Calculate the total price of the cart
    function getTotalPrice() {
        return cart.reduce((total, item) => total + item.price, 0).toFixed(2);
    }

    // Handle checkout (creating payment and clearing the cart)
    async function handleCheckout() {
        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        // Create payment with all the items in the cart
        await createPayment(cart);

    }

    useEffect(() => {
        setCart(getCart());
    }, [user]); // Re-run when user changes

    return (
        <div className="flex justify-center gap-9 p-6 space-x-6">
            {/* Left side: Cart Items */}
            <div className="w-2/3 max-w-[800px]  p-4 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
                {cart.length > 0 ? (
                    <ul className="space-y-4">
                        {cart.map((item, index) => (
                            <li key={index} className="flex items-center space-x-4 border-b pb-4">
                                <img src={item.image} alt={item.title} width="100" className="rounded-lg" />
                                <div className="flex-1">
                                    <p className="font-semibold">{item.title}</p>
                                    <p className="text-sm text-gray-500">Instructor: {item.instructor}</p>
                                    <p className="font-medium text-gray-700">Price: ${item.price}</p>
                                </div>
                                <button
                                    onClick={() => removeFromCart(index)}
                                    className="bg-red-500 text-white p-2 rounded hover:bg-red-400 "
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Your cart is empty.</p>
                )}
            </div>

            {/* Right side: Checkout */}
            <div className="w-1/3 max-w-[300px] borde pt-2 p-4 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">Checkout</h2>
                <div className="space-y-4">
                    <p className="font-medium text-lg">Total Price: <span className="text-2xl">${getTotalPrice()}</span></p>
                    <button
                        onClick={handleCheckout}
                        className="w-full bg-slate-700 text-white p-3 rounded-lg font-semibold hover:bg-slate-600"
                    >
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    );
}


export default Cart