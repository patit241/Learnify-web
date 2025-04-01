import React, { useContext } from 'react'
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import banner from '../../components/pic/banner-img.png'
import pic from '../../components/pic/40155.jpg'
import dog from '../../components/pic/dog.jpg'
import { Button } from "@/components/ui/button";
import studentContext from '@/context/student-context/studentContext';
import useAuthStore from '@/store/auth-store';
import { courseCategories } from '@/config/createCourseFormControl';
import { checkCoursePurchaseInfoService, fetchStudentViewCourseListService } from '@/api/student';
import ImageSlider from '@/components/ImageSlider';

const images = [
  banner,
  pic, dog
]

function StudentHomePage() {
  const navigate = useNavigate()
  const { studentViewCourseList, setStudentViewCourseList } = useContext(studentContext)
  const user = useAuthStore(state => state.user)

  async function fetchAllStudentViewCourses() {
    const response = await fetchStudentViewCourseListService()

    if (response?.success) {
      setStudentViewCourseList(response?.data)
    }
    console.log(response)
  }

  function handleNavigateToCoursesPage(getCurrentId) {
    console.log(getCurrentId)
    sessionStorage.removeItem('filter');
    const currentFilter = {
      category: [getCurrentId],
    }
    sessionStorage.setItem('filters', JSON.stringify(currentFilter))
    navigate('/courses')
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

  useEffect(() => {
    fetchAllStudentViewCourses()
  }, [])

  useEffect(() => {
    if (user?.role === 'INSTRUCTOR') {
      navigate('/instructor')
    }
  }, [])


  return (
    <div className='min-h-screen bg-white ' >
      <section className='flex flex-col lg:flex-row items-center justify-between py-8 px-4 lg:px-8  ' >
        <div className='lg:w-1/2 lg:pr-12 ml-16 ' >
          <h1 className='text-5xl font-bold mb-4 ' >Your learning your future</h1>
          <p className='text-xl' >Gain skills that matter today and shape your tomorrow.
          </p>
          <br />
          <div className='flex justify-end ' >
            {
             user? <Button onClick={()=>{navigate('/courses')}} >Explore Course</Button> :<Button onClick={()=> navigate('/auth') } > Join Us</Button>
            }

          </div>

        </div>
        <div className='w-full mb-8 lg:mb-0  ' >
          <ImageSlider images={images} />
          {/* <img src={banner} width={400} height={300} className='w-full h-auto rounded-lg shadow-lg ' /> */}
        </div>
      </section>
      <section className='py-8 px-4 lg:px-8 bg-gray-200 ' >
        <h2 className='text-2xl font-bold mb-6' >Course Categories</h2>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 ' >
          {
            courseCategories.map(categoryItem =>
              <Button className="justify-start" variant="outline" key={categoryItem.id}
                onClick={() => handleNavigateToCoursesPage(categoryItem.id)}  >
                {categoryItem.label}
              </Button>
            )
          }
        </div>
      </section>
      <section className='py-12 px-4 lg:px-8 ' >
        <h2 className='text-2xl font-bold mb-6' >Featured Course</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          {
            studentViewCourseList && studentViewCourseList.length > 0 ?
              studentViewCourseList.slice(0, 8).map((courseItem, index) => (
                <div
                  onClick={() => handleCourseNavigate(courseItem?.id)}
                  className='border rounded-lg overflow-hidden shadow cursor-pointer'
                  key={index}
                >
                  <img
                    src={courseItem?.image}
                    width={300}
                    height={150}
                    className='w-full h-40 object-cover'
                  />
                  <div className='p-4'>
                    <h3 className='font-bold mb-2'>{courseItem.title}</h3>
                    <p className='text-sm text-gray-700 mb-2'>{courseItem?.instructorName}</p>
                    <p className='font-bold text-[16px]'>
                      ${courseItem?.pricing}
                    </p>
                  </div>
                </div>
              ))
              : <h1>No Course found</h1>
          }
        </div>
      </section>
    </div>
  )
}

export default StudentHomePage