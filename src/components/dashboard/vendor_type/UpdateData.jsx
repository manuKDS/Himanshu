import { Dialog, Transition } from "@headlessui/react";
import { supabase } from "@/lib/supabaseClient";
import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/auth_services/instance";
import moment from "moment"

export default function UpdateData({ isOpen, setIsOpen, data, vendor_typeId, tableReload }) {
  const [vendor_type_data, setvendor_type_data] = useState(data);
  const [vendor_type_id, setvendor_type_id] = useState(vendor_type_data.vendor_type_id);
  const [vendor_type, setvendor_type] = useState(vendor_type_data.vendor_type);
  const [org_fid, setorg_fid] = useState(vendor_type_data.org_fid);
  const router = useRouter();

  const [errorvendor_type, seterrorvendor_type] = useState("")
  const [errorvendor_typeCode, seterrorvendor_typeCode] = useState("")


  useEffect(() => {
    setvendor_type_id(data.vendor_type_id)
    setvendor_type(data.vendor_type)
    setorg_fid(data.org_fid)
    
  }, [isOpen, data])

  // useEffect(() => {
  //   console.log(vendor_type_id, vendor_type, org_fid)
  // }, [vendor_type_id, vendor_type, org_fid])

  const updateData = async () => {
    // Validation of input fields
    if (vendor_type == "") {
      seterrorvendor_type("vendor_type name required!")
    } else {
      seterrorvendor_type("")
    }


    if (vendor_type != "") {
      const vendor_type_changecase = vendor_type.charAt(0).toUpperCase() + vendor_type.slice(1)
      const newdata = {
        vendor_type: vendor_type_changecase,
        org_fid: org_fid,
        vendor_type_id: vendor_type_id,
      };

      try {

       
        const res = await axiosInstance.put(process.env.API_SERVER + "vendor_type/" + vendor_type_id, newdata);
        //console.log(res.status)
      } catch (error) {
        console.log(error);
      }

      tableReload()

      //router.refresh();
      setIsOpen(false);
      //console.log(data, error);
    }
  }

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
                Update Vendor Type
                {/* - {vendor_type_id} */}
              </div>
              <div className='p-5'>
                <div className='space-y-3 text-sm'>
                <label  className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">Vendor Type</label>
                  
                  <input
                    type='text'
                    defaultValue={vendor_type}
                    onChange={(e) => setvendor_type(e.target.value)}
                    placeholder='Vendor Type'
                    className={errorvendor_type != "" ? 'px-5 h-[45px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' :
                      'px-5 h-[45px] w-full bg-gray-200 rounded-md outline-none placeholder:text-gray-500'}
                  />
                 
                
                
                </div>
                <div className='mt-4 flex gap-x-4 justify-end'>
                  <button
                    className='px-6 py-2.5 bg-blue-500 text-white rounded-md'
                    onClick={updateData}
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
