import { addNewCourseService, fetchInstructorCourseDetailsService, updateCourseByIdService } from "@/api/course";
import CourseCurriculum from "@/components/instructor-view/courses/manage-course/CourseCurriculum";
import CourseLanding from "@/components/instructor-view/courses/manage-course/CourseLanding";
import CourseSettings from "@/components/instructor-view/courses/manage-course/CourseSetting";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { courseCurriculumIntialFormData, courseLandingIntialFormData } from "@/config/createCourseFormControl";
import { InstructorContext } from "@/context/instructor-context/InstructorContext";
import useAuthStore from "@/store/auth-store";
import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";


function AddNewCoursePage() {
    const { courseLandingFormData, courseCurriculumFormData,
        setCourseLandingFormData, setCourseCurriculumFormData,
        currentEditedCourseId, setCurrentEditedCourseId
    } = useContext(InstructorContext)

    const user = useAuthStore(state => state.user)
    const token = useAuthStore(state => state.token)

    const navigate = useNavigate();
    const params = useParams()



    function isEmpty(value) {
        if (Array.isArray(value)) {
            return value.length === 0
        }
        return value === "" || value === null || value === undefined
    }
    // console.log(courseCurriculumFormData,'kuy')
    function validateFormData() {
        for (const key in courseLandingFormData) {
            if (isEmpty(courseLandingFormData[key])) {
                // console.log(`Empty field in courseLandingFormData: ${key}`);
                return false;
            }
        }

        let hasFreePreview = false;
        for (const item of courseCurriculumFormData) {
            if (isEmpty(item.title) || isEmpty(item.videoUrl) || isEmpty(item.public_id)) {
                // console.log('Empty field in courseCurriculumFormData');
                return false;
            }
            if (item.freePreview) {
                hasFreePreview = true; // Found at least 1 freePreview
            }
        }

        if (!hasFreePreview) {
            console.log('No freePreview found in curriculum');
        }

        return hasFreePreview;
    }

    async function handleCreateCourse() {
        const courseFinalFormData = {
            instructorId: user.id,
            instructorName: user.userName,
            date: new Date().toISOString(),
            ...courseLandingFormData,
            students: [],
            curriculum: courseCurriculumFormData,
            isPublished: true,
        }
        const response = currentEditedCourseId !== null ? await updateCourseByIdService(user.id, currentEditedCourseId, courseFinalFormData) :
            await addNewCourseService(courseFinalFormData,token)
        console.log(response)
        if (response?.success) {
            setCourseLandingFormData(courseLandingIntialFormData);
            setCourseCurriculumFormData(courseCurriculumIntialFormData);
            navigate(-1);
            setCurrentEditedCourseId(null)
        }

        console.log(courseFinalFormData, "final")
    }

    async function fetchCurrentCourseDetails() {
        // console.log("Fetching course details for course ID:", currentEditedCourseId);
        const response = await fetchInstructorCourseDetailsService(user.id, currentEditedCourseId)

        if (response?.success) {
            const setCourseFormData = Object.keys(courseLandingIntialFormData).reduce((acc, key) => {
                acc[key] = response?.data[key] || courseCurriculumIntialFormData[key]
                return acc
            }, {})
            console.log(setCourseFormData, "setcoursformdata")
            setCourseLandingFormData(setCourseFormData)
            setCourseCurriculumFormData(response?.data?.lectures)
        }

        console.log(response, "response")
    }

    // Effect to set the course ID from params
    useEffect(() => {
        if (params?.courseId) {
            setCurrentEditedCourseId(params?.courseId);  // Set course ID from URL
        }
    }, [params?.courseId]);

    // Effect to fetch course details when the ID is set
    useEffect(() => {
        if (currentEditedCourseId) {
            fetchCurrentCourseDetails();
        }
    }, [currentEditedCourseId]);





    // console.log(params,currentEditedCourseId,"params")

    return (
        <div className='container mx-auto p-4' >
            <div className='flex justify-between' >
                <h1 className='text-3xl font-extrabold  mb-5' > Create a new courses </h1>
                <Button disabled={!validateFormData()} onClick={handleCreateCourse} className="text-sm tracking-wider font-bold px-8" >SUBMIT</Button>
            </div>
            <Card>
                <CardContent>
                    <div className='container mx-auto p-4' >
                        <Tabs defaultValue='curriculum' className='space-y-4'  >
                            <TabsList>
                                <TabsTrigger value="curriculum" >Curriculum</TabsTrigger>
                                <TabsTrigger value="course-landing-page" >Course Landing Page</TabsTrigger>
                                <TabsTrigger value="settings" >Settings</TabsTrigger>
                            </TabsList>
                            <TabsContent value="curriculum" >
                                <CourseCurriculum />
                            </TabsContent>
                            <TabsContent value="course-landing-page">
                                <CourseLanding />
                            </TabsContent>
                            <TabsContent value="settings">
                                <CourseSettings />
                            </TabsContent>
                        </Tabs>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default AddNewCoursePage