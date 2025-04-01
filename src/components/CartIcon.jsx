import useAuthStore from "@/store/auth-store";
import { ShoppingBasketIcon } from "lucide-react";
import React, { useState, useEffect } from "react";

function CartIcon() {
    const [itemCount, setItemCount] = useState(0); // State to track item count
    const user = useAuthStore(state => state.user)


  // Function to get cart from localStorage
  const getCart = () => {
    const cartData = JSON.parse(localStorage.getItem("cartData")) || {};
    return cartData[user ? user.id : "guest"] || []; // Return cart for logged-in user or guest
};

// Function to get the cart item count
const getCartItemCount = () => {
    const cart = getCart();
    console.log('Cart items: ', cart); // Debugging line to check cart items
    return cart.length;
};

// Update item count
const updateCartItemCount = () => {
    const count = getCartItemCount();
    setItemCount(count); // Update state with the new item count
};

// Update item count when component mounts
useEffect(() => {
    updateCartItemCount(); // Initial count on component mount
}, [user]); // Run on user change to handle cart updates after login

// Handle adding item to cart (this will update the localStorage and the item count)
const handleAddToCart = (item) => {
    const cartData = JSON.parse(localStorage.getItem("cartData")) || {};
    const userCart = cartData[user ? user.id : "guest"] || [];

    userCart.push(item); // Add new item to the cart
    cartData[user ? user.id : "guest"] = userCart; // Update localStorage

    localStorage.setItem("cartData", JSON.stringify(cartData)); // Save updated cart to localStorage

    updateCartItemCount(); // Update the item count immediately
};

return (
    <div className="relative">
        <ShoppingBasketIcon 
            className="cursor-pointer" 
            onClick={() => navigate('/cart')} 
        />
        {itemCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-sm">
                {itemCount}
            </span>
        )}
    </div>
);
}


export default CartIcon;