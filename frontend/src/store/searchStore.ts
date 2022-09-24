
import create from "zustand"

type searchStoreType = {
    searchTerm: string,
    setSearchTerm: (value: string) => void
}

const useSearchStore = create<searchStoreType>((set) => ({
    searchTerm: '',
    setSearchTerm: (value: string) => set({ searchTerm: value })
}))

export default useSearchStore