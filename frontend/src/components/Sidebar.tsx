
import { RiHomeFill } from 'react-icons/ri'
import { IoIosArrowForward } from 'react-icons/io'

import { NavLink, Link } from 'react-router-dom'
import categories from '../utils/categoryData'

import logo from '../assets/logo.png'
import useAuthStore from '../store/authStore'

type props = {
    setToggleSidebar?: React.Dispatch<React.SetStateAction<boolean>>
}

const isNotActiveStyle = 'flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize'

const isActiveStyle = 'flex items-center px-5 gap-3 font-extrabold border-r-2 border-red-500 transition-all duration-200 ease-in-out capitalize text-red-500'


const Sidebar = ({ setToggleSidebar }: props) => {

    const { userProfile } = useAuthStore()
    
    return (
        <div className='flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 hide-scrollbar'>
            <div className='flex flex-col'>
                <Link to='/' className='flex px-5 gap-2 my-6 pt-1 w-190 items-center' onClick={() => setToggleSidebar && setToggleSidebar(false)}>
                    <img src={logo} alt='logo' className='w-full' />
                </Link>
                <div className='flex flex-col gap-5'>
                    <NavLink to='/' className={( { isActive } ) => isActive ? isActiveStyle : isNotActiveStyle} onClick={() => setToggleSidebar && setToggleSidebar(false)}>
                        <RiHomeFill />
                        Home
                    </NavLink>
                    <h3 className='mt-2 px-5 text-base 2xl:text-xl'>Discover categories</h3>
                    {
                        categories.slice(0, categories.length - 1).map(category => (
                            <NavLink to={`/category/${category.name}`} className={( { isActive } ) => isActive ? isActiveStyle : isNotActiveStyle} onClick={() => setToggleSidebar && setToggleSidebar(false)} key={category.name} >
                                <img src={category.image} className='w-8 h-8 rounded-full shadow-sm' alt='category-img' />
                                {
                                    category.name
                                }
                            </NavLink>
                        ))
                    }
                </div>
            </div>
            {
                userProfile && (
                    <Link onClick={() => setToggleSidebar && setToggleSidebar(false)} to={`user-profile/${userProfile._id}`} className='flex my-5 mb-3 gap-2 p-2 items-center bg-white rounded-lg shadow-lg mx-3'>
                        <img src={userProfile.image} className='w-10 h-10 rounded-full' alt='user' />
                        <p className='font-bold text-red-500'>{userProfile.username}</p>
                    </Link>
                )
            }
        </div>
    )
}

export default Sidebar