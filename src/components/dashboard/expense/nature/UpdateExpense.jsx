import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import axiosInstance from "@/auth_services/instance";
import OrgDropdown from "./OrgDropdown";

export default function UpdateExpense({ isOpen, setIsOpen, data, state, fn }) {
  const exp_data = data;
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(data.is_active);
  const [expTitle, setExpTitle] = useState(exp_data.expense_nature);
  const { expList, setExpList, orgList } = state;
  const [errexpTitle, seterrExpTitle] = useState("");

  const [orgId, setOrgId] = useState(exp_data.org_fid);

  const { convertOrgTypeName, tableReload } = fn;

  useEffect(() => {
    setExpTitle(exp_data.expense_nature);
    setIsActive(exp_data.is_active);
  }, [data]);

  const updateData = async (exp_id) => {
    if (expTitle == "")
      seterrExpTitle("Error")
    else
      seterrExpTitle("")


    if (expTitle != "") {


      try {
        setLoading(true);

        const res = await axiosInstance.put(
          process.env.API_SERVER + "expense_nature/" + exp_id,
          {
            expense_nature: expTitle,
            org_fid: orgId,
          }
        );

        if (res.status !== 200) throw error;

        // 1. Add data in state
        // setExpList((prev) =>
        //   prev.map((item) =>
        //     item.expense_nature_id === exp_id ? selectedData : item
        //   )
        // );

        tableReload();
        setLoading(false);
        setIsOpen(false);
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
                Update Nature Of Expense
              </div>
              <div className='p-5'>
                <div className='space-y-3 text-sm'>
                  <label className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">Nature Of Expense</label>

                  <input
                    type='text'
                    defaultValue={expTitle}
                    onChange={(e) => setExpTitle(e.target.value)}
                    placeholder='Nature Of Expense'
                    className={
                      errexpTitle != ""
                        ? "px-5 h-[50px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500"
                        : "px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500"
                    }
                  />
                </div>
                <div className='mt-4 flex gap-x-4 justify-end'>
                  <button
                    onClick={() => updateData(exp_data.expense_nature_id)}
                    disabled={loading ? true : false}
                    className='px-6 py-2.5 min-w-[140px] bg-[#0CA8F8] text-white font-semibold rounded-md'
                  >
                    {loading ? "Updating..." : "Update"}
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
