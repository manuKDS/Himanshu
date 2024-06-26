import { Dialog, Transition } from "@headlessui/react";
import axiosInstance from "@/auth_services/instance";
import { Fragment, useEffect, useState } from "react";
import CityDropdown from "./CityDropDown";
import CountryDropdown from "./CountryDropdown";
import ProvinceDropdown from "./provinceDropdown";

export default function UpdateData({ isOpen, setIsOpen, data, state, fn }) {
  // console.log(exp_data);
  const [loading, setLoading] = useState(false);
  const [orgAddress, setOrgAddress] = useState("");
  const [selectedProvince, setSelectedProvince] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [orgName, setOrgName] = useState("");
  const [countryId, setCountryId] = useState("");
  const [provinceId, setProvinceId] = useState("");
  const [cityId, setCityId] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [icon, setIcon] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [zipcode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [provinceLoad, setProvinceLoad] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setOrgAddress(data.org_address);
    setCityId(data.city_fid);
    setCity(data.city_fid);
    setOrgName(data.org_name);
    setWebsiteUrl(data.website_url);
    setContact(data.contact_no);
    setEmail(data.email);
    setIcon(data.icon);
    setZipCode(data.zipcode);
  }, [isOpen, data]);

  const { convertCountryId, convertProvinceId, convertCityId, tableReload } =
    fn;
  const {
    organizationList,
    setOrganizationList,
    provinceList,
    cityList,
    countryList,
  } = state;

  const updateData = async (orgId) => {
    // 1. Add data in object
    // const selectedData = {
    //   org_id: orgId,
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
        const res = await axiosInstance.put(
          process.env.API_SERVER + "organization/" + orgId,
          {
            org_name: orgName,
            org_address: orgAddress,
            city_fid: cityId,
            website_url: websiteUrl,
            icon: icon,
            contact_no: contact,
            email: email,
            zipcode: zipcode,
          }
        );

        if (res.status !== 200) throw error;

        tableReload();
        // 1. Add data in state
        // setOrganizationList((prev) =>
        //   prev.map((item) => (item.org_id === orgId ? selectedData : item))
        // );

        setIsOpen(false);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error.error_description || error.message);
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

    console.log({ provinceLoad: provinceLoad });
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
                Update Organization
              </div>
              <div className='p-5'>
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
                        className={(errorMessage && orgName === "") ? 'px-5 h-[50px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' : 'px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'}
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
                        list={selectedProvince}
                        convertProvinceId={convertProvinceId}
                        error={errorMessage && countryId === ""}
                      />
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div className='w-full'>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Zip code</label>
                      <input
                        type='number' min={0}
                        value={zipcode}
                        onChange={(e) => setZipCode(e.target.value)}
                        placeholder='Zipcode'
                        className={(errorMessage && zipcode === "") ? 'px-5 h-[50px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' : 'px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'}
                      />
                    </div>
                    <div className='w-full'>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">City</label>
                      <CityDropdown
                        state={{ cityId, setCityId }}
                        list={selectedCities}
                        convertCityId={convertCityId}
                        error={errorMessage && cityId === ""}
                      />
                    </div>
                  </div>

                </div>
                <div className='mt-5 flex gap-x-4 justify-end'>
                  <button
                    className='px-6 py-2.5 min-w-[140px] bg-[#0CA8F8] text-white font-semibold rounded-md'
                    onClick={() => updateData(data.org_id)}
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
