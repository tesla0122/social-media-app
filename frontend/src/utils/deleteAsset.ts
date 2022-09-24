import client from "./client"

const deleteAsset = async (assetDocumentId: string) => {

    try {
        await client.delete(assetDocumentId)

    } catch (error) {
        console.log(error)
    }
}

export default deleteAsset