import { GraduationCap, SearchIcon, ShoppingBasketIcon, TvMinimalPlay } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import useAuthStore from '@/store/auth-store'
import CartIcon from '../CartIcon'

function StudentNav() {
    const navigate = useNavigate()
    // const { resetCredentials } = useContext(AuthContext)
    const actionLogout = useAuthStore(state => state.actionLogout)
    const user = useAuthStore(state => state.user)

    const handleLogout = () => {
        // resetCredentials()
        actionLogout()
        navigate('/')
    }

    return (
        <header className='flex items-center justify-between p-4 border-b relative' >
            <div className='flex - items-center space-x-4' >
                <Link to="/" className='flex items-center hover:text-black ' >
                    <img src="./logo.png" width={'44px'} alt="" />
                    <span className='font-extrabold md:text-xl text-[14px]' >
                        Learnify
                    </span>
                </Link>   <div className='flex items-center space-x-1' >

                    <Button variant="ghost"
                        className="text-[14px] md:text=[16px] font-medium "
                        onClick={() => {
                            location.pathname.includes("/student/courses")
                                ? null
                                : navigate("/courses")
                        }} >
                        Explore Courses
                    </Button>
                </div>
            </div>
            


            <div className='flex items-center space-x-4 ' >
                <div className='flex gap-6 items-center ' >
                    {/* <CartIcon /> */}
                <div className="relative cursor-pointer" onClick={() => navigate('/cart')}>
            <ShoppingBasketIcon />
        </div>
                    {user && <div onClick={() => navigate('/student/student-courses')} className='flex cursor-pointer items-center gap-3' >
                        <span className='font-extrabold md:text-xl text-[14px] ' >
                            My Courses
                        </span>
                        <TvMinimalPlay className='w-8 h-8 cursor-pointer ' />
                    </div>}
                    {user ? <Button onClick={handleLogout} >Sign Out</Button> :
                        <div className='flex gap-3 ' > <Link to={'/auth'}>Register</Link>|<p className='cursor-pointer' onClick={()=>{
                            localStorage.setItem('lastVisitedPage', window.location.pathname);
                            navigate('/auth')
                        }} >Login</p></div>}
                </div>
            </div>
        </header>
    )
}

export default StudentNav