
import CourseInput from "@/components/form/CourseInput"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { courseLandingPageFormControls } from "@/config/createCourseFormControl"
import { InstructorContext } from "@/context/instructor-context/InstructorContext"
import { useContext } from "react"

function CourseLanding2(){
    const {courseLandingFormData, setCourseLandingFormData} = useContext(InstructorContext)
    return <Card>
        <CardHeader>
            <CardTitle>Course Landing Page</CardTitle>
        </CardHeader>
        <CardContent>
            <CourseInput 
                formControls={courseLandingPageFormControls}
                formData={courseLandingFormData}
                setFormData={setCourseLandingFormData}
            />
        </CardContent>
    </Card>
}
export default CourseLanding2