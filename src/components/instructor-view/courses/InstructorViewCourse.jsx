import React, { useContext } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash as Delete } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { InstructorContext } from '@/context/instructor-context/InstructorContext';
import { courseCurriculumIntialFormData, courseLandingIntialFormData } from '@/config/createCourseFormControl';
import { deleteCourseByIdService } from '@/api/course';
import useAuthStore from '@/store/auth-store';

function InstructorViewCourse({listOfCourse}) {

  const token = useAuthStore(state=>state.token)
  const {setCourseCurriculumFormData,setCurrentEditedCourseId,setCourseLandingFormData} = useContext(InstructorContext)
  
  const navigate = useNavigate()

  const deleteHandler = async (instructorId,courseId,token)=>{
     await deleteCourseByIdService(instructorId,courseId,token)
     alert('Delete successfully')
     window.location.reload();
  }
  // console.log(listOfCourse)
  

  return (
    <Card>
      <CardHeader className="flex justify-between flex-row items-center" >
        <CardTitle className="text-3xl font-extrabold " >All Courses</CardTitle>
        <Button onClick={()=>{
          setCurrentEditedCourseId(null)
          setCourseLandingFormData(courseLandingIntialFormData)
          setCourseCurriculumFormData(courseCurriculumIntialFormData)
          navigate('/instructor/create-new-course')
          
          }} className="p-6">Create New Course</Button>
      </CardHeader>
      <CardContent>
        <div className='overflow-x-auto' >
          <Table>
            
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead className="text-right" >Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                listOfCourse && listOfCourse.length>0?
                listOfCourse.map(course=>
                  <TableRow>
                  <TableCell className="font-medium">{course?.title}</TableCell>
                  <TableCell>{course?.studentCourses?.length}</TableCell>
                  <TableCell>${course?.studentCourses?.length * course?.pricing }</TableCell>
                  <TableCell className="text-right">
                      <Button onClick={()=>{
                        
                        navigate(`/instructor/edit-course/${course?.id}`)
                        
                      }} variant="ghost" size="sm" >
                        <Edit className='h-6 w-6' />
                      </Button>
                      <Button variant="ghost" size="sm" 
                       onClick={()=>deleteHandler(course.instructorId,course.id,token)} >
                        <Delete className='h-6 w-6' />
                      </Button >
  
                  </TableCell>
                </TableRow>
                ) : null
              }
            </TableBody>
          </Table>


        </div>
      </CardContent>
    </Card>
  )
}

export default InstructorViewCourse