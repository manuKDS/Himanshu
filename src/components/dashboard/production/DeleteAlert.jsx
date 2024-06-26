import { Dialog, Transition } from "@headlessui/react";
import { supabase } from "@/lib/supabaseClient";
import { Fragment, useState } from "react";



export default function DeleteAlert({ isdelopen, setisdelopen, deleteNow, text }) {
 
  const confirmDelete=()=>{
    setisdelopen(false)
    deleteNow()
  }
  return (
    <Transition show={isdelopen} as={Fragment}>
      <Dialog
        open={isdelopen}
        onClose={() => setisdelopen(false)}
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
              <div className='p-6 bg-red-400 text-white text-xl font-semibold'>
                Do you want to delete ? {text}
              </div>
              <div className='p-5'>
                <div className='space-y-3 text-sm'>
                 
                
                </div>
                <div className='mt-4 flex gap-x-4 justify-end'>
                  <button
                    className='px-6 py-2.5 bg-red-400 text-white rounded-md'
                    onClick={e=>{confirmDelete()}}
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setisdelopen(false)}
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
