import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import axiosInstance from "@/auth_services/instance";
import CountryDropdown from "./CountryDropdown";
import ProvinceDropdown from "./provinceDropdown";
import CityDropdown from "./CityDropDown";

export default function AddData({ isOpen, setIsOpen, fn, state }) {
  const { convertCountryId, convertProvinceId, convertCityId, tableReload } =
    fn;
  const {
    organizationList,
    setOrganizationList,
    provinceList,
    cityList,
    countryList,
  } = state;

  const [loading, setLoading] = useState(false);
  const [orgAddress, setOrgAddress] = useState("");
  const [province, setProvince] = useState("");
  const [filteredCities, setFilteredCities] = useState("");
  const [orgName, setOrgName] = useState("");
  const [countryId, setCountryId] = useState("");
  const [provinceId, setProvinceId] = useState("");
  const [cityId, setCityId] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [icon, setIcon] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [zipcode, setZipcode] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  // const orgId = organizationList[0]?.org_id;

  const clearFields = () => {
    setOrgAddress("");
    setOrgName("");
    setWebsiteUrl("");
    setIcon("");
    setContact("");
    setEmail("");
    setZipcode("");
    setCountryId("");
    setProvinceId("");
    setCityId("");
    setIsOpen(false);
    setLoading(false);
    setErrorMessage("");
  };

  const insertData = async () => {
    // const selectedData = {
    //   org_id: orgId + 1,
    //   org_name: orgName,
    //   org_address: orgAddress,
    //   city_fid: cityId,
    //   website_url: websiteUrl,
    //   icon: icon,
    //   contact_no: contact,
    //   email: email,
    //   zipcode: zipcode,
    // };

    try {
      setLoading(true);
      if (orgName === "" || websiteUrl === "" || orgAddress === "" || email === "" || countryId === "" || contact === "" || provinceId === "" || zipcode === "" || cityId === "") {
        setErrorMessage("All feild are required");
        setLoading(false);
      } else {
        const data = {
          org_name: orgName,
          org_address: orgAddress,
          city_fid: cityId,
          website_url: websiteUrl,
          icon: icon,
          contact_no: contact,
          email: email,
          zipcode: zipcode,
        };

        const res = await axiosInstance.post(
          process.env.API_SERVER + "organization",
          data
        );

        if (res.status !== 200) throw error;

        tableReload();

        // 1. Add data in state
        // setOrganizationList([selectedData, ...organizationList]);

        // 2. clear fields after adding data
        clearFields();
      }

    } catch (error) {
      setLoading(false);
      console.log(error.error_description || error.message);
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
                Add Organization
              </div>
              <div className='px-5 pt-5 pb-6'>
                <div className='space-y-4 text-sm'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='w-full'>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Organization Name</label>
                      <input
                        type='text'
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        placeholder='Organization Name'
                        className={(errorMessage && orgName === "") ? 'px-5 h-[50px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' : 'px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'}
                      />
                    </div>
                    <div className='w-full'>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Website Url</label>
                      <input
                        type='text'
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        placeholder='Website Url'
                        className={(errorMessage && websiteUrl === "") ? 'px-5 h-[50px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' : 'px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'}
                      />
                    </div>

                  </div>

                  <div className='grid grid-cols-1 gap-4'>
                    <div className='w-full'>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Address</label>
                      <input
                        type='text'
                        value={orgAddress}
                        onChange={(e) => setOrgAddress(e.target.value)}
                        placeholder='Organization Address'
                        className={(errorMessage && orgAddress === "") ? 'px-5 h-[50px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' : 'px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'}
                      />
                    </div>
                    {/* <div className='w-full'>
                      <label  className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Icon</label>
                      <input
                        type='text'
                        value={icon}
                        onChange={(e) => setIcon(e.target.value)}
                        placeholder='Icon'
                        className='px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'
                      />
                    </div> */}
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div className='w-full'>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Email</label>
                      <input
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='Email'
                        className={(errorMessage && email === "") ? 'px-5 h-[50px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' : 'px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'}
                      />
                    </div>
                    <div className='w-full'>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Country</label>
                      <CountryDropdown
                        state={{ countryId, setCountryId }}
                        list={countryList}
                        convertCountryId={convertCountryId}
                        error={errorMessage && countryId === ""}
                      />
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div className='w-full'>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Contact No</label>
                      <input
                        type='number' min={0}
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder='Contact No'
                        className={(errorMessage && contact === "") ? 'px-5 h-[50px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' : 'px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'}
                      />
                    </div>
                    <div className='w-full'>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Province</label>
                      <ProvinceDropdown
                        state={{ provinceId, setProvinceId }}
                        list={province}
                        convertProvinceId={convertProvinceId}
                        error={errorMessage && provinceId === ""}
                      />
                    </div>
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='w-full'>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Zip code</label>
                      <input
                        type='number' min={0}
                        value={zipcode}
                        onChange={(e) => setZipcode(e.target.value)}
                        placeholder='Zip code'
                        className={(errorMessage && zipcode === "") ? 'px-5 h-[50px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' : 'px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'}
                      />
                    </div>
                    <div className='w-full'>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">City</label>
                      <CityDropdown
                        state={{ cityId, setCityId }}
                        list={filteredCities}
                        convertCityId={convertCityId}
                        error={errorMessage && cityId === ""}
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
