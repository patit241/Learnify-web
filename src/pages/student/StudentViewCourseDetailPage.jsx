import { createPaymentService } from '@/api/order';
import { checkCoursePurchaseInfoService, fetchStudentViewCourseDetailsService, fetchStudentViewCourseListService, fetchSuggestCourseService } from '@/api/student';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import VideoPlayer from '@/components/VideoPlayer';
import studentContext from '@/context/student-context/studentContext';
import useAuthStore from '@/store/auth-store';
import { CheckCircle, Globe, Lock, PlayCircle } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';

function StudentViewCourseDetailPage() {

    const {
        studentViewCourseDetails, setStudentViewCourseDetails,
        currentCourseDetailsId, setCurrentCourseDetailsId,
        loadingState, setLoadingState
    } = useContext(studentContext)
    const [approvalUrl, setApprovalUrl] = useState("");
    const user = useAuthStore(state => state.user)
    const navigate = useNavigate()
    const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview]
        = useState(null)
    const [showFreePreviewDialog, setShowFreePreviewDialog]
        = useState(false)
    const { id } = useParams()
    const location = useLocation()
    const [courseList, setCourseList] = useState([])
    const token = useAuthStore(state=>state.token)

    async function fetchStudentViewCourseDetails() {

        if (user) {
            const checkCoursePurchaseInfoResponse = await checkCoursePurchaseInfoService(currentCourseDetailsId, user.id)
            // console.log(checkCoursePurchaseInfoResponse,"CHeckasdsadasdasdsadasdas")
            if (checkCoursePurchaseInfoResponse?.success && checkCoursePurchaseInfoResponse?.data) {
                navigate(`/student/course-progress/${currentCourseDetailsId}`)
                return
            }
        }
        const response = await fetchStudentViewCourseDetailsService(currentCourseDetailsId)
        console.log(response.data)
        if (response.success) {
            setStudentViewCourseDetails(response.data)
            console.log("Updated Course Details:", studentViewCourseDetails);
            setLoadingState(false)
        } else {
            setStudentViewCourseDetails(null)
            setLoadingState(false)
        }
    }




    function handleSetFreePreview(getCurrentVideoInfo) {
        console.log(getCurrentVideoInfo);
        setDisplayCurrentVideoFreePreview(getCurrentVideoInfo?.videoUrl);
        setShowFreePreviewDialog(true); // Open dialog when a video is selected
    }

    async function handleCreatePayment() {
        if (user) {
            console.log(studentViewCourseDetails)

            // Adjusted to send an array of order items
            const paymentPayload = {
                userId: user.id,
                orderStatus: "pending",
                paymentMethod: "paypal",
                paymentStatus: "initiated",
                orderDate: new Date(),
                paymentId: "",
                payerId: "",
                items: [
                    {
                        courseId: studentViewCourseDetails?.courseId,
                        courseTitle: studentViewCourseDetails?.title,
                        courseImage: studentViewCourseDetails?.image,
                        instructorId: studentViewCourseDetails?.instructorId,
                        instructorName: studentViewCourseDetails?.instructorName,
                        coursePricing: studentViewCourseDetails?.pricing
                    }
                ]
            };

            console.log(paymentPayload, "payment");

            // Send the updated payload to the backend
            const response = await createPaymentService(paymentPayload,token);

            if (response.success) {
                // Remove the item from the cart if it's there (because it's already purchased)
                if (isCourseInCart()) {
                    removeFromCart();
                }

                sessionStorage.setItem(
                    "currentOrderId",
                    JSON.stringify(response?.data?.orderId)
                );
                setApprovalUrl(response?.data?.approveUrl);
            }
        } else {
            alert('Please login ')
            localStorage.setItem('lastVisitedPage', window.location.pathname);
            navigate('/auth')
        }
    }







    async function fetchSuggestCourse() {
      if(user){
        const response = await fetchSuggestCourseService(user?.id)
        console.log(response)
        if (response?.success) {
            const list = response?.data.filter((el) => el.id !== studentViewCourseDetails?.courseId)
            setCourseList(list)
        }
    } else {
        const response = await fetchStudentViewCourseListService()
        console.log(response)
        if (response?.success) {
            const list = response?.data.filter((el) => el.id !== studentViewCourseDetails?.courseId)
            setCourseList(list)
        }
    }

    }

    async function handleCourseNavigate(getCurrentCourseId) {
        if (user) {
            const response = await checkCoursePurchaseInfoService(getCurrentCourseId, user.id)
            console.log(response)
            if (response?.success) {
                if (response?.data) {
                    navigate(`/student/course-progress/${getCurrentCourseId}`)
                } else {
                    navigate(`/course/details/${getCurrentCourseId}`)
                }
            }
        } else {
            navigate(`/course/details/${getCurrentCourseId}`)
        }
    }



    const [cartData, setCartData] = useState(() => {
        return JSON.parse(localStorage.getItem("cartData")) || {};
    });

    // Add course to cart
    function addToCart() {
        let updatedCartData = { ...cartData };
        let cartKey = user ? user.id : "guest";

        if (!updatedCartData[cartKey]) {
            updatedCartData[cartKey] = [];
        }

        const course = {
            courseId: studentViewCourseDetails?.courseId,
            title: studentViewCourseDetails?.title,
            image: studentViewCourseDetails?.image,
            instructor: studentViewCourseDetails?.instructorName,
            price: studentViewCourseDetails?.pricing,
            id: studentViewCourseDetails?.instructorId
        };

        const existingIndex = updatedCartData[cartKey].findIndex(item => item.courseId === course.courseId);

        if (existingIndex === -1) {
            updatedCartData[cartKey].push(course);
            localStorage.setItem("cartData", JSON.stringify(updatedCartData));
            setCartData(updatedCartData);  // Update state
            alert("Course added to cart!");
        } else {
            alert("Course is already in the cart!");
        }
    }

    // Remove course from cart
    function removeFromCart() {
        let updatedCartData = { ...cartData };
        let cartKey = user ? user.id : "guest";

        if (updatedCartData[cartKey]) {
            const updatedCart = updatedCartData[cartKey].filter(item => item.courseId !== studentViewCourseDetails?.courseId);
            updatedCartData[cartKey] = updatedCart;
            localStorage.setItem("cartData", JSON.stringify(updatedCartData));
            setCartData(updatedCartData);  // Update state
        }
    }

    // Check if course is in the cart
    const isCourseInCart = () => {
        let cartKey = user ? user.id : "guest";
        return cartData[cartKey]?.some(item => item.courseId === studentViewCourseDetails?.courseId);
    };



    useEffect(() => {
        if (studentViewCourseDetails?.category) {
            fetchSuggestCourse();
        }
    }, [studentViewCourseDetails])


    useEffect(() => {
        if (currentCourseDetailsId !== null) {
            fetchStudentViewCourseDetails()
        }
    }, [currentCourseDetailsId])

    useEffect(() => {
        if (id) { setCurrentCourseDetailsId(id) }
    }, [id])

    useEffect(() => {
        if (!location.pathname.includes('course/details')) {
            setStudentViewCourseDetails(null), setCurrentCourseDetailsId(null)
        }
    }, [location.pathname])

    if (loadingState) return <Skeleton />


    if (approvalUrl !== "") {
        window.location.href = approvalUrl;
    }


    const getIndexOfFreePreviewUrl = studentViewCourseDetails !== null ?
        studentViewCourseDetails?.lectures?.findIndex(item => item.freePreview)
        : -1




    return <div className='container mx-auto p-4' >
        <div className='bg-gray-900 text-white p-8 rounded-t-lg ' >
            <h1 className='text-3xl font-bold mb-4 ' >{studentViewCourseDetails?.title}</h1>
            <p className='text-xl mb-4 ' > {studentViewCourseDetails?.subtitle} </p>
            <div className='flex items-center space-x-4 mt-2 text-sm ' >
                <span> Created By {studentViewCourseDetails?.instructorName} </span>
                <span> Created On {studentViewCourseDetails?.date.split('T')[0]} </span>
                <span className='flex items-center ' >
                    <Globe className='mr-1 h-4 w-4' />
                    {studentViewCourseDetails?.primaryLanguage}
                </span>
                <span>
                    {studentViewCourseDetails?.students.length} {" "}
                    {studentViewCourseDetails?.students.length <= 1 ? 'Student' : 'Students'}
                </span>
            </div>
        </div>
        <div className='flex flex-col md:flex-row gap-8 mt-8' >
            <main className='flex-grow' >
                <Card className='mb-8' >
                    <CardHeader>
                        <CardTitle>What you'll Learn</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className='grid grid-cols-1 md:grid-cols-2 gap-2' >
                            {
                                studentViewCourseDetails?.objectives.split(',').map((objective, index) => (
                                    <li key={index} className='flex items-start ' >
                                        <CheckCircle className='mr-2 h-5 w-5 text-green-500 flex-shrink-0 ' />
                                        <span> {objective} </span>
                                    </li>
                                ))
                            }
                        </ul>
                    </CardContent>
                </Card>
                <Card className='mb-8' >
                    <CardHeader>
                        <CardTitle>Course Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {studentViewCourseDetails?.description}
                    </CardContent>
                </Card>
                <Card className='mb-8  ' >
                    <CardHeader>
                        <CardTitle>Course Curriculum</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {
                            studentViewCourseDetails?.lectures?.map((curriculumItem, index) => (
                                <li className={`${curriculumItem?.freePreview ? 'cursor-pointer'
                                    : 'cursor-not-allowed'} flex items-center mb-4`}
                                    onClick={curriculumItem?.freePreview
                                        ? () => handleSetFreePreview(curriculumItem)
                                        : null}
                                >
                                    {
                                        curriculumItem?.freePreview ?
                                            <PlayCircle className='mr-2 h-4 w-4' /> : <Lock className='mr-2 h-4 w-4' />
                                    }
                                    <span> {curriculumItem?.title} </span>
                                </li>
                            ))
                        }
                    </CardContent>
                </Card>
            </main>
            <aside className='w-full md:w-[500px]  ' >
                <Card className="sticky top-4" >
                    <CardContent className='p-6' >
                        <div className='aspect-video mb-4 rounded-lg flex items-center justify-center ' >
                            <VideoPlayer
                                url={
                                    getIndexOfFreePreviewUrl !== -1 ?
                                        studentViewCourseDetails?.lectures[getIndexOfFreePreviewUrl].videoUrl : ''
                                }
                                width='450px'
                                height='200px'

                            />
                        </div>
                        <div className='mb-4' >
                            <span className='text-3xl font-bold' >
                                ${studentViewCourseDetails?.pricing}
                            </span>
                        </div>
                        <Button onClick={handleCreatePayment} className='w-full  ' >
                            Buy Now
                        </Button>


                        <Button
                            className='w-full mt-5'
                            onClick={isCourseInCart() ? removeFromCart : addToCart}
                        >
                            {isCourseInCart() ? "Remove from Cart" : "Add to Cart"}
                        </Button>
                    </CardContent>
                </Card>
            </aside>
        </div>

        <hr class=" mt-8 border-t border-gray-300 my-4" />
        <h2 className='font-bold text-3xl pb-6  ' >Other Course</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {
                courseList.map((courseItem, index) => {
                    // Get cart data from localStorage
                    const cartData = JSON.parse(localStorage.getItem("cartData")) || {};
                    const cartKey = user ? user.id : "guest";
                    const userCart = cartData[cartKey] || [];

                    // Check if the course is already in the cart
                    const isInCart = userCart.some((cartItem) => cartItem.courseId === courseItem.id);

                    return (
                        <div
                            onClick={() => handleCourseNavigate(courseItem?.id)}
                            className="border rounded-lg overflow-hidden shadow cursor-pointer"
                            key={index}
                        >
                            <img
                                src={courseItem?.image}
                                width={300}
                                height={150}
                                className="w-full h-40 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="font-bold mb-2">{courseItem.title}</h3>
                                <p className="text-sm text-gray-700 mb-2">{courseItem?.instructorName}</p>

                                {/* Display "Already Bought" if the user owns it */}
                                {courseItem.studentCourses.some((el) => el.userId === user?.id) ? (
                                    <p className="text-green-600">Already Bought</p>
                                ) : (
                                    <p className="font-bold text-lg">
                                        ${courseItem?.pricing}{" "}
                                        {isInCart && <span className="text-yellow-600 text-sm">(Already in Cart)</span>}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })
            }
        </div>
        <Dialog open={showFreePreviewDialog} onOpenChange={() => {
            setShowFreePreviewDialog(false)
            setDisplayCurrentVideoFreePreview(null)
        }} >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Course Preview</DialogTitle>
                </DialogHeader>
                <div className='aspect-video  rounded-lg flex items-center justify-center ' >
                    <VideoPlayer
                        url={
                            displayCurrentVideoFreePreview
                        }
                        width='450px'
                        height='200px'

                    />
                </div>
                <div className='flex flex-col gap-2' >
                    {
                        studentViewCourseDetails?.lectures?.filter(item => item.freePreview)
                            .map(filteredItem =>
                                <p onClick={() => handleSetFreePreview(filteredItem)} className='cursor-default text-[16px]
                          font-medium ' >{filteredItem?.title}</p>)
                    }
                </div>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>

}

export default StudentViewCourseDetailPage