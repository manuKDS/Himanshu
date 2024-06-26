import { Dialog, Transition } from "@headlessui/react";
import { supabase } from "@/lib/supabaseClient";
import { Fragment, useEffect, useState } from "react";
import TaxAssistanceDropDown from "./TaxAssistanceDropDown";

export default function UpdateExpense({ isOpen, setIsOpen, data, state, fn, tax_credit_id, tableReload }) {
  let credit_data = data;
  const { assitanceList, creditTypeList, setCreditTypeList, provinceList, setProvinceList } = state;
  // console.log(exp_data);
  const [loading, setLoading] = useState(false);

  const [appType, setappType] = useState(credit_data.app_type)
  const [appSubType, setappSubType] = useState(credit_data.app_sub_type)
  //const [appSubTypeId, setappSubTypeId] = useState(credit_data.app_sub_type)
  const [provinceId, setProvinceId] = useState(credit_data.province_fid);
  const [provinceName, setProvinceName] = useState("");
  const [cityId, setCityId] = useState("");
  const [orgId, setOrgId] = useState(1);
  const [appName, setAppName] = useState("");

  const [taxassistanceList, settaxassistanceList] = useState(assitanceList);
  const [taxassistance, settaxassistance] = useState(credit_data.app_type);
  const [errapplType, seterrapplType] = useState("");

  useEffect(() => {
    setappType(credit_data.app_type);
    setappSubType(credit_data.app_sub_type);
    setProvinceId(credit_data.province_fid);
    setCityId(credit_data.city_fid);
    setOrgId(credit_data.org_fid);
  }, [isOpen, data]);


  const { convetExpTypeName, convertOrgTypeName } = fn;

  useEffect(() => {
    //console.log(taxassistance)
    setappType(taxassistance)
    const tax_ass = assitanceList.find((item) => item.tax_assitance_id === taxassistance);

    setappSubType(tax_ass?.sub_type)
    //setappSubTypeId(tax_ass?.sub_type)
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

  const updateData = async (credit_id) => {
    // 1. Add data in object
    const selectedData = {
      app_type: appType,
      // app_sub_type: appSubType,
      province_fid: provinceId,
      // city_fid: cityId,
      // org_fid: orgId,
    };

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("tbl_tax_credit_type")
        .update(selectedData)
        .eq("tax_credit_type_id", tax_credit_id)
        .select();

      //console.log("Data ",data);
      tableReload()
      setIsOpen(false)

    } catch (error) {
      console.log(error.error_description || error.message);
    }
    setLoading(false);
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
                Update Tax Credit Expense Management
              </div>
              <div className='p-5'>
                <div className='space-y-3 text-sm'>
                  <label  className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">Tax Credit Application Type</label>
                  <TaxAssistanceDropDown
                    state={{ taxassistance, settaxassistance,errapplType}}
                    list={taxassistanceList}
                    convertTaxAssTypeName={convertTaxAssTypeName}
                  />
                  <label  className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">Sub Type</label>
                  <input
                    type='text'
                    defaultValue={appSubType}
                    // onChange={(e) => setAppType(e.target.value)}
                    placeholder='Sub Type'
                    className='px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'
                  />
                  <label  className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">Province</label>
                  <input
                    type='text'
                    defaultValue={provinceName}
                    // onChange={(e) => setAppType(e.target.value)}
                    placeholder='Province'
                    className='px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'
                  />
                  <label  className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">Tax Credit Application Name</label>
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
                    onClick={() => updateData(tax_credit_id)}
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
