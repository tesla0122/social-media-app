
import { SanityImageAssetDocument } from '@sanity/client'
import { ChangeEventHandler, FormEventHandler, useState } from 'react'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { BiLoaderAlt } from 'react-icons/bi'
import { MdDelete } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { Spinner } from '.'
import useAuthStore from '../store/authStore'
import categories from '../utils/categoryData'
import client from '../utils/client'
import deleteAsset from '../utils/deleteAsset'

const listTypeImage = [
    'image/apng',
    'image/avif',
    'image/gif',
    'image/jpeg',
    'image/png',
    'image/svg+xml',
    'image/webp',
    'image/bmp',
    'image/x-icon',
    'image/tiff'
]

const CreatePin = () => {

    const [ title, setTitle ] = useState('')
    const [ about, setAbout ] = useState('')
    const [ destination, setDestination ] = useState('')
    const [ loading, setLoading ] = useState(false)
    const [ category, setCategory ] = useState('')
    const [ imageAsset, setImageAsset ] = useState<SanityImageAssetDocument | null>(null)
    const [ loadingClearImageUpload, setLoadingClearImageUpload ] = useState(false)
    const [ createPinLoading, setCreatePinLoading ] = useState(false)

    const [ message, setMessage ] = useState('')

    const { userProfile } = useAuthStore()

    const navigate = useNavigate()
    

    const uploadImage: ChangeEventHandler<HTMLInputElement> = (e) => {
        const selectedFile = e.target.files?.[0]

        if(selectedFile && listTypeImage.includes(selectedFile.type as string)) {
            setLoading(true)

            client.assets
                .upload('image', selectedFile, { contentType: selectedFile.type, filename: selectedFile.name })
                .then(res => {
                    setImageAsset(res)
                    setLoading(false)
                })
                .catch(err => {
                    setLoading(false)
                    console.log(err)
                })
        }
        
    }

    const clearImageUpload = async () => {
        setLoadingClearImageUpload(true)
        await deleteAsset(imageAsset?._id as string)
        
        setImageAsset(null)
        setLoadingClearImageUpload(false)
    }

    const createPin: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()

        if(!title || !category || !destination || !about || !imageAsset) {
            setMessage('Do not leave empty any fields')
            setTimeout(() => setMessage(''), 3000)
        } else {
            setMessage('')
            setCreatePinLoading(true)

            try {
                const doc = {
                    _type: 'pin',
                    title,
                    about,
                    destination,
                    category,
                    image: {
                        _type: 'image',
                        asset: {
                            _type: 'reference',
                            _ref: imageAsset._id
                        }
                    },
                    postedBy: {
                        _type: 'postedBy',
                        _ref: userProfile?._id
                    }
                }

                await client.create(doc)

                navigate('/')
            } catch (error) {
                setCreatePinLoading(false)
                setMessage('error in console log')
                console.log(error)
            }
        }
    }

    return (
        <div className='flex flex-col justify-center items-center mt-5 lg:h-4/5'>

            <div className='flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full'>
                <div className='bg-secondaryColor p-3 flex flex-0.7 w-full'>
                    <div className='flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420 cursor-pointer'>
                        {
                            loading && <Spinner message='adding image' />
                        }
                        {
                            !imageAsset ? (
                                <label>
                                    <div className='flex flex-col items-center justify-center h-full'>
                                        <AiOutlineCloudUpload className='font-bold text-2xl' />
                                        <p className='text-lg'>Click to upload</p>
                                        <p className='mt-5 text-gray-400'>
                                            Use hight-quality JPG, SVG, PNG, GIF or TIFF less than 20 MB
                                        </p>
                                    </div>
                                    <input type="file" accept='image/*' name='upload-image' className='w-0 h-0' onChange={uploadImage} />
                                </label>
                            ) : (
                                <div className='relative h-full'>
                                    <img src={imageAsset.url} alt='uploaded-pic' className='h-full w-full' />
                                    <button type='button' className='absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out' onClick={clearImageUpload}>
                                        {
                                            loadingClearImageUpload ? <BiLoaderAlt className="animate-spin" /> : <MdDelete />
                                        }
                                        
                                    </button>
                                </div>
                            )
                        }
                    </div>
                </div>

                <form className='flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full' onSubmit={createPin}>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder='Add your title here' className='outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2' />
                    {
                        userProfile && (
                            <div className='flex gap-2 my-2 items-center bg-white rounded-lg'>
                                <img src={userProfile.image} alt="user" className='w-10 h-10 rounded-full' />
                                <p className='font-bold'>{ userProfile.username }</p>
                            </div>
                        )
                    }
                    <input type="text" value={about} onChange={e => setAbout(e.target.value)} placeholder='What is your pin about' className='outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2' />
                    <input type="text" value={destination} onChange={e => setDestination(e.target.value)} placeholder='Add a destination link' className='outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2' />
                    <div className='flex flex-col'>
                        <div>
                            <p className='mb-2 font-semibold text-lg sm:text-xl'>Choose Pin Category</p>
                            <select onChange={e => setCategory(e.target.value)} className='outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer'>
                                <option value="other" className='bg-white'>Select Category</option>
                                {
                                    categories.map(item => (
                                        <option key={item.name} value={item.name} className='text-base border-0 outline-none capitalize bg-white text-black'>{item.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                        
                        <div className='flex justify-end items-end mt-5'>
                            <button type='submit' className='bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none flex items-center justify-center'>
                                {
                                    createPinLoading ? <BiLoaderAlt className="animate-spin" /> : 'Create'
                                }
                            </button>
                        </div>
                    </div>
                </form>
                
            </div>

            {
                message && <p className='text-xl mt-5 font-semibold text-red-600'>{message}</p>
            }
        </div>
    )
}

export default CreatePin