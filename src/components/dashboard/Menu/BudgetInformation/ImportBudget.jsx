import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ImportBudgetDropdown from "./ImportBudgetDropDown";
import axiosInstance from "@/auth_services/instance";

export default function ImportBudget({ state, data }) {
  const { isOpen, setIsOpen, convetproductionIdToName, tableReload, productionId } = state;
  const { production } = data;

  const redux_production_id = useSelector((state) => state.production.production_id)

  const [loading, setLoading] = useState(false);
  // const [productionId, setProductionId] = useState(proId);

  // import data -----------
  const importData = async (redux_production_id1, productionId1) => {
    //console.log(redux_production_id1, productionId1)
    setLoading(true)
    const res = await axiosInstance.delete(
      process.env.API_SERVER + "production_budget/production/" + redux_production_id
    );

    const fetchProductionBudget = await axiosInstance.get(process.env.API_SERVER + "production_budget/production/" + productionId1);

    
    const BudgetArray = []

    fetchProductionBudget.data.map((budget) => {
      BudgetArray.push({
        expense_fid: budget.expense_fid,
        description: budget.description,
        vendor_fid: budget.vendor_fid,
        city_fid: budget.city_fid,
        currency_fid: budget.currency_fid,
        expected_spend_time: budget.expected_spend_time,
        amount: budget.amount,
        modified_by: budget.modified_by,
        production_fid: redux_production_id1,
        organization_fid: budget.organization_fid,
      })
    })

    const res11 = await axiosInstance.post(
      process.env.API_SERVER + "production_budget/production", { BudgetArray });

    tableReload();
    setLoading(false);
    setIsOpen(false)
  }


  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className='relative z-[101]'
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
                Import Budget
                {/* #{redux_production_id} / #{productionId} */}
              </div>
              <div className='px-5 pt-5 pb-6'>
                <div className='space-y-4 text-sm mb-16'>

                  <label className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">Import budget from <span className="text-blue-500">{convetproductionIdToName(productionId)}</span> </label>
                  {/* <ImportBudgetDropdown
                    state={{ productionId, setProductionId }}
                    list={production}
                    convetproductionIdToName={convetproductionIdToName}
                  /> */}
                  <label className="block mb-0 text-base font-medium text-red-500 dark:text-white ">Warnning!, import will remove existing list.</label>

                </div>
                <div className='mt-5 flex gap-x-4 justify-end'>
                  <button
                    className='px-6 py-2.5 min-w-[140px] bg-[#0CA8F8] text-white font-semibold rounded-md'
                    disabled={loading ? true : false}
                    onClick={() => importData(redux_production_id, productionId)}
                  >
                    {loading ? "Importing..." : " Import"}
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
