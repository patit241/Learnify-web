import useAuthStore from "@/store/auth-store";
import axios from "axios";



export async function fetchInstructorCourseListService(instructorId,token) {
    const { data } = await axios.get(`http://localhost:8000/instructor/course/get/${instructorId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
}

export async function addNewCourseService(formData,token) {
    const { data } = await axios.post(`http://localhost:8000/instructor/course/add`, formData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
}

export async function CreateCourseService(formData,token) {
    const { data } = await axios.post(`http://localhost:8000/instructor/course/add`, formData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
}

export async function fetchInstructorCourseDetailsService(instructorId,courseId,token) {
    const { data } = await axios.get(`http://localhost:8000/instructor/course/get/details/${instructorId}/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
}

export async function updateCourseByIdService(instructorId,courseId, formData,token) {
    const { data } = await axios.put(`http://localhost:8000/instructor/course/update/${instructorId}/${courseId}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
}

export async function deleteCourseByIdService(instructorId,courseId,token) {
    const { data } = await axios.delete(`http://localhost:8000/instructor/course/delete/${instructorId}/${courseId}`,{
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
}
