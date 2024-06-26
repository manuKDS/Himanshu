import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import axiosInstance from "@/auth_services/instance";

export default function AddExpense({ isOpen, setIsOpen, state, fn }) {
  // const { expList, setExpList, orgList } = state;

  const { convertOrgTypeName, tableReload } = fn;

  const [loading, setLoading] = useState(false);
  const [expTitle, setExpTitle] = useState("");
  const [orgId, setOrgId] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const [errexpTitle, seterrExpTitle] = useState("");

  // const expenseId = expList[0]?.expense_nature_id;

  const clearFields = () => {
    setExpTitle("");
    setIsOpen(false);
    setLoading(false);
  };

  useEffect(()=>{
    setExpTitle("");
  },[isOpen])

  const insertData = async () => {

    if (expTitle == "")
      seterrExpTitle("Error")
    else
      seterrExpTitle("")


    if (expTitle != "") {

      try {
        setLoading(true);

        const res = await axiosInstance.post(process.env.API_SERVER + "expense_nature", {
          expense_nature: expTitle,
          org_fid: orgId,
          is_active: isActive,
        });

        if (res.status !== 200) throw error;

        tableReload();
        clearFields();
      } catch (error) {
        setLoading(false);
        console.log(error.error_description || error.message);
      }
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
              <div className='p-6 bg-[#0CA8F8] text-white text-xl font-semibold'>
                Add Nature Of Expense
              </div>
              <div className='p-5'>
                <div className='space-y-3 text-sm'>
                  <label className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">Nature Of Expense</label>
                  <input
                    type='text'
                    value={expTitle}
                    onChange={(e) => setExpTitle(e.target.value)}
                    placeholder='Nature Of Expense'
                    className={
                      errexpTitle != ""
                        ? "px-5 h-[50px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500"
                        : "px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500"
                    }
                    autoFocus
                  />
                </div>

                <div className='mt-4 flex gap-x-4 justify-end'>
                  <button
                    disabled={loading ? true : false}
                    className='px-6 py-2.5 min-w-[140px] bg-[#0CA8F8] text-white font-semibold rounded-md'
                    onClick={insertData}
                  >
                    {loading ? "Adding..." : " Submit"}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className='px-6 py-2.5 bg-[#DDE0E2] min-w-[140px] text-gray-500 font-semibold rounded-md'
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
