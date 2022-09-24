import { Circles } from "react-loader-spinner"


const Spinner = ({ message }: { message: string }) => {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <Circles
                height="50"
                width="50"
                color="#EF4444"
                ariaLabel="circles-loading"
                visible={true}
                wrapperClass='m-5'
            />
            <p className="text-lg text-center px-2">{message}</p>
        </div>
    )
}

export default Spinner