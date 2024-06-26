import axiosInstance from "@/auth_services/instance";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DeleteAlert from "./DeleteAlert";


export default function ActionBtnUser({ roleId, data, tableReload, state }) {

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isdelopen, setisdelopen] = useState(false);
  let [alertIsOpen, setalertIsOpen] = useState(true)
  const [message, setMessage] = useState("Deleting")
  const router = useRouter();

  const deleteAlert = () => {
    setisdelopen(true);
  }

  const deleteNow = () => {
    deleteHandel(roleId)
  }

  async function deleteHandel(roleId) {
    console.log(roleId)
    try {
      setLoading(true);
     
      const res = await axiosInstance.delete(process.env.API_SERVER + "role_user/" + roleId);

      if (res.status !== 200) {
        setMessage("Used")
      } else {
        console.log("Test 111")
        tableReload();
        setLoading(false);
        // router.refresh();
      }
    } catch (error) {
      setMessage("Used")
      console.log(error.error_description || error.message);
    }
  }

  return (
    <div>
      <div className='flex gap-6'>
        {/* <button onClick={() => setIsOpen(true)}>
        <svg xmlns="http://www.w3.org/2000/svg" 
       
        fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            className='w-[18px] h-[18px] text-blue-500'
        >
          <g fill="none" fillRule="evenodd" stroke="#200E32" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" transform="translate(2 2)"><line x1="10" x2="10" y1="6.327" y2="13.654"/><line x1="13.667" x2="6.333" y1="9.99" y2="9.99"/><path d="M14.6857143,0 L5.31428571,0 C2.04761905,0 0,2.31208373 0,5.58515699 L0,14.414843 C0,17.6879163 2.03809524,20 5.31428571,20 L14.6857143,20 C17.9619048,20 20,17.6879163 20,14.414843 L20,5.58515699 C20,2.31208373 17.9619048,0 14.6857143,0 Z"/></g></svg>
        </button> */}

        {/* <button onClick={() => setIsOpen(true)}>
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
        </button> */}
        {loading ? (
          <span>{message}</span>
        ) : (

          //<button onClick={() => deleteHandel(roleId)}>
          <button onClick={() => deleteAlert()}>
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
        )}
      </div>
      <DeleteAlert isdelopen={isdelopen} setisdelopen={setisdelopen} roleId={roleId} deleteNow={deleteNow} text={data.role} />
    </div>
  );
}
