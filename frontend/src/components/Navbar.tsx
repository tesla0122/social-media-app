
import { IoMdAdd, IoMdSearch } from 'react-icons/io'
import useAuthStore from '../store/authStore'
import { Link, useNavigate } from 'react-router-dom'
import useSearchStore from '../store/searchStore'


const Navbar = () => {

    const { userProfile } = useAuthStore()

    const { searchTerm, setSearchTerm } = useSearchStore()

    const navigate = useNavigate()

    if(!useAuthStore) return null

    return (
        <div className='flex gap-2 md:gap-5 w-full mt-5 pb-7'>
            <div className='flex justify-start items-center w-full px-2 rounded-md bg-white border-none outline-none focus-within:shadow-sm'>
                <IoMdSearch fontSize={21} className='ml-1 text-red-500' />
                <input className='p-2 w-full bg-white outline-none' type='text' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder='Type your search here...' onFocus={() => navigate('/search')} />
            </div>
            <div className='flex gap-3 items-center'>
                <Link to={`user-profile/${userProfile?._id}`} className='hidden md:block'>
                    <img src={userProfile?.image} alt="user" className='w-14 rounded-full' />
                </Link>
                <Link to='create-pin' className='hidden md:block'>
                    <IoMdAdd className='bg-red-500 text-white rounded-full w-10 h-10' />
                </Link>
            </div>
        </div>
    )
}

export default Navbar