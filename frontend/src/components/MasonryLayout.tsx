
import Masonry from "react-masonry-css"
import { Pin } from '.'
import { pin } from "../types"

const BREAK_POINT_OBJ = {
    default: 4,
    3000: 6,
    2000: 5,
    1200: 3,
    1000: 2,
    500: 1
}

const MasonryLayout = ({ pins }: { pins: pin[] }) => {
    return (
        <Masonry className="flex animate-slide-fwd" breakpointCols={BREAK_POINT_OBJ}>
            {
                pins.map(pin => (
                    <Pin key={pin._id} pin={pin} />
                ))
            }
        </Masonry>
    )
}

export default MasonryLayout