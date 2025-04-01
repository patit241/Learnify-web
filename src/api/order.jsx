import useAuthStore from "@/store/auth-store";
import axios from "axios";

const token = useAuthStore.getState().token;

export async function createPaymentService(formData,token) {
    const { data } = await axios.post(`http://localhost:8000/student/order/create`, formData,{
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
}

export async function captureAndFinalizePaymentService(paymentId, payerId, orderId) {
    const { data } = await axios.post(`http://localhost:8000/student/order/capture`, {
        paymentId, payerId, orderId
    },{
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
}