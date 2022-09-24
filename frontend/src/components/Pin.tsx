import { pin } from "../types"
import client, { urlFor } from "../utils/client"

import { MdDownloadForOffline } from 'react-icons/md'
import { AiTwotoneDelete } from 'react-icons/ai'
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs'
import { BiLoaderAlt } from 'react-icons/bi'
import { MouseEventHandler, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import useAuthStore from "../store/authStore"

import { v4 as uuidv4 } from "uuid"


const Pin = ({ pin }: { pin: pin }) => {

    const navigate = useNavigate()

    const { userProfile } = useAuthStore()

    const [ post, setPost ] = useState<pin>(pin)

    const [ pinHovered, setPinHovered ] = useState(false)

    const [ savingPin, setSavingPin ] = useState(false)

    const [ alreadySaved, setAlreadySaved ] = useState(false)

    useEffect(() => {
        const checkSave = post.save?.some(item => item._ref === userProfile?._id)

        setAlreadySaved(checkSave)
    },[post.save])

    const handleSavePin: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.stopPropagation()

        if(!alreadySaved) {
            setSavingPin(true)

            client.patch(post._id).setIfMissing({ save: [] }).insert('after', 'save[-1]', [{
                _key: uuidv4(),
                _ref: userProfile?._id
            }]).commit()
                .then(res => {
                    setPost({ ...post, save: res.save })
                    setSavingPin(false)
                })
                .catch(err => {
                    setSavingPin(false)
                    console.log(err)
                })
        }
    }

    const handleUnSavePin: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.stopPropagation()

        if(alreadySaved) {
            setSavingPin(true)

            client.patch(post._id).unset([`save[_ref == "${userProfile?._id}"]`]).commit()
                .then(res => {
                    setPost({ ...post, save: res.save })
                    setSavingPin(false)
                })
                .catch(err => {
                    setSavingPin(false)
                    console.log(err)
                })
        }
    }

    const handleDeletePin: MouseEventHandler<HTMLButtonElement> = async (e) => {
        e.stopPropagation()

        if(userProfile?._id === post.postedBy._id) {

            try {
                await client.delete(post._id)

                await client.delete(post.image.asset._ref)

                window.location.reload()
            } catch (error) {
                console.log(error)
            }
        }
    }

    return (
        <div className="w-max m-2">

            <div 
                onMouseEnter={() => setPinHovered(true)} 
                onMouseLeave={() => setPinHovered(false)} 
                onClick={() => navigate(`/pin-detail/${post._id}`)}
                className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out'
            >
                <img src={ urlFor(post.image).width(250).url() } loading='lazy' className='rounded-lg w-full' alt="pin-image" />
                {
                    pinHovered && (
                        <div className="absolute top-0 w-full h-full flex flex-col justify-between p-2 pl-1 z-50 bg-blackOverlay transition-all duration-500 ease-in-out">
                            <div className="flex items-center justify-between">
                                <div className="flex gap-2">
                                    <a href={`${urlFor(post.image).url()}?dl=`} download onClick={(e) => e.stopPropagation()} className='bg-white w-9 h-9 rounded-full flex items-center justify-center opacity-75 hover:opacity-100 hover:shadow-md outline-none'>
                                        <MdDownloadForOffline className="text-2xl" />
                                    </a>
                                </div>
                                {
                                    alreadySaved ? (
                                        <button onClick={handleUnSavePin} type="button" className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 rounded-3xl hover:shadow-md outline-none text-sm">
                                            {
                                                savingPin ? <BiLoaderAlt className="animate-spin" /> : post.save?.length + ' Saved'
                                            }
                                        </button>
                                    ) : (
                                        <button onClick={handleSavePin} type="button" className="bg-white opacity-70 hover:opacity-100 text-black font-bold px-5 py-1 rounded-3xl hover:shadow-md outline-none text-sm">
                                            {
                                                savingPin ? <BiLoaderAlt className="animate-spin" /> : 'Save'
                                            }
                                        </button>
                                    )
                                }
                            </div>
                            <div className="flex justify-between items-center gap-2 w-full">
                                {
                                    post.destination && (
                                        <a href={post.destination} target='_blank' rel="noreferrer" className="bg-white flex items-center gap-2 text-black text-sm font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md" onClick={(e) => e.stopPropagation()}>
                                            <BsFillArrowUpRightCircleFill />
                                            {post.title.length > 12 ? post.title.slice(0, 12) : post.title}
                                        </a>
                                    )
                                }

                                {
                                    ( userProfile?._id === post.postedBy._id ) && (
                                        <button
                                            type="button"
                                            onClick={handleDeletePin}
                                            className="bg-white opacity-70 hover:opacity-100 font-bold p-2 rounded-3xl hover:shadow-md outline-none text-sm"
                                        >
                                            <AiTwotoneDelete />
                                        </button>
                                    )
                                }
                            </div>
                        </div>
                    )
                }
            </div>
            <Link to={`user-profile/${post.postedBy._id}`} className='flex gap-2 mt-2 items-center'>
                <img className="w-8 h-8 rounded-full object-cover" src={post.postedBy.image} alt='user' />
                <p className="font-semibold capitalize">{post.postedBy.username}</p>
            </Link>
        </div>
    )
}

export default Pin