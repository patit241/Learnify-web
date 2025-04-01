import { fetchStudentBoughtCoursesService } from "@/api/bought";
import useAuthStore from "@/store/auth-store";


export async function mergeGuestCart(userId) {

    // const token = useAuthStore(state=>state.token)
    let cartData = JSON.parse(localStorage.getItem("cartData")) || {};

    if (cartData["guest"] && cartData["guest"].length > 0) {
        if (!cartData[userId]) {
            cartData[userId] = [];
        }

        // Fetch the user's purchased courses from the database
        const purchasedCourses = await fetchStudentBoughtCoursesService(userId);
        console.log(purchasedCourses)
        const purchasedCourseIds = new Set(purchasedCourses.data.map(course => course.id)); // Ensure ID matches backend

        // Merge guest cart into user cart, filtering out already purchased courses
        const userCartCourseIds = new Set(cartData[userId].map(item => item.courseId));
        cartData["guest"].forEach(course => {
            if (!userCartCourseIds.has(course.courseId) && !purchasedCourseIds.has(course.courseId)) {
                cartData[userId].push(course);
            }
        });

        delete cartData["guest"]; // Clear guest cart after merging
        localStorage.setItem("cartData", JSON.stringify(cartData));
    }
}
