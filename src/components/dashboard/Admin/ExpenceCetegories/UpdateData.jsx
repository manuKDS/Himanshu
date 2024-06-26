import { Dialog, Transition } from "@headlessui/react";
import axiosInstance from "@/auth_services/instance";
import { Fragment, useEffect, useState } from "react";
import CategoryParentDropdown from "./CategoryParentDropdown";
// import IsDeletedDropdown from "./IsDeleteDropdown";
var CryptoJS = require("crypto-js");

export default function UpdateData({ isOpen, setIsOpen, data, state, fn, parentCategories }) {
  const { tableReload } = fn;
  const { categoryList } = state;
  console.log("parentCategories:::", parentCategories);
  const [loading, setLoading] = useState(false);
  const [categoryNumber, setCategoryNumber] = useState(data.category_number);
  const [categoryName, setCategoryName] = useState(data.category_name);
  const [categoryParent, setCategoryParent] = useState(data.category_parent);

  const [errorMessage, setErrorMessage] = useState("");
  const [errorApi, setErrorApi] = useState("")

  useEffect(() => {
    setCategoryNumber(data.category_number);
    setCategoryName(data.category_name);
    setCategoryParent(data.category_parent);
    setErrorMessage("");
    setErrorApi("")
  }, [isOpen, data])


  const clearFields = () => {
    setIsOpen(false);
    setLoading(false);
    setCategoryNumber(data.category_number);
    setCategoryName(data.category_name);
    setCategoryParent(data.category_parent);
    setErrorMessage("");
    setErrorApi("")
  };

  const updateData = async () => {
    try {
      setLoading(true);
      if (categoryNumber == "" || categoryParent == "" || categoryName == "") {
        setErrorMessage("all fields required");
        setLoading(false);
      }
      else if (data.category_number !== categoryNumber && categoryList.findIndex(e => e.category_number == categoryNumber) !== -1) {
        setErrorApi("Category number allready available")
        setLoading(false)
      } else {
        const new_data = {
          category_number: categoryNumber,
          category_name: categoryName,
          category_parent: categoryParent,
        };

        const id = data.category_id

        console.log("categoryNumber:::", data);
        const res = await axiosInstance.put(process.env.API_SERVER + "expense_categories/" + id, new_data);
        if (res.status !== 200) {
          setErrorApi("Please try again later!")
          setLoading(false);
        } else {
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
        onClose={() => clearFields()}
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
                Update Expence Category
              </div>
              <div className='px-5 pt-5 pb-6'>
                <div className='space-y-4 text-sm'>
                  <div className='flex gap-3'>
                    <div className='flex-1'>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Parent Category</label>
                      <CategoryParentDropdown
                        list={parentCategories}
                        state={{ categoryParent, setCategoryParent }}
                        error={errorMessage && categoryParent === ""}
                      />
                    </div >
                    <div className='flex-1'>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Category Number</label>

                      <input
                        type='number' min={0}
                        value={categoryNumber}
                        onChange={(e) => setCategoryNumber(e.target.value)}
                        placeholder='Category Number'
                        className={(errorMessage && categoryNumber === "") ? 'px-5 h-[50px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' : 'px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'}
                      />
                    </div>
                  </div>
                  <div className='flex-1'>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Category Name</label>
                    <input
                      type='text'
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      placeholder='Category Name'
                      className={(errorMessage && categoryName === "") ? 'px-5 h-[50px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' : 'px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'}
                    />
                  </div>
                </div >
                <div className='mt-5 flex gap-x-4 justify-end'>
                  <span className="text-red-500">{errorApi}</span>
                  <button
                    className='px-6 py-2.5 min-w-[140px] bg-[#0CA8F8] text-white font-semibold rounded-md'
                    disabled={loading ? true : false}
                    onClick={updateData}
                  >
                    {loading ? "Updating..." : "Update"}
                  </button>
                  <button
                    onClick={() => clearFields()}
                    className='px-6 py-2.5 bg-[#DDE0E2] min-w-[140px] text-gray-500 font-semibold rounded-md'
                  >
                    Discard
                  </button>
                </div >
              </div>
            </Dialog.Panel>
          </Transition.Child >
        </div>
      </Dialog>
    </Transition>)
} 