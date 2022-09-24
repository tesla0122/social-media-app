
import videoBackground from '../assets/share.mp4'
import logoWhite from '../assets/logoWhite.png'

import { GoogleLogin } from '@react-oauth/google'
import { signInSuccess } from '../utils/authGoogle'
import useAuthStore from '../store/authStore'

import { Navigate } from 'react-router-dom'
import { Spinner } from '../components'

const Login = () => {

    const { addUser, userProfile, setAuthLoading, authLoading } = useAuthStore()

    if(authLoading) return (
        <div className='h-screen'>
            <Spinner message='Login...' />
        </div>
    )

    if(userProfile) {
        return <Navigate to='/' />
    }

    return (
        <div className="h-screen relative flex justify-center items-center overflow-hidden">
            <div className='bg-[rgba(0,0,0,0.7)] absolute w-full h-full z-[-1] pointer-events-none'></div>
            <video src={videoBackground} className='absolute w-full h-full top-0 left-0 pointer-events-none object-cover z-[-2]' autoPlay muted loop></video>
            <div className='relative flex flex-col gap-5 items-center'>
                <img src={logoWhite} alt="logo" className='w-190 select-none' />
                <GoogleLogin onSuccess={credentialResponse => signInSuccess(credentialResponse,addUser,setAuthLoading)} onError={() => console.log('Login Failed')} />
            </div>
        </div>
    )
}

export default Login