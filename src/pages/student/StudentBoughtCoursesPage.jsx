import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { PlayIcon, Trophy, VideoIcon, Watch } from "lucide-react";
import useAuthStore from "@/store/auth-store";
import { useContext, useEffect } from "react";
import studentContext from "@/context/student-context/studentContext";
import { fetchStudentBoughtCoursesService } from "@/api/bought";
import VideoPlayer from "@/components/VideoPlayer";

export default function StudentBoughtCoursesPage() {
    const user = useAuthStore(state => state.user)
    const token = useAuthStore(state => state.token)
    const { studentBoughtCoursesList, setStudentBoughtCoursesList } = useContext(studentContext)
    const navigate = useNavigate()

    async function fetchStudentBoughtCourses() {
        const response = await fetchStudentBoughtCoursesService(user.id)
        if (response?.success) {
            setStudentBoughtCoursesList(response?.data)
            console.log(response.data[0].courseProgresses[0].completed)
        }
    }


    useEffect(() => {
        fetchStudentBoughtCourses()
    }, [])


    return (
        <div className='p-4  ' >
                <h1 className=' ml-10 text-3xl font-bold mb-8' >
                    My Courses
                </h1>



            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5' >
                {studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? (
                    studentBoughtCoursesList.map((course) => (
                        <Card key={course.id} className="flex flex-col">
                            <CardContent className="p-4 flex-grow">
                                <img
                                    src={course?.image}
                                    alt={course?.title}
                                    className="h-52 w-full object-cover rounded-md mb-4"
                                />
                                <h3 className="font-bold mb-1">{course?.title}</h3>
                                <p className="text-sm text-gray-700 mb-2">
                                    {course?.instructorName}
                                </p>
                                <div className="flex justify-end" >
                                    <p>
                                        {course?.courseProgresses[0]?.completed ? <div className="flex text-amber-500" ><Trophy /> <p>Completed</p></div> : ''}
                                    </p>
                                </div>

                            </CardContent>
                            <CardFooter>
                                <Button
                                    onClick={() =>
                                        navigate(`/student/course-progress/${course?.id}`)
                                    }
                                    className="flex-1"
                                >
                                    <PlayIcon className="mr-2 h-4 w-4" />
                                    Start Watching
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <h1 className="text-3xl font-bold">No Courses found</h1>
                )}
            </div>
        </div>
    )
}