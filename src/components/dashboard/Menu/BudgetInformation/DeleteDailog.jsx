import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function DeleteDailog({ state, fn, data }) {
  const { isDelOpen, setIsDelOpen, loading } = state;
  const { budgetInfoId } = data;

  const { deleteHandel } = fn;

  return (
    <Transition show={isDelOpen} as={Fragment}>
      <Dialog
        open={isDelOpen}
        onClose={() => setIsDelOpen(false)}
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
            <Dialog.Panel className='mx-auto w-[400px] rounded-[15px] bg-white overflow-hidden'>
              <div className='p-5 bg-red-400 text-white text-xl font-semibold'>
                Do you want to delete?
              </div>
              <div className='px-5 pt-5 pb-6'>
                <div className='space-y-3 text-sm'></div>
                <div className='flex gap-x-4 justify-end'>
                  <button
                    className='px-6 py-2.5 min-w-[140px] bg-red-400 text-white font-semibold rounded-md'
                    onClick={() => deleteHandel(budgetInfoId)}
                    disabled={loading ? true : false}
                  >
                    {loading ? "Deleting..." : "Delete"}
                  </button>
                  <button
                    onClick={() => setIsDelOpen(false)}
                    className='px-6 py-2.5 bg-[#DDE0E2] min-w-[140px] text-gray-500 font-semibold rounded-md'
                  >
                    Cancel
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
