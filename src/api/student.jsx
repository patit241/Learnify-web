import axios from "axios";



export async function fetchStudentViewCourseListService(query) {
    const { data } = await axios.get(`http://localhost:8000/student/course/get?${query}`);

    return data;
}



export async function fetchStudentViewCourseDetailsService(courseId) {
    const { data } = await axios.get(`http://localhost:8000/student/course/get/details/${courseId}`);
    return data;
}

export async function checkCoursePurchaseInfoService(courseId, studentId) {
    const { data } = await axios.get(`http://localhost:8000/student/course/purchase-info/${courseId}/${studentId}`);
    return data;
}


export async function fetchSuggestCourseService( studentId) {
    const { data } = await axios.get(`http://localhost:8000/student/course/suggest-course/${studentId}`);
    return data;
}

