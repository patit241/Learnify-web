import useAuthStore from "@/store/auth-store";
import axios from "axios";

const token = useAuthStore.getState().token;

export async function mediaUploadService(formData, onProgressCallback) {
    const { data } = await axios.post("http://localhost:8000/media/upload", formData, {
        headers: { Authorization: `Bearer ${token}` },
        onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgressCallback(percentCompleted);
        },
    });
    return data;
}

export async function mediaDeleteService(id) {
    const { data } = await axios.delete(`http://localhost:8000/media/delete/${id}`,{
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
}