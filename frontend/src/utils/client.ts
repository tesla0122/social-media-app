
import sanityClient from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

const client = sanityClient({
    projectId: '1j110hvi',
    dataset: 'production',
    apiVersion: '2022-09-14',
    useCdn: false,
    token: import.meta.env.VITE_SANITY_TOKEN_KEY
})

const builder = imageUrlBuilder(client)

export const urlFor = (source: SanityImageSource) => builder.image(source)

export default client