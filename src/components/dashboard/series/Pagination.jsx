import React from 'react'

const Pagination = ({pageCurrent,setDirection}) => {
    return (
        <div className='flex gap-3 items-center text-sm font-semibold'>
            <button onClick={e => setDirection("start")}>First</button>
            <button onClick={e => setDirection("prev")}>Prev</button>
            <button className='px-2.5 py-0.5 rounded-md bg-blue-500 text-white text-base '>
                {pageCurrent}
            </button>
            <button onClick={e => setDirection("next")}>Next</button>
            <button onClick={e => setDirection("end")}>Last</button>
        </div>
    )
}

export default Pagination