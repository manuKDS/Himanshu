import { useState } from "react";
import AddRegion from "./AddRegion";

const InsertData = ({ fn, state, tableReload }) => {
  let [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth='1.5'
          stroke='currentColor'
          className='w-6 h-6'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 4.5v15m7.5-7.5h-15'
          />
        </svg>
      </button>
      <AddRegion isOpen={isOpen} setIsOpen={setIsOpen} fn={fn} state={state} tableReload={tableReload} />
    </>
  );
};

export default InsertData;
