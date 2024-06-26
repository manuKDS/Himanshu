import { Dialog, Transition } from "@headlessui/react";
import axiosInstance from "@/auth_services/instance";
import { Fragment, useEffect, useState } from "react";
import EditExpTypeDropdown from "./EditExpTypeDropdown";
import CategoryDropdown from "./CategoryDropdown";

export default function UpdateExpense({ isOpen, setIsOpen, data, state, fn }) {
  let exp_data = data;

  // console.log(exp_data);
  const [loading, setLoading] = useState(false);
  const [expTitle, setExpTitle] = useState(exp_data.expense_title);
  const [expType, setExpType] = useState(exp_data.expense_type_fid);
  const [expCode, setExpCode] = useState(exp_data.expense_code);
  const [orgId, setOrgId] = useState(exp_data.org_fid);

  const [expCategory, setExpCategory] = useState(exp_data.expense_category_fid);

  const [errorMessage, setErrorMessage] = useState("");
  const [errorApi, setErrorApi] = useState("")

  useEffect(() => {
    setExpTitle(exp_data.expense_title);
    setExpType(exp_data.expense_type_fid);
    setExpCode(exp_data.expense_code);
    setOrgId(exp_data.org_fid);
    setExpCategory(exp_data.expense_category_fid);
    setErrorMessage("");
    setErrorApi("")
  }, [data, isOpen]);

  const { natureList, expenseCategories, setNatureList, setExpenseList, expenseList } = state;
  const { convetExpTypeName, convertOrgTypeName, tableReload } = fn;

  const updateData = async (exp_id) => {
    // 1. Add data in object
    // const selectedData = {
    //   expense_id: exp_id,
    //   expense_title: expTitle,
    //   expense_code: expCode,
    //   org_fid: orgId,
    //   expense_type_fid: expType,
    // };

    try {
      setLoading(true);
      if (expTitle == "" || expCode == "" || expType == "" || expCategory === "") {
        setErrorMessage("all fields required");
        setLoading(false);
      } else {
        const res = await axiosInstance.put(
          process.env.API_SERVER + "expense/" + exp_id,
          {
            expense_title: expTitle,
            expense_code: expCode,
            org_fid: orgId,
            expense_type_fid: expType,
            expense_category_fid: expCategory
          }
        );

        if (res.status !== 200) {
          setErrorApi("Please try again later!")
          setLoading(false);
        } else {

          // 1. Add data in state
          // setExpenseList((prev) =>
          //   prev.map((item) => (item.expense_id === exp_id ? selectedData : item))
          // );

          tableReload();

          setIsOpen(false);
          setLoading(false);
        }
      }
    } catch (error) {
      setLoading(false);
      console.log(error.error_description || error.message);
    }
  };

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
                Update Expense Title
              </div>
              <div className='p-5'>
                <div className='space-y-3 text-sm'>
                  <label className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">Expense Category</label>
                  <CategoryDropdown
                    state={{ expCategory, setExpCategory }}
                    list={expenseCategories}
                    error={errorMessage && expCategory === ""}
                  />
                  <label className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">Expense Title</label>

                  <input
                    type='text'
                    defaultValue={expTitle}
                    onChange={(e) => setExpTitle(e.target.value)}
                    placeholder='Expense Title'
                    className={(errorMessage && expTitle === "") ? 'px-5 h-[50px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' : 'px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'}
                  />
                  <label className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">Nature Of Expense</label>

                  <EditExpTypeDropdown
                    state={{ expType, setExpType }}
                    list={natureList}
                    fn={{ convetExpTypeName }}
                    error={errorMessage && expType === ""}
                  />
                  <label className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">Expense Code</label>

                  <input
                    type='number' min={0}
                    defaultValue={expCode}
                    onChange={(e) => setExpCode(e.target.value)}
                    placeholder='Expense Code'
                    className={(errorMessage && expCode === "") ? 'px-5 h-[50px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' : 'px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'}
                  />
                </div>
                <div className='mt-4 flex gap-x-4 justify-end'>
                  <span className="text-red-500">{errorApi}</span>
                  <button
                    className='px-6 py-2.5 min-w-[140px] bg-[#0CA8F8] text-white font-semibold rounded-md'
                    onClick={() => updateData(exp_data.expense_id)}
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
