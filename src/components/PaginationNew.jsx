import React from 'react'

const PaginationNew = ({ pageCurrent,  setDirection, pageTotal }) => {
    return (
        <div className='flex gap-3 items-center text-sm font-semibold'>
            <button onClick={e => setDirection("start")}>First</button>
            {/* <button onClick={e => setDirection("prev")}>Prev</button> */}
            {(pageCurrent - 2) > 0 &&
                <button onClick={e => setDirection("prev2")} className='px-2.5 py-0.5 rounded-md bg-blue-500 text-white text-base ' >
                    {pageCurrent - 2}
                </button>
            }
            {(pageCurrent - 1) > 0 &&
                <button onClick={e => setDirection("prev")} className='px-2.5 py-0.5 rounded-md bg-blue-500 text-white text-base '>
                    {pageCurrent - 1}
                </button>
            }
            <button className='px-2.5 py-0.5 rounded-md bg-blue-700 text-white text-base '>
                {pageCurrent}
            </button>
            {(pageCurrent + 1) <= pageTotal &&
                <button onClick={e => setDirection("next")} className='px-2.5 py-0.5 rounded-md bg-blue-500 text-white text-base '>
                    {pageCurrent + 1}
                </button>
            }
            {(pageCurrent + 2) <= pageTotal &&
                <button onClick={e => setDirection("next2")} className='px-2.5 py-0.5 rounded-md bg-blue-500 text-white text-base '>
                    {pageCurrent + 2}
                </button>
            }
            {/* <button onClick={e => setDirection("next")}>Next</button> */}
            <button onClick={e => setDirection("end")}>Last</button>
        </div>
    )
}

export default PaginationNew