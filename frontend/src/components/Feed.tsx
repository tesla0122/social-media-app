
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"

import { MasonryLayout, Spinner } from '.'
import { pin } from "../types"
import client from "../utils/client"
import { feedQuery, searchPinsQuery } from "../utils/queries"

const Feed = () => {

    const { categoryId } = useParams()

    const [ isLoading, setIsLoading ] = useState(false)

    const [ pins, setPins ] = useState<pin[] | []>([])

    useEffect(() => {
        let isCancelled = false

        let response = []

        const fetchPins = async () => {
            try {
                setIsLoading(true)
                if(categoryId) {
                    const query = searchPinsQuery(categoryId)
    
                    response = await client.fetch(query)
                } else {
                    response = await client.fetch(feedQuery())
                }
    
                if(!isCancelled) {
                    setPins(response)
                    setIsLoading(false)
                }

                
            } catch (error) {
                setIsLoading(false)
                console.log(error)
            }
            
        }

        fetchPins()

        return () => {
            isCancelled = true
        }
    },[categoryId])

    if(isLoading) return <Spinner message='Adding new ideas to your feed!' />

    if(pins.length === 0) return <h2 className="text-center text-2xl">No pins avaliable!!</h2>

    return (
        <div>
            { pins && (
                <MasonryLayout pins={pins} />
            )}
        </div>
    )
}

export default Feed