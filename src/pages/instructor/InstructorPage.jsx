import { fetchInstructorCourseListService } from '@/api/course'
import InstructorViewCourse from '@/components/instructor-view/courses/InstructorViewCourse'
import InstructorViewDashboard from '@/components/instructor-view/dashboard/InstructorViewDashboard'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { InstructorContext } from '@/context/instructor-context/InstructorContext'
import useAuthStore from '@/store/auth-store'
import { BarChart, Book, LogOut } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function InstructorPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const { instructorCoursesList, setInstructorCoursesList } = useContext(InstructorContext)
  const actionLogout = useAuthStore(state => state.actionLogout)
  const user = useAuthStore(state => state.user)
  const navigate = useNavigate()
  const token = useAuthStore(state=>state.token)


  async function fetchAllcourses() {
    const response = await fetchInstructorCourseListService(user.id,token)
    console.log(response, 'Fetchalllll')
    if (response?.success) {
      setInstructorCoursesList(response?.data)
    }
  }


  const handleLogout = () => {
    actionLogout()
    localStorage.clear()
    navigate('/')
  }

  useEffect(() => {
    fetchAllcourses()
  }, [])

  const menuItems = [
    {
      icon: BarChart,
      label: 'Dashboard',
      value: 'dashboard',
      component: <InstructorViewDashboard listOfCourses={instructorCoursesList} />
    },
    {
      icon: Book,
      label: 'Courses',
      value: 'courses',
      component: <InstructorViewCourse listOfCourse={instructorCoursesList} />
    },
    {
      icon: LogOut,
      label: 'Logout',
      value: 'logout',
      component: null
    }
  ]


  return (
    <div className="flex h-full  min-h-screen bg-gray-300" >
      <aside className='w-64 bg-white shadow-md hidden md:block ' >
        <div className='p-4' >
          <h2 className="text-2xl font-bold mb-4" >Instructor View</h2>
          <nav>
            {
              menuItems.map(el => (<Button
                className="w-full justify-start mb-2"
                key={el.value}
                //  variant={activeTab===el.value?'secondary':'ghost'}
                onClick={el.value === "logout"
                  ? handleLogout : () => setActiveTab(el.value)}
              >
                <el.icon className="mr-2 h-4 w-4" />
                {el.label}
              </Button>))
            }
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {menuItems.map((menuItem) => (
              <TabsContent value={menuItem.value}>
                {menuItem.component !== null ? menuItem.component : null}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  )
}

export default InstructorPage

