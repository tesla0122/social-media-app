import create from "zustand"
import { persist } from 'zustand/middleware'
import { user } from "../types"

type authStoreType = {
    userProfile: user | null

    authLoading: boolean

    addUser: ( user: user ) => void

    removeUser: () => void

    setAuthLoading: (value: boolean) => void

}

const useAuthStore = create(
    persist<authStoreType>(
        (set) => ({
            userProfile: null,

            authLoading: false,

            addUser: (user: user) => set({ userProfile: user }),

            removeUser: () => set({ userProfile: null }),

            setAuthLoading: (value: boolean) => set({ authLoading: value })
        }),
        {
            name: 'auth',
            getStorage: () => sessionStorage
        }
    )
)

export default useAuthStore