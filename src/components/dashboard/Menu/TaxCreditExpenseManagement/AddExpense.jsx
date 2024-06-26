import { Dialog, Transition } from "@headlessui/react";
import { supabase } from "@/lib/supabaseClient";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TaxAssistanceDropDown from "./TaxAssistanceDropDown";
import axiosInstance from "@/auth_services/instance";

export default function AddExpense({ isOpen, setIsOpen, fn, state, tableReload }) {
  const { convetExpTypeName, convertOrgTypeName } = fn;
  const { creditTypeList, setCreditTypeList, provinceList, orgList, setProvinceList, assitanceList
  } = state;
  const redux_production_id = useSelector((state) => state.production.production_id)

  const [loading, setLoading] = useState(false);
  const [appType, setAppType] = useState("");
  const [appSubType, setappSubType] = useState("");
  const [provinceId, setProvinceId] = useState("");
  const [provinceName, setProvinceName] = useState("");
  const [cityId, setCityId] = useState("");
  const [orgId, setOrgId] = useState(1);
  const [appName, setAppName] = useState("");

  const [taxassistanceList, settaxassistanceList] = useState(assitanceList);
  const [taxassistance, settaxassistance] = useState("");

  const [errapplType, seterrapplType] = useState("");

  const creditId = creditTypeList[0]?.tax_credit_type_id;

  useEffect(() => {
    //console.log(taxassistance)
    setAppType(taxassistance)
    const tax_ass = assitanceList.find((item) => item.tax_assitance_id === taxassistance);

    setappSubType(tax_ass?.sub_type)
    setAppName(tax_ass?.application_name)
    const proId = tax_ass?.province_fid
    setProvinceId(proId)

    const province_data = provinceList.find((item) => item.province_id === proId);
    setProvinceName(province_data?.province)
  }, [taxassistance])


  // convert tax_assistance_id to type
  function convertTaxAssTypeName(tax_ass_id) {
    const tax_ass = assitanceList.find((item) => item.tax_assitance_id === tax_ass_id);
    return tax_ass?.type;
  }

  const selectedData = {
    tax_credit_type_id: creditId + 1,
    app_type: appType,
    app_sub_type: appSubType,
    province_fid: provinceId,
    city_fid: cityId,
    org_fid: orgId,
    production_fid: redux_production_id,
  };

  const clearFields = () => {
    setAppType("");
    setappSubType("");
    setProvinceId("");
    setProvinceName("");
    setCityId("");
    setOrgId("");
    setAppName("")
  };

  const insertData = async () => {
    //---------- Validation Start
    seterrapplType("")

    if (taxassistance == "") seterrapplType("Tax credit application type required!")

    //---------- Validation End

    if (taxassistance != "") {

      try {

        setLoading(true);

        const data = {
          app_type: appType,
          // app_sub_type: appSubType,
          province_fid: provinceId,
          // city_fid: cityId,
          org_fid: orgId,
          production_fid: redux_production_id,
          created_at: new Date(),
        };


        const res = await axiosInstance.post(process.env.API_SERVER + "tax_credit_type", data);

        if (res.status !== 200) throw error;


        // 1. Add data in state
        tableReload()
        //setCreditTypeList([selectedData, ...creditTypeList]);

        // 2. clear fields after adding data
        setIsOpen(false);
        setLoading(false);
        clearFields();
      } catch (error) {
        setLoading(false);
        console.log(222)
        console.log(error.error_description || error.message);
      }
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
                Tax Credit Expense Management
              </div>
              <div className='p-5'>
                <div className='space-y-3 text-sm'>
                  <label className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">Tax Credit Application Type</label>
                  <TaxAssistanceDropDown
                    state={{ taxassistance, settaxassistance, errapplType }}
                    list={taxassistanceList}
                    convertTaxAssTypeName={convertTaxAssTypeName}
                  />
                  <label className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">Sub Type</label>
                  <input
                    type='text'
                    defaultValue={appSubType}
                    // onChange={(e) => setAppType(e.target.value)}
                    placeholder='Sub Type'
                    className='px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'
                  />
                  <label className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">Province</label>
                  <input
                    type='text'
                    defaultValue={provinceName}
                    // onChange={(e) => setAppType(e.target.value)}
                    placeholder='Province'
                    className='px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'
                  />
                  <label className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">Tax Credit Application Name</label>
                  <input
                    type='text'
                    defaultValue={appName}
                    // onChange={(e) => setAppType(e.target.value)}
                    placeholder='Tax Credit Application Name'
                    className='px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'
                  />

                </div>
                <div className='mt-4 flex gap-x-4 justify-end'>
                  <button
                    className='px-6 py-2.5 min-w-[140px] bg-[#0CA8F8] text-white font-semibold rounded-md'
                    disabled={loading ? true : false}
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