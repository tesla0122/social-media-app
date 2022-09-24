
import { AiOutlineLogout } from "react-icons/ai"
import { googleLogout } from "@react-oauth/google"
import { useEffect, useState } from "react"
import { pin, user } from "../types"
import { useNavigate, useParams } from "react-router-dom"
import { MasonryLayout, Spinner } from "../components"
import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from "../utils/queries"
import client from "../utils/client"
import useAuthStore from "../store/authStore"

const randomImage = 'https://source.unsplash.com/1600x900/?nature,photography,technology'

const activeBtn = 'bg-red-500 mx-1 text-white font-bold p-2 rounded-full w-20 outline-none'
const notActiveBtn = 'bg-primary mx-1 text-black font-bold p-2 rounded-full w-20 outline-none border-2'

const UserProfile = () => {

    const { userProfile, removeUser } = useAuthStore()

    const [ user, setUser ] = useState<user | null>(null)

    const [ pins, setPins ] = useState<pin[] | null>(null)
    const [ isCreated, setIsCreated ] = useState(true)

    const [ isLoading, setIsLoading ] = useState(false)

    const navigate = useNavigate()

    const { userId } = useParams()

    useEffect(() => {
        let isCanceled = false

        const query = userQuery(userId as string)

        client.fetch(query)
            .then(res => {
                if(!isCanceled) {
                    setUser(res[0])
                }
            })
            .catch(err => {
                console.log(err)
            })
        
        return () => {
            isCanceled = true
        }
        
    },[userId])

    useEffect(() => {
        let isCanceled = false
        let query: string
        if(isCreated) {
            query = userCreatedPinsQuery(userId as string)
        } else {
            query = userSavedPinsQuery(userId as string)
        }

        setIsLoading(true)

        client.fetch(query)
            .then(res => {
                if(!isCanceled) {
                    setIsLoading(false)
                    setPins(res)
                }
            })
            .catch(err => {
                console.log(err)
            })

            return () => {
                isCanceled = true
            }
    }, [isCreated, userId])

    const handleLogout = () => {
        googleLogout()
        removeUser()
    }

    if(!user) return <Spinner message="Loading user info..." />

    return (
        <div className="pb-2 h-full">
            <div className="flex flex-col pb-5">
                <div className="relative flex flex-col mb-7 ">
                    <div className="flex flex-col justify-center items-center">
                        <img src={randomImage} alt="random-image" className="w-full h-370 2xl:h-[310px] shadow-lg object-cover" />
                        <img src={user.image} alt="user" className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover" />
                        <h1 className="font-bold text-3xl text-center mt-3">
                            { user.username }
                        </h1>
                        <div className="absolute top-0 z-1 right-0 p-2">
                            { userProfile?._id === user._id && (
                                <button onClick={handleLogout} className='px-3 py-2 bg-red-500 rounded-xl text-white opacity-70 hover:opacity-100 flex items-center gap-1'>
                                    <AiOutlineLogout className="text-xl" /> Logout
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="text-center mt-3 mb-7">
                        <button className={`${isCreated ? activeBtn : notActiveBtn}`} onClick={() => setIsCreated(true)}>
                            Created
                        </button>
                        <button className={`${!isCreated ? activeBtn : notActiveBtn}`} onClick={() => setIsCreated(false)}>
                            Saved
                        </button>
                    </div>
                    <div className="px-2">
                        {
                            pins && !isLoading ? (
                                pins.length > 0 ? (
                                    <MasonryLayout pins={pins} />
                                ) : (
                                    <h1 className="flex justify-center font-bold items-center w-full text-xl">
                                        No Pins Found!
                                    </h1>
                                )
                            ) : <Spinner message="Loading..." />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfile