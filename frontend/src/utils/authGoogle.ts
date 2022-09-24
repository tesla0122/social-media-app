import { CredentialResponse } from "@react-oauth/google";
import jwtDecode from "jwt-decode";
import { user } from "../types";
import client from "./client";

interface MyToken {
    name: string
    picture: string
    sub: string
}

export const signInSuccess = async (credentialResponse: CredentialResponse, addUser: (user: user) => void, setAuthLoading: (value: boolean) => void) => {

    setAuthLoading(true)

    try {
        const { name, sub, picture } = jwtDecode<MyToken>(credentialResponse.credential as string)

        const user = {
            _id: sub,
            _type: 'user',
            username: name,
            image: picture
        }

        const { _id, username, image } = await client.createIfNotExists(user)

        addUser({ _id, username, image })

        setAuthLoading(false)
        

    } catch (error) {
        setAuthLoading(false)
        console.log('Loi dang nhap', error)
    }
}