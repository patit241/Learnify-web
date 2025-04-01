import { addNewCourseService, CreateCourseService, fetchInstructorCourseDetailsService, updateCourseByIdService } from "@/api/course";
import CourseCurriculum2 from "@/components/instructor-view/courses/manage-course/CourseCurriculum2";
import CourseLanding2 from "@/components/instructor-view/courses/manage-course/CourseLanding2";
import CourseSettings2 from "@/components/instructor-view/courses/manage-course/CourseSetting2";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { courseCurriculumIntialFormData, courseLandingIntialFormData } from "@/config/createCourseFormControl";
import { InstructorContext } from "@/context/instructor-context/InstructorContext";
import useAuthStore from "@/store/auth-store";
import { Loader } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


function AddNewCoursePage2() {
    const { courseLandingFormData, courseCurriculumFormData,
        setCourseLandingFormData, setCourseCurriculumFormData,
    } = useContext(InstructorContext)
    const [loading, setLoading] = useState(false)
    const user = useAuthStore(state => state.user)
    const token = useAuthStore(state => state.token)
    const navigate = useNavigate();



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
                console.log(`Empty field in courseLandingFormData: ${key}`);
                return false;
            }
        }
        let hasFreePreview = false;

        for (const item of courseCurriculumFormData) {
            // Check if title, videoUrl, or public_id are empty
            if (isEmpty(item.title) || isEmpty(item.videoUrl)) {
                console.log('Empty field in courseCurriculumFormData');
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
        try {
            // Prepare the data, including blob URLs and files
            const courseData = {
                ...courseLandingFormData,
                curriculum: courseCurriculumFormData.map(item => ({
                    ...item,
                    // Keep the videoFile here for backend processing
                    videoFile: item.videoFile,
                    public_id: item.public_id || '',  // Make sure the public_id is either existing or an empty string
                })),
            };

            // Send the entire course data to the backend, including files
            const response = await sendCourseDataToBackend(courseData);
        } catch (err) {
            console.log("Error during course submission:", err);
        }
    }

    // Function to send the course data to the backend
    async function sendCourseDataToBackend(courseData) {
        const formData = new FormData();
        formData.append('instructorId', user.id);
        formData.append('instructorName', user.userName);
        formData.append('date', new Date().toISOString());
        formData.append('isPublished', true);
        setLoading(true)

        // Append the entire course data to FormData
        Object.keys(courseData).forEach(key => {
            if (key === 'curriculum') {
                courseData[key].forEach((item, index) => {
                    formData.append(`curriculum[${index}].title`, item.title);
                    formData.append(`curriculum[${index}].freePreview`, item.freePreview);
                    formData.append(`curriculum[${index}].public_id`, item.public_id);
                    formData.append(`curriculum[${index}].videoUrl`, item.videoUrl);
                    formData.append(`curriculum[${index}].videoFile`, item.videoFile);  // Send the actual file
                });
            } else {
                formData.append(key, courseData[key]);
            }
        });
        console.log(Array.from(formData.entries()));


        const response = await CreateCourseService(formData, token)

        setLoading(false)
        if (response?.success) {

            setCourseLandingFormData(courseLandingIntialFormData);
            setCourseCurriculumFormData(courseCurriculumIntialFormData);
            navigate(-1);
        }
    }


    return (
        <div className='container mx-auto p-4 min-w-[650px] ' >
            <div className='flex justify-between' >
                <h1 className='text-3xl font-extrabold  mb-5' > Create a new courses </h1>
                <Button disabled={!validateFormData() || loading} onClick={handleCreateCourse}
                    className="text-sm tracking-wider font-bold px-8" >{
                        loading
                            ? <p className="flex gap-1" > Submitting <Loader className="animate-spin" /></p>
                            : 'SUBMIT'}
                </Button>
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
                                <CourseCurriculum2 />
                            </TabsContent>
                            <TabsContent value="course-landing-page">
                                <CourseLanding2 />
                            </TabsContent>
                            <TabsContent value="settings">
                                <CourseSettings2 />
                            </TabsContent>
                        </Tabs>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default AddNewCoursePage2