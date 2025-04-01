
import useAuthStore from "@/store/auth-store";
import axios from "axios";


export async function getCurrentCourseProgressService(userId, courseId,token) {
    const { data } = await axios.get(
        `http://localhost:8000/student/course-progress/get/${userId}/${courseId}`,{
            headers: { Authorization: `Bearer ${token}` }
        });

    return data;
}

export async function markLectureAsViewedService(userId, courseId, lectureId,token) {
    const { data } = await axios.post(
        `http://localhost:8000/student/course-progress/mark-lecture-viewed`,
        {
            userId,
            courseId,
            lectureId,
        },{
            headers: { Authorization: `Bearer ${token}` }
        }
    );

    return data;
}

export async function resetCourseProgressService(userId, courseId,token) {
    const { data } = await axios.post(
        `http://localhost:8000/student/course-progress/reset-progress`,
        {
            userId,
            courseId,
        },{
            headers: { Authorization: `Bearer ${token}` }
        }
    );

    return data;
}