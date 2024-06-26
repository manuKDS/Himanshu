import axiosInstance from "@/auth_services/instance";
import { useState } from "react";
import DeleteDailog from "./DeleteDailog";
import UpdateExpense from "./UpdateExpense";

export default function ActionBtn({ data, state, fn }) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDelOpen, setIsDelOpen] = useState(false);

  const { tableReload } = fn;
  // const { prodScheduleLists, setProdScheduleLists } = state;

  // Get prodScheduleId from list
  const prodScheduleId = data.tbl_production_schedule_id;

  async function deleteHandel(prodId) {
    try {
      setLoading(true);

      const res = await axiosInstance.delete(
        process.env.API_SERVER + "production_schedule/" + prodId
      );

      if (res.status !== 200) throw error;

      tableReload();
      setIsDelOpen(false);

      // setProdScheduleLists(
      //   prodScheduleLists.filter((e) => {
      //     return e.tbl_production_schedule_id !== prodId;
      //   })
      // );
      // setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error.error_description || error.message);
    }
  }

  return (
    <div>
      <div className='flex gap-8'>
        <button onClick={() => setIsOpen(true)}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            className='w-[18px] h-[18px] text-blue-500'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10'
            />
          </svg>
        </button>

        <button onClick={() => setIsDelOpen(true)}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            className='w-[18px] h-[18px] text-red-500'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
            />
          </svg>
        </button>
      </div>
      <UpdateExpense
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        data={data}
        state={state}
        fn={fn}
      />
      <DeleteDailog
        fn={{ deleteHandel }}
        state={{ isDelOpen, setIsDelOpen, loading }}
        data={{ prodScheduleId }}
      />
    </div>
  );
}
