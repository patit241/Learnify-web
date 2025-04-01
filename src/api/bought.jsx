import useAuthStore from "@/store/auth-store";
import axios from "axios";

const token = useAuthStore.getState().token;

export async function fetchStudentBoughtCoursesService(studentId) {
    const { data } = await axios.get(`http://localhost:8000/student/courses-bought/get/${studentId}`,{
        headers: { Authorization: `Bearer ${token}` }
    });

    return data;
}