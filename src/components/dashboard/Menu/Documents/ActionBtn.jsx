import { supabase } from "@/lib/supabaseBucket";
import { useEffect, useState } from "react";
import DeleteDailog from "./DeleteDailog";
import UpdateExpense from "./UpdateExpense";
import axiosInstance from "@/auth_services/instance";
import ShowDocument from "./ShowDocument";
import useDownloader from "react-use-downloader";

export default function ActionBtn({ data, state, fn, tax_credit_id, tableReload, menuCheck }) {
  const [data1, setdata1] = useState(data.document_path)
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDelOpen, setIsDelOpen] = useState(false);
  const [linkfile, setLinkFile] = useState("");

  const { size, elapsed, percentage, download, cancel, error, isInProgress } = useDownloader();

  useEffect(()=>{
    const loadFile=()=>{
      const { data } = supabase
      .storage
      .from('avatars')
      .getPublicUrl('public/' + data1)

    setLinkFile(data.publicUrl)
    }
    loadFile()
  },[data1])
  // const { creditTypeList, setCreditTypeList, provinceList, setProvinceList, assitanceList } = state;

  // Get expense id from list
  // const creditTypeId = data.tax_credit_type_id;

  //const API_URL = 'http://localhost:3000';

  async function deleteHandel(creditId) {
    try {
      console.log("creditId:::", creditId);
      setLoading(true);
      const res = await axiosInstance.delete(process.env.API_SERVER + "document/" + creditId);

      if (res.status !== 200) throw error;

      tableReload()
      setIsDelOpen(false);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error.error_description || error.message);
    }
  }

  const API_URL = process.env.API_SERVER.split("/api")

  const downloadDoc = async (fname) => {
    const { data } = supabase
      .storage
      .from('avatars')
      .getPublicUrl('public/' + fname)

    setLinkFile(data.publicUrl)
    console.log(data)
  }

  return (
    <div>
      <div className='flex'>
        {linkfile === "" &&
          <button onClick={() => downloadDoc(data.document_path)}>
            {/* Click to download the file */}

            {/* {`${API_URL[0]}/uploads/${data.document_path}`} */}

            <svg xmlns="http://www.w3.org/2000/svg" className="mr-6 icon icon-tabler icon-tabler-download" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"></path>
              <path d="M7 11l5 5l5 -5"></path>
              <path d="M12 4l0 12"></path>
            </svg>
          </button>
        }

        {linkfile !== "" &&
          <a href={linkfile} target="_blank" className="  text-blue-500 text-sm flex justify-center items-center ">

            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 icon icon-tabler icon-tabler-file-download" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
              <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path>
              <path d="M12 17v-6"></path>
              <path d="M9.5 14.5l2.5 2.5l2.5 -2.5"></path>
            </svg> Download
          </a>
        }



        {menuCheck ? (

          <button onClick={() => setIsDelOpen(true)} className="mx-5">

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
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-400 icon icon-tabler icon-tabler-pencil-off" width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M10 10l-6 6v4h4l6 -6m1.99 -1.99l2.504 -2.504a2.828 2.828 0 1 0 -4 -4l-2.5 2.5"></path>
            <path d="M13.5 6.5l4 4"></path>
            <path d="M3 3l18 18"></path>
          </svg>
        )}

      </div>
      <ShowDocument
        // tax_credit_id={tax_credit_id}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        data={data}
        state={state}
        fn={fn}
      // tableReload={tableReload}
      />
      <DeleteDailog
        fn={{ deleteHandel }}
        state={{ isDelOpen, setIsDelOpen, loading }}
        data={{ data }}
      />
    </div>
  );
}
