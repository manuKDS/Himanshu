import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import ExpTypeDropdown from "./ExpTypeDropdown";
import OrgDropdown from "./OrgDropdown";
import axiosInstance from "@/auth_services/instance";
import CategoryDropdown from "./CategoryDropdown";

export default function AddExpense({ isOpen, setIsOpen, fn, state }) {
  const { convetExpTypeName, convetOrgTypeName, tableReload } = fn;
  const {
    natureList,
    expenseCategories,
    setNatureList,
    expenseList,
    orgList,
    setExpenseList,
  } = state;

  const [loading, setLoading] = useState(false);
  const [expTitle, setExpTitle] = useState("");
  const [expCode, setExpCode] = useState("");
  const [orgId, setOrgId] = useState(1);
  const [expType, setExpType] = useState("");
  const [expCategory, setExpCategory] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorApi, setErrorApi] = useState("");

  // const expenseId = expenseList[0].expense_id;

  // const selectedData = {
  //   expense_id: expenseId + 1,
  //   expense_title: expTitle,
  //   expense_code: expCode,
  //   org_fid: orgId,
  //   expense_type_fid: expType,
  // };
  useEffect(() => {
    setExpTitle("");
    setExpCode("");
    setExpType("");
    setExpCategory("");
    setErrorMessage("");
    setErrorApi("");
  }, [isOpen]);

  const clearFields = () => {
    setIsOpen(false);
    setLoading(false);
    setExpTitle("");
    setExpCode("");
    setExpType("");
    setExpCategory("");
    setErrorMessage("");
    setErrorApi("");
  };

  const insertData = async () => {
    try {
      setLoading(true);
      if (
        expTitle == "" ||
        expCode == "" ||
        expType == "" ||
        expCategory === ""
      ) {
        setErrorMessage("all fields required");
        setLoading(false);
      } else {
        const data = {
          expense_title: expTitle,
          expense_type_fid: expType,
          expense_code: expCode,
          org_fid: orgId,
          expense_category_fid: expCategory,
        };

        const res = await axiosInstance.post(
          process.env.API_SERVER + "expense",
          data
        );

        if (res.status !== 200) {
          setErrorApi("Please try again later!");
          setLoading(false);
        } else {
          // 1. Add data in state
          // setExpenseList([selectedData, ...expenseList]);
          tableReload();
          // 2. clear fields after adding data
          clearFields();
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
        className="relative z-50"
      >
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <div className="fixed inset-0 bg-black/60" aria-hidden="true" />

        {/* Full-screen container to center the panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          {/* The actual dialog panel  */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-100"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto w-[600px] rounded-[15px] bg-white overflow-hidden">
              <div className="p-6 bg-[#0CA8F8] text-white text-xl font-semibold">
                Add Expense Title
              </div>
              <div className="p-5">
                <div className="space-y-3 text-sm">
                  <label className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">
                    Expense Category
                  </label>
                  <CategoryDropdown
                    state={{ expCategory, setExpCategory }}
                    list={expenseCategories}
                    error={errorMessage && expCategory === ""}
                  />
                  <label className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">
                    Expense Title
                  </label>
                  <input
                    type="text"
                    value={expTitle}
                    onChange={(e) => setExpTitle(e.target.value)}
                    className={
                      errorMessage && expTitle === ""
                        ? "px-5 h-[50px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500"
                        : "px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500"
                    }
                  />

                  <label className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">
                    Nature Of Expense
                  </label>
                  <ExpTypeDropdown
                    state={{ expType, setExpType }}
                    list={natureList}
                    convetExpTypeName={convetExpTypeName}
                    error={errorMessage && expType === ""}
                  />

                  <label className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">
                    Expense Code
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={expCode}
                    onChange={(e) => setExpCode(e.target.value)}
                    placeholder="Expense Code"
                    className={
                      errorMessage && expCode === ""
                        ? "px-5 h-[50px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500"
                        : "px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500"
                    }
                  />
                </div>
                <div className="mt-4 flex gap-x-4 justify-end">
                  <span className="text-red-500">{errorApi}</span>
                  <button
                    className="px-6 py-2.5 min-w-[140px] bg-[#0CA8F8] text-white font-semibold rounded-md"
                    disabled={loading ? true : false}
                    onClick={insertData}
                  >
                    {loading ? "Adding..." : " Submit"}
                  </button>
                  <button
                    onClick={() => clearFields()}
                    className="px-6 py-2.5 bg-[#DDE0E2] min-w-[140px] text-gray-500 font-semibold rounded-md"
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
