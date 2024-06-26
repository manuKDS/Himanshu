import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import ExpTypeDropdown from "./ExpTypeDropdown";
import OrgDropdown from "./OrgDropdown";
import axiosInstance from "@/auth_services/instance";
import { useSelector } from "react-redux";
import { hasCookie, getCookie } from "cookies-next";
import jwt from "jsonwebtoken";

export default function AddExpense({ isOpen, setIsOpen, fn, state }) {
  const [user, setuser] = useState({});

  const { convetExpTypeName, convertOrgTypeName, tableReload } = fn;
  const { bankingList, setBankingList } = state;
  const redux_production_id = useSelector(
    (state) => state.production.production_id
  );

  const [loading, setLoading] = useState(false);
  const [bankName, setBankName] = useState("");
  const [accNumber, setAccNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [productionId, setProductionId] = useState(55);
  const [accHolderName, setAccHolderName] = useState("");
  const [modifiedBy, setModifiedBy] = useState(user.user_id);
  const [orgId, setOrgId] = useState(1);

  const [errbankname, seterrbankname] = useState("");
  const [erraccnumber, seterraccnumber] = useState("");
  const [errifsc, seterrifsc] = useState("");
  const [erraccholdername, seterraccholdername] = useState("");

  const bankingInfoId = bankingList[0]?.banking_info_id;

  const insertData = async () => {
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

    if (
      bankName != "" &&
      accNumber != "" &&
      ifsc != "" &&
      accHolderName != ""
    ) {

      try {

        setLoading(true);
        const data = {
          bank_name: bankName,
          account_no: accNumber,
          ifsc_code: ifsc,
          account_holder_name: accHolderName,
          production_fid: redux_production_id,
          organization_fid: orgId,
          modified_by: modifiedBy,
        };

        const res = await axiosInstance.post(
          process.env.API_SERVER + "banking_information",
          data
        );

        if (res.status !== 200) throw error;
       
        tableReload();

        // 1. Add data in state
        // setBankingList([selectedData, ...bankingList]);

        // 2. clear fields after adding data
        clearFields();
      } catch (error) {

        console.log(error.error_description || error.message);
      }
      setLoading(false);
    } else {
    }

  };

  useEffect(() => {
    let validToken = hasCookie("token");
    let getToken = getCookie("token");

    if (!validToken) {
      //window.location.href = "/login";
    } else {
      //console.log("token ", getToken)
      let decodeUser = jwt.decode(getToken);
      //console.log("decode ", decodeUser)
      setuser(decodeUser);
      setModifiedBy(decodeUser.user_id);
    }
  }, []);
  useEffect(() => {
    setBankName("");
    setAccNumber("");
    setIfsc("");
    setAccHolderName("");
  }, [isOpen]);

  const clearFields = () => {
    setIsOpen(false);
    setLoading(false);
    setBankName("");
    setAccNumber("");
    setIfsc("");
    setAccHolderName("");
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
                Add Banking Information
              </div>
              <div className="px-5 pt-5 pb-6">
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
                  {/* <input
                    type='text'
                    value={orgId}
                    onChange={(e) => setOrgId(e.target.value)}
                    placeholder='Org ID'
                    className='px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'
                  /> */}
                  {/* <OrgDropdown
                    state={{ orgId, setOrgId }}
                    list={orgList}
                    convertOrgTypeName={convertOrgTypeName}
                  /> */}
                </div>
                <div className="mt-5 flex gap-x-4 justify-end">
                  <button
                    className="px-6 py-2.5 min-w-[140px] bg-[#0CA8F8] text-white font-semibold rounded-md"
                    disabled={loading ? true : false}
                    onClick={insertData}
                  >
                    {loading ? "Adding..." : " Add"}
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
