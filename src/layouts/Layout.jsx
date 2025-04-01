import StudentNav from '@/components/nav/StudentNav'
import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'

function Layout() {
    const location = useLocation()

    return(
        <div>
            {
                !location.pathname.includes("course-progress") ?
                <StudentNav/> : null
            }
            <Outlet/>
        </div>
    )
}

export default Layout