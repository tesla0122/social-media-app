import { Route, Routes } from "react-router-dom"
import { Navbar, Feed, PinDetails, CreatePin, Search } from "."


const Pins = () => {
    
    return (
        <div className="px-2 md:px-5">
            <div>
                <Navbar />
            </div>
            <div className="h-full">
                <Routes>
                    <Route path="/" element={<Feed />} />
                    <Route path="/category/:categoryId" element={<Feed />} />
                    <Route path="/pin-detail/:pinId" element={<PinDetails />} />
                    <Route path="/create-pin" element={<CreatePin />} />
                    <Route path="/search" element={<Search />} />
                </Routes>
            </div>
        </div>
    )
}

export default Pins