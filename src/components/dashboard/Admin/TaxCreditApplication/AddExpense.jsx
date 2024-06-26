import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import AddProvinceDropdown from "./AddProvinceDropdown";
import AddCountryDropdown from "./AddCountryDropdown";
import axiosInstance from "@/auth_services/instance";
import AddTaxCreditApplType from "./AddTaxCreditApplType";
import AddApplSubType from "./AddTaxCreditApplSubType";

export default function AddExpense({ isOpen, setIsOpen, fn, state }) {
  const { convertProvinceId, convertCountryId, tableReload } = fn;
  const {
    assitanceList,
    provinceList,
    setAssitanceList,
    setProvinceList,
    countryList,
    province,
    setProvince,
    orgList,
  } = state;

  const [loading, setLoading] = useState(false);
  const [applType, setApplType] = useState("");
  const [applSubType, setApplSubType] = useState("");
  const [creditApplName, setCreditApplName] = useState("");
  const [provinceId, setProvinceId] = useState("");
  const [countryId, setCountryId] = useState("");
  const [orgId, setOrgId] = useState(1);

  const [isActive, setIsActive] = useState(true);

  const [errapplType, seterrapplType] = useState("");
  const [errSubType, seterrSubType] = useState("");
  const [errcreditApplName, seterrcreditApplName] = useState("");
  const [errCountry, seterrCountry] = useState("");
  const [errProvince, seterrProvince] = useState("");



  // const assitanceId = assitanceList[0]?.tax_assitance_id;

  const clearFields = () => {
    setApplType("");
    setApplSubType("");
    setProvinceId("");
    setCountryId("");
    setProvinceId("");
    setCreditApplName("");
    setIsActive(true);
    setIsOpen(false);
    setLoading(false);
  };

  const insertData = async () => {
    //---------- Validation Start
    seterrapplType("")
    seterrSubType("")
    seterrcreditApplName("")
    seterrCountry("")
    seterrProvince("")

    if (applType == "") seterrapplType("Tax credit application type required!")
    if (applSubType == "") seterrSubType("Tax credit sub type required!")
    if (creditApplName == "") seterrcreditApplName("Tax credit application name required!")
    if (countryId == "") seterrCountry("Tax credit sub type required!")
    if (provinceId == "") seterrProvince("Tax credit sub type required!")
    //---------- Validation End

    if (applType != "" && applSubType !="" && creditApplName != "" && countryId != "" && provinceId != "") {

      try {
        setLoading(true)
        const data = {
          type: applType,
          sub_type: applSubType,
          province_fid: provinceId,
          is_active: isActive,
          application_name: creditApplName,
          org_fid: orgId,
        };

        const res = await axiosInstance.post(process.env.API_SERVER + "assistance", data)
        if (res.status !== 200) throw error
        tableReload()
        clearFields()
      } catch (error) {
        setLoading(false)
        console.log(error.error_description || error.message)
      }
    }
  };

  useEffect(() => {
    const fetchProvince = async () => {
      const res = provinceList.filter(
        (province) => province.country_fid === countryId
      );
      setProvince(res);
    };
    fetchProvince();
    setProvinceId("");
  }, [countryId]);

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
            <Dialog.Panel className='mx-auto w-[620px] rounded-[15px] bg-white overflow-hidden'>
              <div className='p-6 bg-[#0CA8F8] text-white text-xl font-semibold'>
                Add Tax Credit Details
              </div>
              <div className='pt-5 px-5 pb-7'>
                <div className='space-y-3 text-sm'>
                  <label  className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">Tax Credit Application Type</label>
                  <AddTaxCreditApplType state={{ applType, setApplType, errapplType }} />

                  <div className='flex gap-3'>
                    <div className='w-full'>
                      <label  className="block mb-2 text-sm font-medium text-gray-700 dark:text-white ">Country</label>
                      <AddCountryDropdown
                        list={countryList}
                        state={{ countryId, setCountryId, errCountry }}
                        convertCountryId={convertCountryId}
                      />
                    </div>
                    {/* {applType !== "Federal" && */}
                    <div className='w-full'>
                      <label  className="block mb-2 text-sm font-medium text-gray-700 dark:text-white ">Province</label>
                      <AddProvinceDropdown
                        list={province}
                        state={{ provinceId, setProvinceId, errProvince }}
                        convertProvinceId={convertProvinceId}
                      />
                    </div>
                    {/* } */}
                  </div>
                  <div className='grid grid-cols-2 gap-3'>
                    <div className='w-full'>
                      <label  className="block mb-2 text-sm font-medium text-gray-700 dark:text-white ">Sub Part</label>
                      <AddApplSubType state={{ applSubType, setApplSubType, errSubType }} />
                    </div>
                    <div className='w-full'>
                      <label  className="block mb-2 text-sm font-medium text-gray-700 dark:text-white ">Tax Credit Application Name</label>
                      <input
                        type='text'
                        value={creditApplName}
                        onChange={(e) => setCreditApplName(e.target.value)}
                        placeholder='Tax Credit Application Name'
                        className={
                          errcreditApplName != ""
                            ? "px-5 h-[45px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500"
                            : "px-5 h-[45px] w-full bg-gray-200 rounded-md outline-none placeholder:text-gray-500"
                        }
                      />
                    </div>
                  </div>

                </div>
                <div className='mt-5 flex gap-x-4 justify-end'>
                  <button
                    className='px-6 py-2.5 min-w-[140px] bg-[#0CA8F8] text-white font-semibold rounded-md'
                    disabled={loading ? true : false}
                    onClick={insertData}
                  >
                    {loading ? "Saving..." : " Save"}
                  </button>
                  <button
                    className='px-6 py-2.5 bg-[#DDE0E2] min-w-[140px] text-gray-500 font-semibold rounded-md'
                    onClick={clearFields}
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
