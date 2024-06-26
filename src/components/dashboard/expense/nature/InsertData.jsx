import AddExpense from "./AddExpense";
import { useState } from "react";

const InsertData = ({ state, fn }) => {
  let [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button>
      <AddExpense isOpen={isOpen} setIsOpen={setIsOpen} state={state} fn={fn} />
    </>
  );
};

export default InsertData;
