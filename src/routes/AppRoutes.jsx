import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from '../layouts/Layout'
import InstructorPage from '@/pages/instructor/InstructorPage'
import StudentHomePage from '@/pages/student/StudentHomePage'
import StudentViewCoursesPage from '@/pages/student/StudentViewCoursesPage'
import StudentBoughtCoursesPage from '@/pages/student/StudentBoughtCoursesPage'
import AuthPage from '@/pages/auth/AuthPage'
import ProtectRoute from './ProtectRoute'
import CourseCurriculum from '@/components/instructor-view/courses/manage-course/CourseCurriculum'
import AddNewCoursePage from '@/pages/instructor/AddNewCoursePage'
import StudentViewCourseDetailPage from '@/pages/student/StudentViewCourseDetailPage'
import PaypalPaymentReturnPage from '@/pages/student/PaypalPaymentReturnPage'
import StudentViewCourseProgressPage from '@/pages/student/StudentCourseProgressPage'
import NotFound from '@/pages/NotFound'
import Cart from '@/pages/student/Cart'
import AddNewCoursePage2 from '@/pages/instructor/AddNewCoursePage2'
import EditCoursePage from '@/pages/instructor/EditCoursePage'


function AppRoutes() {
    return (<>
        <Routes>
            {/* Public */}
            <Route path='auth' element={<AuthPage />} />
            <Route path="/" element={<Layout />} >
                <Route index element={<StudentHomePage />} />
                <Route path="courses" element={<StudentViewCoursesPage />} />
                <Route path="course/details/:id" element={<StudentViewCourseDetailPage />} />
                <Route path="cart" element={<Cart />} />
            </Route>


            {/* Private [STUDENT] */}
            <Route path="student" element={<ProtectRoute el={<Layout />} allows={['STUDENT']} />}>
                <Route path="student-courses" element={<StudentBoughtCoursesPage />} />
                <Route path="payment-return" element={<PaypalPaymentReturnPage />} />
                <Route path="course-progress/:id" element={<StudentViewCourseProgressPage />} />
            </Route>


            {/* Private [INSTRUCTOR] */}
            <Route path="/instructor" element={<ProtectRoute el={<InstructorPage />} allows={['INSTRUCTOR']} />} />
            <Route path="/instructor/create-new-course" element={<ProtectRoute el={<AddNewCoursePage2 />} allows={['INSTRUCTOR']} />} />
            <Route path="/instructor/edit-course/:courseId" element={<ProtectRoute el={<EditCoursePage />} allows={['INSTRUCTOR']} />} />



            <Route path="*" element={<NotFound />} />

        </Routes>

    </>
    )
}

export default AppRoutes