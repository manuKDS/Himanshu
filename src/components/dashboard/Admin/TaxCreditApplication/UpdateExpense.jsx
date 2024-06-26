import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import OrgDropdown from "./OrgDropdown";
import EditCountryDropdown from "./EditCountryDropdown";
import EditProvinceDropdown from "./EditProvinceDropdown";
import axiosInstance from "@/auth_services/instance";
import AddTaxCreditApplType from "./AddTaxCreditApplType";
import AddApplSubType from "./AddTaxCreditApplSubType";

export default function UpdateExpense({ isOpen, setIsOpen, data, state, fn }) {
  const assistanceData = data;

  // console.log(exp_data);
  const [loading, setLoading] = useState(false);
  const [applType, setApplType] = useState(assistanceData.type);
  const [applSubType, setApplSubType] = useState(assistanceData.sub_type);
  const [creditApplName, setCreditApplName] = useState(
    assistanceData.application_name
  );
  const [provinceId, setProvinceId] = useState(assistanceData.province_fid);
  const [orgId, setOrgId] = useState(assistanceData.org_fid);
  const [isActive, setIsActive] = useState(assistanceData.is_active);
  const [countryId, setCountryId] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [province, setProvince] = useState([]);
  const [defaultCountry, setDefaultCountry] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [countryLoad, setCountryLoad] = useState(true);

    const {
    assitanceList,
    provinceList,
    setAssitanceList,
    setProvinceList,
    orgList,
    countryList,
    setCountryList,
    country,
    setCountry,
    pageCurrent,
  } = state;

  const {
    convertProvinceId,
    convertOrgTypeName,
    convertCountryId,
    tableReload,
  } = fn;

  useEffect(() => {
    setApplType(assistanceData.type);
    setApplSubType(assistanceData.sub_type);
    setCreditApplName(assistanceData.application_name);
    setProvinceId(assistanceData.province_fid);
    setProvince(assistanceData.province_fid);
    setIsActive(assistanceData.is_active);
    setOrgId(assistanceData.org_fid);
  }, [isOpen, assistanceData]);

  const [errapplType, seterrapplType] = useState("");
  const [errSubType, seterrSubType] = useState("");
  const [errcreditApplName, seterrcreditApplName] = useState("");
  const [errCountry, seterrCountry] = useState("");
  const [errProvince, seterrProvince] = useState("");

  const updateData = async (assistanceId) => {
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

    try {
      setLoading(true);
      const res = await axiosInstance.put(
        process.env.API_SERVER + "assistance/" + assistanceId,
        {
          type: applType,
          sub_type: applSubType,
          province_fid: provinceId,
          is_active: isActive,
          application_name: creditApplName,
          org_fid: orgId,
        }
      );

      if (res.status !== 200) throw error;

      tableReload();

      // 1. Add data in state
      // setAssitanceList((prev) =>
      //   prev.map((item) =>
      //     item.tax_assitance_id === assistanceId ? selectedData : item
      //   )
      // );

      setLoading(false);
      setIsOpen(false);
    } catch (error) {
      setLoading(false);
      console.log(error.error_description || error.message);
    }
  };

  const fetchData = () => {
    // Find country_fid from tbl_province column country_fid
    const findCountry = provinceList.find((p) => p.province_id === province);

    // setCountryId(findCountry?.country_fid);
    setCountry(findCountry?.country_fid);
    setCountryId(findCountry?.country_fid);
  };

  useEffect(() => {
    // Find province from tbl_province column country_fid
    const res = provinceList.filter((p) => p.country_fid === country);
    setSelectedProvince(res);

    fetchData();
  }, [province, country]);

  useEffect(() => {
    const fetchProvince = () => {
      const res = provinceList.filter((p) => p.country_fid === countryId);
      setSelectedProvince(res);
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
                Update Tax Credit Details
              </div>
              <div className='p-5'>
                <div className='space-y-3 text-sm'>
                  <label  className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">Tax Credit Application Type</label>
                  <AddTaxCreditApplType state={{ applType, setApplType, errapplType }} />
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
                  <div className='grid grid-cols-2 gap-3'>
                    <div className='w-full'>
                      <label  className="block mb-2 text-sm font-medium text-gray-700 dark:text-white ">Country</label>
                      <EditCountryDropdown
                        list={countryList}
                        state={{ countryId, setCountryId }}
                        convertCountryId={convertCountryId}
                        defaultSelectedCountry={selectedCountry}
                      />
                    </div>
                    <div className='w-full'>
                      <label  className="block mb-2 text-sm font-medium text-gray-700 dark:text-white ">Province</label>
                      <EditProvinceDropdown
                        list={selectedProvince}
                        state={{ provinceId, setProvinceId }}
                        convertProvinceId={convertProvinceId}
                      />
                    </div>
                  </div>
                  {/* <OrgDropdown
                    state={{ orgId, setOrgId }}
                    list={orgList}
                    convertOrgTypeName={convertOrgTypeName}
                  /> */}
                </div>
                <div className='mt-6 flex gap-x-4 justify-end'>
                  <button
                    className='px-6 py-2.5 min-w-[140px] bg-[#0CA8F8] text-white font-semibold rounded-md'
                    disabled={loading ? true : false}
                    onClick={() => updateData(assistanceData.tax_assitance_id)}
                  >
                    {loading ? "Saving..." : " Save"}
                  </button>
                  <button
                    className='px-6 py-2.5 bg-[#DDE0E2] min-w-[140px] text-gray-500 font-semibold rounded-md'
                    onClick={() => setIsOpen(false)}
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
