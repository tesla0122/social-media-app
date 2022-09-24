
import { HiMenu} from 'react-icons/hi'
import { AiFillCloseCircle } from 'react-icons/ai'
import { Link, Navigate, Route, Routes } from 'react-router-dom'

import logo from '../assets/logo.png'
import { Sidebar, Pins} from '../components'
import { useEffect, useRef, useState } from 'react'
import useAuthStore from '../store/authStore'
import UserProfile from './UserProfile'

const Home = () => {
    
    const { userProfile } = useAuthStore()
    const [ toggleSidebar, setToggleSidebar ] = useState(false)

    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        scrollRef.current?.scrollTo(0,0)
    },[])

    if(!userProfile) {
        return <Navigate to='/login' />
    }
    
    return (
        <div className='flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out'>
            <div className='hidden md:flex h-screen flex-initial'>
                <Sidebar />
            </div>
            <div className='flex md:hidden flex-row'>
                <div className='p-2 w-full flex flex-row justify-between items-center shadow-md'>
                    <HiMenu fontSize={40} className='cursor-pointer' onClick={() => setToggleSidebar(true)} />

                    <Link to='/'>
                        <img src={logo} alt="logo" className='w-28' />
                    </Link>
                    <Link to={`user-profile/${userProfile._id}`}>
                        <img src={userProfile.image} alt="user" className='w-10 rounded-full' />
                    </Link>
                </div>
                {
                    toggleSidebar && (
                        <div className='fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in'>
                            <div className='absolute w-full flex justify-end items-center p-2'>
                                <AiFillCloseCircle fontSize={30} className='cursor-pointer' onClick={() => setToggleSidebar(false)} />
                            </div>
                            <Sidebar setToggleSidebar={setToggleSidebar} />
                        </div>
                    )
                }
            </div>
            <div className='pb-2 flex-1 h-screen overflow-y-scroll hide-scrollbar' ref={scrollRef}>
                <Routes>
                    <Route path='/user-profile/:userId' element={<UserProfile />} />
                    <Route path='/*' element={<Pins />} />
                </Routes>
            </div>
        </div>
    )
}

export default Home