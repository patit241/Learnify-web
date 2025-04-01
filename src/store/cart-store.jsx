import {create} from 'zustand';


const useCartStore = create((set) => ({
    cart: JSON.parse(localStorage.getItem("cartData"))?.guest || [], // Initial state from localStorage (or guest cart)
    setCart: (newCart) => {
        localStorage.setItem("cartData", JSON.stringify({ guest: newCart })); // Update localStorage
        set({ cart: newCart }); // Update the state
    },
    addItemToCart: (item) => {
        set((state) => {
            const updatedCart = [...state.cart, item];
            localStorage.setItem("cartData", JSON.stringify({ guest: updatedCart })); // Update localStorage
            return { cart: updatedCart };
        });
    },
    // Additional cart management methods can go here, like removeItemFromCart
}));

export default useCartStore;
