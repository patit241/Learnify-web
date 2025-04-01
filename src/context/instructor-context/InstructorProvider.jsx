import { useState } from "react";
import { InstructorContext } from "./InstructorContext";
import { courseCurriculumIntialFormData, courseLandingIntialFormData } from "@/config/createCourseFormControl";

export default function InstructorProvider({ children }) {
    const [courseLandingFormData, setCourseLandingFormData] = useState(courseLandingIntialFormData)
    const [courseCurriculumFormData, setCourseCurriculumFormData] = useState(courseCurriculumIntialFormData)
    const [mediaUploadProgress, setMediaUploadProgress] = useState(false)
    const [mediaUploadProgressPercentage, setMediaUploadProgressPercentage] = useState(0)
    const [instructorCoursesList,setInstructorCoursesList] = useState([])
    const [currentEditedCourseId,setCurrentEditedCourseId] = useState(null)

    return <InstructorContext.Provider value={{
        courseLandingFormData, setCourseLandingFormData, courseCurriculumFormData,
        setCourseCurriculumFormData, mediaUploadProgress, setMediaUploadProgress, mediaUploadProgressPercentage, setMediaUploadProgressPercentage,
        instructorCoursesList,setInstructorCoursesList,currentEditedCourseId,setCurrentEditedCourseId
    }} >{children}</InstructorContext.Provider>
}