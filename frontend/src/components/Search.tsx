import { useEffect, useState } from "react"
import useSearchStore from "../store/searchStore"
import { pin } from "../types"
import client from "../utils/client"
import { searchPinsQuery } from "../utils/queries"
import MasonryLayout from "./MasonryLayout"
import Spinner from "./Spinner"

let key: number

const Search = () => {

    const { searchTerm } = useSearchStore()
    const [ loading, setLoading ] = useState(false)
    const [ pins, setPins ] = useState<pin[] | null>(null)

    useEffect(() => {
        setLoading(true)

        let isCanceled = false

        const fetchSearch = async () => {
            try {
                
                const response = await client.fetch(searchPinsQuery(searchTerm))

                if(!isCanceled) {
                    setPins(response)
                    setLoading(false)
                }
            } catch (error) {
                if(!isCanceled) {
                    setLoading(false)
                }
                console.log(error)
            }
        }

        if(searchTerm) {
            clearTimeout(key)
            key = setTimeout(fetchSearch, 1500)
        } else {
            setLoading(false)
            clearTimeout(key)
            setPins(null)
        }

        return () => {
            isCanceled = true
        }
    }, [searchTerm])

    if(loading) return <Spinner message="Searching for pins..." /> 

    return (
        <div>
            {
                !pins ? <h1 className="text-center text-2xl text-gray-600">Type your search ...</h1> : (
                    pins.length > 0 ? <MasonryLayout pins={pins} /> : <h1 className="text-center text-2xl text-gray-600">No results...</h1>
                )
            }
        </div>
    )
}

export default Search