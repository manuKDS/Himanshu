import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import axiosInstance from "@/auth_services/instance";
import AddCountryDropdown from "./AddCountryDropdown";
import AddProvinceDropdown from "./AddprovinceDropdown";
import AddCityDropdown from "./AddCityDropDown";
import { useSelector } from "react-redux";

export default function AddData({ isOpen, setIsOpen, fn, state }) {
  const { convertCountryId, convertCityId, convertProvinceId, tableReload } =
    fn;
  const {
    prodLocationList,
    setProdLocationList,
    countryList,
    provinceList,
    cityList,
  } = state;
  const redux_production_id = useSelector((state) => state.production.production_id)
  //console.log(prodLocationList);

  const [loading, setLoading] = useState(false);
  const [shootingDays, setShootingDays] = useState("");
  const [countryId, setCountryId] = useState("");
  const [filteredCities, setFilteredCities] = useState("");
  const [cityId, setCityId] = useState("");
  const [provinceId, setProvinceId] = useState("");
  const [province, setProvince] = useState([]);
  const [description, setDescription] = useState("");
  const [productionId, setProductionId] = useState(55);
  const [modifiedBy, setModifiedBy] = useState(1);
  const [orgId, setOrgId] = useState(1);

  const [errshootingDays, errsetShootingDays] = useState("");
  const [errcityId, errsetCityId] = useState("");
  const [errdescription, errsetDescription] = useState("");
  // const prodLocationId = prodLocationList[0]?.tbl_production_location_id;

  const clearFields = () => {
    setIsOpen(false);
    setLoading(false);
    setShootingDays("");
    setDescription("");
    setCountryId("");
    setProvinceId("");
    setCityId("");
  };

  const insertData = async () => {

    if (shootingDays == "")
      errsetShootingDays("Error")
    else
      errsetShootingDays("")

    if (cityId == "")
      errsetCityId("Error")
    else
      errsetCityId("")

    if (description == "")
      errsetDescription("Error")
    else
      errsetDescription("")

    if (shootingDays != "" && cityId != "" && description != "") {
      try {
        setLoading(true);

        const data = {
          shooting_days: shootingDays,
          description: description,
          city_fid: cityId,
          production_fid: redux_production_id,
          organization_fid: orgId,
          modified_by: modifiedBy,
        };

        const res = await axiosInstance.post(
          process.env.API_SERVER + "production_location",
          data
        );

        if (res.status !== 200) throw error;

        tableReload();

        // 1. Add data in state
        // setProdLocationList([selectedData, ...prodLocationList]);

        // 2. clear fields after adding data
        clearFields();
      } catch (error) {
        setLoading(false);
        console.log(error.error_description || error.message);
      }
    }
  };

  useEffect(() => {
    const fetchProvince = () => {
      const res = provinceList.filter(
        (province) => province.country_fid === countryId
      );
      setProvince(res);
    };

    fetchProvince();
    setProvinceId("");
    setCityId("");
  }, [countryId]);

  useEffect(() => {
    const fetchCityList = async () => {
      const res = cityList.filter((city) => city.province_fid === provinceId);
      setFilteredCities(res);
    };
    fetchCityList();
    setCityId("");
  }, [provinceId]);


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
                Add Location
              </div>
              <div className='px-5 pt-5 pb-6'>
                <div className='space-y-4 text-sm'>
                  <div className='flex gap-3'>
                    <div className='flex-1'>

                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">No of Days</label>
                      <input
                        type='number' min={0}
                        value={shootingDays}
                        onChange={(e) => setShootingDays(e.target.value)}
                        placeholder='No of Days'
                        className={
                          errshootingDays != ""
                            ? "px-5 h-[50px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500"
                            : "px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500"
                        }
                      />
                    </div>
                    <div className='flex-1'>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Country</label>

                      <AddCountryDropdown
                        state={{ countryId, setCountryId }}
                        list={countryList}
                        convertCountryId={convertCountryId}
                      />
                    </div>
                  </div>
                  <div className='flex gap-3'>
                    <div className='flex-1'>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Province</label>

                      <AddProvinceDropdown
                        state={{ provinceId, setProvinceId }}
                        list={province}
                        convertProvinceId={convertProvinceId}
                      />
                    </div>
                    <div className='flex-1'>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">City</label>

                      <AddCityDropdown
                        state={{ cityId, setCityId, errcityId }}
                        list={filteredCities}
                        convertCityId={convertCityId}
                      />
                    </div>
                  </div>
                  <div className='flex-1'>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Description</label>

                    <input
                      type='text'
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder='Description'
                      className={
                        errdescription != ""
                          ? "px-5 h-[50px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500"
                          : "px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500"
                      }
                    />
                  </div>
                </div>
                <div className='mt-5 flex gap-x-4 justify-end'>
                  <button
                    className='px-6 py-2.5 min-w-[140px] bg-[#0CA8F8] text-white font-semibold rounded-md'
                    disabled={loading ? true : false}
                    onClick={insertData}
                  >
                    {loading ? "Adding..." : " Add"}
                  </button>
                  <button
                    onClick={clearFields}
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
