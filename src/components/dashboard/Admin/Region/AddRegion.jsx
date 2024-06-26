import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import axiosInstance from "@/auth_services/instance";
import AddCountryDropdown from "./AddCountryDropdown";

export default function AddCityCountryDropdown({
  isOpen,
  setIsOpen,
  fn,
  state,
  tableReload
}) {
  const { countryList } = state;

  const { convertCountryId } = fn;

  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState("");
  const [countryId, setCountryId] = useState("");
  const [orgId, setOrgId] = useState(1);

  const [isActive, setIsActive] = useState(true);

  const clearFields = () => {
    setIsOpen(false);
    setLoading(false);
    setRegion("");
    setCountryId("");
  };

  const insertData = async () => {
    try {
      setLoading(true);

      const data = {
        Region: region,
        is_active: isActive,
        country_fid: countryId,
        org_fid: orgId,
      };

      const res = await axiosInstance.post(process.env.API_SERVER + "region", data);

      if (res.status !== 200) throw error;
      clearFields();
      tableReload()
    } catch (error) {
      setLoading(false);
      console.log(error.error_description || error.message);
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        open={isOpen}
        onClose={() => { clearFields() }}
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
                Add Region
              </div>
              <div className='pt-5 px-5 pb-7'>
                <div className='space-y-3 text-sm'>
                  <label  className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">Add Region</label>
                  <input
                    type='text'
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder='Add Region'
                    className='px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'
                  />

                  <label  className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">Country</label>
                  <AddCountryDropdown
                    list={countryList}
                    state={{ countryId, setCountryId }}
                    convertCountryId={convertCountryId}
                  />
                </div>
                <div className='mt-6 flex gap-x-4 justify-end'>
                  <button
                    className='px-6 py-2.5 min-w-[140px] bg-[#0CA8F8] text-white font-semibold rounded-md'
                    disabled={loading ? true : false}
                    onClick={insertData}
                  >
                    {loading ? "Adding..." : " Add"}
                  </button>
                  <button
                    className='px-6 py-2.5 bg-[#DDE0E2] min-w-[140px] text-gray-500 font-semibold rounded-md'
                    onClick={() => { clearFields() }}
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
