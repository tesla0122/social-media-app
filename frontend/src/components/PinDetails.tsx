import useAuthStore from "../store/authStore"
import { useState, useEffect, FormEventHandler } from "react"
import { MdDownloadForOffline } from "react-icons/md"
import { v4 as uuidv4 } from 'uuid'
import { pin, pinDetail } from "../types"
import { Link, useParams } from "react-router-dom"
import Spinner from "./Spinner"
import { commentPinQuery, pinDetailMorePinQuery, pinDetailQuery } from "../utils/queries"
import client, { urlFor } from "../utils/client"
import { BsFillArrowUpRightCircleFill } from "react-icons/bs"
import { BiLoaderAlt } from "react-icons/bi"
import MasonryLayout from "./MasonryLayout"


const PinDetails = () => {

    const { userProfile } = useAuthStore()
    const [ pinDetail, setPinDetail ] = useState<pinDetail | null>(null)

    const [ pins, setPins ] = useState<pin[] | null>(null)

    const [ comment, setComment ] = useState('')
    
    const [ addingComment, setAddingComent ] = useState(false)

    const { pinId } = useParams()

    useEffect(() => {
        let query = pinDetailQuery(pinId as string)

        if(pinId) {
            client.fetch(query)
                .then(res => {
                    setPinDetail(res[0])

                    if(res[0]) {
                        query = pinDetailMorePinQuery(res[0])
                        
                        client.fetch(query)
                            .then(data => {
                                setPins(data)
                            })
                            .catch(err => {
                                console.log(err)
                            })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    },[pinId])

    const sendComment: FormEventHandler<HTMLFormElement> = e => {
        e.preventDefault()

        if(comment && pinDetail) {

            setAddingComent(true)

            client.patch(pinDetail?._id as string)
                .setIfMissing({ comments: [] })
                .insert('after', 'comments[-1]', [{
                    _key: uuidv4(), 
                    text: comment,
                    postedBy: {
                        _ref: userProfile?._id,
                        _type: 'postedBy'
                    }  
                }])
                .commit()
                .then(res => {
                    client.fetch(commentPinQuery(res._id))
                        .then(data => {
                            setPinDetail({ ...pinDetail, comments: data[0].comments })
                            setAddingComent(false)
                            setComment('')
                        })
                        .catch(err => {
                            console.log(err)
                            setAddingComent(false)
                        })
                    
                })
                .catch(err => {
                    console.log(err)
                    setAddingComent(false)
                })
        }
    }


    if(!pinDetail) return <Spinner message="Loading pin..." />

    return (
        <>
            <div className="flex xl:flex-row flex-col m-auto bg-white max-w-[1500px] rounded-[32px]">
                <div className="flex justify-center items-center md:items-start flex-initial p-5">
                    <img src={urlFor(pinDetail.image).url()} alt="pin-image" className="rounded-t-3xl rounded-b-lg" />
                </div>
                <div className="w-full p-5 flex-1 xl:min-w-620">
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2 items-center">
                            <a href={`${urlFor(pinDetail.image).url()}?dl=`} download onClick={(e) => e.stopPropagation()} className='bg-white w-9 h-9 rounded-full flex items-center justify-center opacity-75 hover:opacity-100 hover:shadow-md outline-none'>
                                <MdDownloadForOffline className="text-2xl" />
                            </a>
                            
                        </div>
                        <a href={pinDetail.destination} target='_blank' rel="noreferrer" className="bg-white flex items-center gap-2 text-black text-sm font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md" onClick={(e) => e.stopPropagation()}>
                            <BsFillArrowUpRightCircleFill />
                            {pinDetail.title.length > 22 ? pinDetail.title.slice(0, 22) : pinDetail.title}
                        </a>
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold break-words mt-3 text-red-500"> 
                            { pinDetail.title }
                        </h1>
                        <p className="mt-3">{pinDetail.about}</p>
                    </div>
                    <Link to={`user-profile/${pinDetail.postedBy._id}`} className='flex gap-2 mt-5 items-center bg-white rounded-lg w-fit'>
                        <img className="w-8 h-8 rounded-full object-cover" src={pinDetail.postedBy.image} alt='user' />
                        <p className="font-semibold capitalize">{pinDetail.postedBy.username}</p>
                    </Link>
                    <h2 className="mt-5 text-2xl">Comments</h2>
                    <div className="max-h-370 overflow-y-auto bg-gray-50 rounded-lg p-3 hide-scrollbar mt-2">
                        {
                            pinDetail.comments?.length > 0 ? (pinDetail.comments.map(comment => (
                                <div className="flex gap-2 mt-2 items-center rounded-lg bg-white p-2" key={comment._key}>
                                    <img src={comment.postedBy.image} alt="user" className="w-10 h-10 rounded-full cursor-pointer" />
                                    <div className="flex flex-col">
                                        <p className="font-bold">{comment.postedBy.username}</p>
                                        <p>{ comment.text }</p>
                                    </div>
                                </div>
                            ))) : (
                                <p className="text-xl text-gray-700">
                                    There are no comments yet
                                </p>
                            )
                        }
                    </div>

                    <form className="flex flex-wrap mt-5 gap-3 items-center" onSubmit={sendComment}>
                        <Link to={`user-profile/${pinDetail.postedBy._id}`} className='flex gap-2 items-center bg-white rounded-lg w-fit'>
                            <img className="w-10 h-10 rounded-full object-cover" src={pinDetail.postedBy.image} alt='user' />
                        </Link>
                        <input type="text" className="flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300" placeholder="Type your comments here..." value={comment} onChange={e => setComment(e.target.value)} />
                        <button disabled={!comment} type='submit' className={`bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none flex items-center justify-center ${!comment && 'bg-red-300'}`}>
                            {
                                addingComment ? <BiLoaderAlt className="animate-spin" /> : 'Send'
                            }
                        </button>
                    </form>
                </div>
            </div>

            {
                pins ? (
                    <div className="my-8">
                        <h2 className="text-center font-bold text-3xl mb-4 text-red-500">
                            More like this
                        </h2>

                        {
                            pins.length > 0 ? (
                                <MasonryLayout pins={pins} />
                            ) : (
                                <p className="text-center text-xl text-gray-500">Not thing here yet...</p>
                            )
                        }
                    </div>
                ) : (
                    <Spinner message="Loading more pins..." />
                )
            }
        </>
    
    )
}

export default PinDetails