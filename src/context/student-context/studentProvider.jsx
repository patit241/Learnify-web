import React, { useState } from 'react'
import studentContext from './studentContext'

const StudentProvider = ({children})=>{
    const [studentViewCourseList,setStudentViewCourseList] = useState([])
    const [loadingState,setLoadingState] = useState(true)
    const [studentViewCourseDetails,setStudentViewCourseDetails] = useState(null)
    const [currentCourseDetailsId,setCurrentCourseDetailsId] = useState(null)
    const [studentBoughtCoursesList, setStudentBoughtCoursesList] = useState([]);
    const [studentCurrentCourseProgress,setStudentCurrentCourseProgress] = useState({})


    return <studentContext.Provider value={{studentViewCourseList,setStudentViewCourseList,
        loadingState,setLoadingState,studentViewCourseDetails,setStudentViewCourseDetails,
        currentCourseDetailsId,setCurrentCourseDetailsId,studentBoughtCoursesList, setStudentBoughtCoursesList,
        studentCurrentCourseProgress,setStudentCurrentCourseProgress
    }} >
        {children}
    </studentContext.Provider>
}

export default StudentProvider
