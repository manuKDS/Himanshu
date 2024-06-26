import { Dialog, Transition } from "@headlessui/react";
import axiosInstance from "@/auth_services/instance";
import { Fragment, useEffect, useState } from "react";

export default function UpdateExpense({ isOpen, setIsOpen, data, state, fn }) {
  let bankingInfo = data;

  // console.log(exp_data);
  const [loading, setLoading] = useState(false);
  const [bankName, setBankName] = useState("");
  const [accNumber, setAccNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [accHolderName, setAccHolderName] = useState("");
  const [productionId, setProductionId] = useState("");
  const [modifiedBy, setModifiedBy] = useState("");
  const [orgId, setOrgId] = useState(1);

  useEffect(() => {
    setBankName(bankingInfo.bank_name);
    setAccNumber(bankingInfo.account_no);
    setIfsc(bankingInfo.ifsc_code);
    setAccHolderName(bankingInfo.account_holder_name);
    setOrgId(bankingInfo.organization_fid);
    setProductionId(bankingInfo.production_fid);
    setModifiedBy(bankingInfo.modified_by);
  }, [isOpen, data]);

  const { bankingList, setBankingList } = state;
  const { convetExpTypeName, convertOrgTypeName, tableReload } = fn;

  const [errbankname, seterrbankname] = useState("");
  const [erraccnumber, seterraccnumber] = useState("");
  const [errifsc, seterrifsc] = useState("");
  const [erraccholdername, seterraccholdername] = useState("");


  const updateData = async (bankingInfoId) => {

    
    if (bankName == "")
      seterrbankname("Bank name required!");
    else
      seterrbankname("");

    if (accNumber == "")
      seterraccnumber("Account number required!");
    else
      seterraccnumber("");

    if (ifsc == "")
      seterrifsc("IFSC code required!");
    else
      seterrifsc("");

    if (accHolderName == "")
      seterraccholdername("Account holder name required!");
    else
      seterraccholdername("");


    if (      bankName != "" &&      accNumber != "" &&      ifsc != "" && accHolderName != ""    ) {
      setLoading(true);
      try {
        

        const res = await axiosInstance.put(
          process.env.API_SERVER + "banking_information/" + bankingInfoId,
          {
            bank_name: bankName,
            ifsc_code: ifsc,
            organization_fid: orgId,
            account_no: accNumber,
            account_holder_name: accHolderName,
            modified_by: modifiedBy,
            production_fid: productionId,
          }
        );

        if (res.status !== 200) throw error;

        tableReload();
        // 1. Add data in state
        // setBankingList((prev) =>
        //   prev.map((item) =>
        //     item.banking_info_id === bankingInfoId ? selectedData : item
        //   )
        // );

        setIsOpen(false);
       
      } catch (error) {
       
        console.log(error.error_description || error.message);
      }
      setLoading(false);
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
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
                Update Banking Information
              </div>
              <div className="p-5">
                <div className="space-y-4 text-sm">
                  <div className="flex gap-4">
                    <div className="w-full">
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">
                        Bank Name
                      </label>

                      <input
                        type="text"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="Bank Name"
                        className={
                            errbankname != ""
                            ? "px-5 h-[50px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500"
                            : "px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500"
                        }
                      />
                    </div>
                    <div className="w-full">
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">
                        Account Number
                      </label>

                      <input
                        type="number"
                        min={0}
                        value={accNumber}
                        onChange={(e) => setAccNumber(e.target.value)}
                        placeholder="Account Number"
                        className={
                            erraccnumber != ""
                            ? "px-5 h-[50px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500"
                            : "px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500"
                        }
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-full">
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">
                        IFSC Code
                      </label>

                      <input
                        type="text"
                        value={ifsc}
                        onChange={(e) => setIfsc(e.target.value)}
                        placeholder="IFSC Code"
                        className={
                            errifsc != ""
                            ? "px-5 h-[50px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500"
                            : "px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500"
                        }
                      />
                    </div>
                    <div className="w-full">
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">
                        Account Holder Name
                      </label>

                      <input
                        type="text"
                        value={accHolderName}
                        onChange={(e) => setAccHolderName(e.target.value)}
                        placeholder="Account Holder Name"
                        className={
                            erraccholdername != ""
                            ? "px-5 h-[50px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500"
                            : "px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500"
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex gap-x-4 justify-end">
                  <button
                    className="px-6 py-2.5 min-w-[140px] bg-[#0CA8F8] text-white font-semibold rounded-md"
                    onClick={() => updateData(bankingInfo.banking_info_id)}
                  >
                    {loading ? "Updating..." : "Update"}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
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
