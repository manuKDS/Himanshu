import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/auth_services/instance";


export default function AddData({ isOpen, setIsOpen, tableReload }) {
  const [vendor_type, setvendor_type] = useState("")
  const [org_fid, setorg_fid] = useState(1)
  const router = useRouter()

  const [errorvendor_type, seterrorvendor_type] = useState("")

  //console.log(vendor_type, org_fid);

  const insertData = async () => {

    if (vendor_type == "") {
      seterrorvendor_type("vendor_type name required!")
    } else {
      seterrorvendor_type("")
    }
  
    if (vendor_type != "") {
    
      const vendor_type_changecase = vendor_type.charAt(0).toUpperCase() + vendor_type.slice(1)
      const data = {
        vendor_type: vendor_type_changecase,
        org_fid,
      };

      try {
       
        const res = await axiosInstance.post(process.env.API_SERVER + "vendor_type", data);
        setIsOpen(false);
        setvendor_type("");
      } catch (error) {
        console.log(error);
      }
      tableReload();
      //router.refresh();
    }
  };

  useEffect(() => {
    setvendor_type("")      
  }, [isOpen])

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className='relative z-50'
      >
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <div className='fixed inset-0 bg-black/60' aria-hidden='true' />

        {/* Full-screen container to center the panel */}
        <div className='fixed inset-0 flex items-center justify-center p-4'>
          {/* The actual dialog panel  */}
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-100'
            enterFrom='opacity-0 scale-95'
            enterTo='opacity-100 scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-95'
          >
            <Dialog.Panel className='mx-auto w-[600px] rounded-[15px] bg-white overflow-hidden'>
              <div className='p-6 bg-blue-500 text-white text-xl font-semibold'>
                Add Vendor Type
              </div>
              <div className='p-5'>
                <div className='space-y-3 text-sm'>
                <label  className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">Vendor Type</label>
                  
                  <input
                    type='text'
                    value={vendor_type}
                    onChange={(e) => { setvendor_type(e.target.value); seterrorvendor_type(""); }}
                    placeholder='Vendor Type'

                    className={errorvendor_type != "" ? 'px-5 h-[45px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' :
                      'px-5 h-[45px] w-full bg-gray-200 rounded-md outline-none placeholder:text-gray-500'
                    }
                  />

                  {/* <select id="is_active" onChange={(e) => setIs_active(e.target.value === "active" ? true : false)} className="px-5 h-[45px] w-full bg-gray-200 rounded-md outline-none placeholder:text-gray-500 border-r-8">
                    <option value="active" selected>Active</option>
                    <option value="not_active">Inactive</option>
                  </select> */}
                 
                </div>
                <div className='mt-4 flex gap-x-4 justify-end'>
                  <button
                    className='px-6 py-2.5 bg-blue-500 text-white rounded-md'
                    onClick={insertData}
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className='px-6 py-2.5 bg-gray-400 text-white rounded-md'
                  >
                    Discard
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
