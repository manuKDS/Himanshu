import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import EditCountryDropdown from "./EditCountryDropdown";
import axiosInstance from "@/auth_services/instance";

export default function UpdateRegion({ isOpen, setIsOpen, data, state, fn }) {
  const regionData = data;

  // console.log(exp_data);
  const [loading, setLoading] = useState(false);

  const [region, setRegion] = useState(regionData.Region);
  const [orgId, setOrgId] = useState(regionData.org_fid);
  const [isActive, setIsActive] = useState(regionData.is_active);
  const [countryId, setCountryId] = useState(regionData.country_fid);

  const { regionList, setRegionList, countryList } = state;

  const { convertProvinceId, convertOrgTypeName, convertCountryId } = fn;

  useEffect(() => {
    setRegion(regionData.Region);
    setIsActive(regionData.is_active);
    setCountryId(regionData.country_fid);
    setOrgId(regionData.org_fid);
  }, [regionData]);

  const updateData = async (regionId) => {
    // 1. Add data in object

    const selectedData = {
      region_id: regionId,
      Region: region,
      country_fid: countryId,
      is_active: isActive,
      org_fid: orgId,
    };

    try {
      setLoading(true);
      const res = await axiosInstance.put(
        process.env.API_SERVER + "region/" + regionId,
        {
          Region: region,
          country_fid: countryId,
          is_active: isActive,
          org_fid: orgId,
        }
      );

      if (res.status !== 200) throw error;

      // 1. Add data in state
      setRegionList((prev) =>
        prev.map((item) => (item.region_id === regionId ? selectedData : item))
      );

      setLoading(false);
      setIsOpen(false);
    } catch (error) {
      setLoading(false);
      console.log(error.error_description || error.message);
    }
  };

  const handleDiscard = () => {
    setIsOpen(false)
    setRegion(regionData.Region);
    setIsActive(regionData.is_active);
    setCountryId(regionData.country_fid);
    setOrgId(regionData.org_fid);
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        open={isOpen}
        onClose={() => { handleDiscard() }}
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
              <div className='px-6 py-5 bg-[#0CA8F8] text-white text-xl font-semibold'>
                Update Region
              </div>
              <div className='pt-5 px-5 pb-7'>
                <div className='space-y-3 text-sm'>
                <label  className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">Add Region</label>
                  
                  <input
                    type='text'
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder='Region'
                    className='px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'
                  />
                  <label  className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">Country</label>
                  
                  <div className='flex gap-3'>
                    <EditCountryDropdown
                      list={countryList}
                      state={{ countryId, setCountryId }}
                      convertCountryId={convertCountryId}
                    />
                  </div>
                </div>
                <div className='mt-6 flex gap-x-4 justify-end'>
                  <button
                    className='px-6 py-2.5 min-w-[140px] bg-[#0CA8F8] text-white font-semibold rounded-md'
                    disabled={loading ? true : false}
                    onClick={() => updateData(regionData.region_id)}
                  >
                    {loading ? "Saving..." : " Save"}
                  </button>
                  <button
                    className='px-6 py-2.5 bg-[#DDE0E2] min-w-[140px] text-gray-500 font-semibold rounded-md'
                    onClick={() => { handleDiscard() }}
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
