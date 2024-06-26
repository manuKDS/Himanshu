import { Dialog, Transition } from "@headlessui/react";
import axiosInstance from "@/auth_services/instance";
import { Fragment, useEffect, useState } from "react";
import EditCityDropdown from "./EditCityDropdown";
import EditCountryDropdown from "./EditCountryDropdown";
import EditProvinceDropdown from "./EditProvinceDropdown";

export default function UpdateData({ isOpen, setIsOpen, data, state, fn }) {
  // console.log(exp_data);
  const [loading, setLoading] = useState(false);
  const [shootingDays, setShootingDays] = useState("");
  const [selectedProvince, setSelectedProvince] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [countryId, setCountryId] = useState("");
  const [cityId, setCityId] = useState("");
  const [provinceId, setProvinceId] = useState("");
  const [description, setDescription] = useState("");
  const [productionId, setProductionId] = useState(55);
  const [modifiedBy, setModifiedBy] = useState(1);
  const [orgId, setOrgId] = useState(1);
  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [provinceLoad, setProvinceLoad] = useState(true);

  useEffect(() => {
    setShootingDays(data.shooting_days);
    setCityId(data.city_fid);
    setCity(data.city_fid);
    setDescription(data.description);
    setProductionId(data.production_fid);
    setModifiedBy(data.modified_by);
    setOrgId(data.organization_fid);
  }, [isOpen, data]);

  const { convertCountryId, convertCityId, convertProvinceId, tableReload } = fn;
  const { setProdLocationList, countryList, provinceList, cityList } = state;

  const [errshootingDays, errsetShootingDays] = useState("");
  const [errcityId, errsetCityId] = useState("");
  const [errdescription, errsetDescription] = useState("");

  const updateData = async (prodLocationId) => {

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

        const res = await axiosInstance.put(
          process.env.API_SERVER + "production_location/" + prodLocationId,
          {
            shooting_days: shootingDays,
            description: description,
            city_fid: cityId,
            production_fid: productionId,
            organization_fid: orgId,
            modified_by: modifiedBy,
          }
        );

        if (res.status !== 200) throw error;

        tableReload();
        setIsOpen(false);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error.error_description || error.message);
      }
    }
  };

  const fetchData = () => {
    // Find province_fid from tbl_city column province_fid
    const findProvince = cityList.find((c) => c.city_id === city);

    setProvince(findProvince?.province_fid);
    setProvinceId(findProvince?.province_fid);

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
  }, [province, country, city]);

  useEffect(() => {
    const fetchCityList = async () => {
      const res = cityList.filter((c) => c.province_fid === province);
      setSelectedCities(res);
    };
    fetchCityList();
    if (!provinceLoad) {
      setProvinceId(province);
    }
    setProvinceLoad(true);
  }, [isOpen, province]);

  useEffect(() => {
    const fetchProvince = () => {
      const res = provinceList.filter((p) => p.country_fid === countryId);
      setSelectedProvince(res);
    };

    fetchProvince();
    setProvinceId("");
    setCityId("");
  }, [countryId]);

  useEffect(() => {
    const fetchCityList = () => {
      const res = cityList.filter((c) => c.province_fid === provinceId);
      setSelectedCities(res);
    };

    fetchCityList();

    if (!provinceLoad) {
      setCityId("");
    }

    // console.log({ provinceLoad: provinceLoad });
    setProvinceLoad(false);
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
                Update Location
              </div>
              <div className='p-5'>
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
                      <EditCountryDropdown
                        state={{
                          countryId,
                          setCountryId,
                        }}
                        list={countryList}
                        convertCountryId={convertCountryId}
                      />
                    </div>
                  </div>

                  <div className='flex gap-3'>
                    <div className='flex-1'>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Province</label>
                      <EditProvinceDropdown
                        state={{ provinceId, setProvinceId }}
                        list={selectedProvince}
                        convertProvinceId={convertProvinceId}
                      />
                    </div>
                    <div className='flex-1'>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">City</label>
                      <EditCityDropdown
                        state={{ cityId, setCityId }}
                        list={selectedCities}
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
                    onClick={() => updateData(data.tbl_production_location_id)}
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
