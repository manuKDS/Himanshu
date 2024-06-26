import { Dialog, Transition } from "@headlessui/react";
import { supabase } from "@/lib/supabaseClient";
import { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/auth_services/instance";
import moment from "moment";
import CityDropDown from "./CityDropDown";
import VendorTypeDropDown from "./VendorTypeDropDown";
import CountryDropdown from "./CountryDropDown";
import ProvinceDropDown from "./ProvinceDropDown";

export default function AddData({ isOpen, setIsOpen, data, vendorId, tableReload, state }) {

  const { vendor_typesLst, citysLst, provinceLst, countryLst } = state;

  const [org_fid, setorg_fid] = useState(data.org_fid);
  const [updated_by, setupdated_by] = useState(data.updated_by);
  const [vendor, setvendor] = useState(data.name);

  // foreign key fields
  const [vendor_type_fid, setvendor_type_fid] = useState(data.vendor_type_fid);
  const [city_fid, setcity_fid] = useState(data.city_fid);
  const [province_fid, setprovince_fid] = useState("");
  const [country_fid, setcountry_fid] = useState("");

  // optional fields
  const [address, setaddress] = useState(data.address);
  const [phone, setphone] = useState(data.phone);
  const [email, setemail] = useState(data.email);
  const [url, seturl] = useState(data.url);

  // const {vendor_typesLst, citysLst,  provinceLst, countryLst} = state;
  // list to use multiple time

  const [citys, setcitys] = useState(citysLst);
  const [citysList, setcitysList] = useState([]);
  const [provinces, setprovinces] = useState(provinceLst);
  const [provincesList, setprovincesList] = useState([]);
  const [countries, setcountries] = useState(countryLst);
  const [vendor_types, setvendor_types] = useState(vendor_typesLst);
  const router = useRouter();
  // error handler
  const [errorvendor, seterrorvendor] = useState("")
  const [errorvendor_type, seterrorvendor_type] = useState("")
  const [errorcity, seterrorcity] = useState("")
  const [errorprovince, seterrorprovince] = useState("")
  const [errorcountry, seterrorcountry] = useState("")

  useEffect(() => {

    reloaddata()

  }, [isOpen, data])

  const reloaddata = async () => {
    setorg_fid(data.org_fid);
    setupdated_by(data.updated_by);
    setvendor(data.name);

    // foreign key fields
    setvendor_type_fid(data.vendor_type_fid);
    setcity_fid(data.city_fid);

    // optional fields
    setaddress(data.address);
    setphone(data.phone);
    setemail(data.email);
    seturl(data.url);

    const resCity = await axiosInstance.get(process.env.API_SERVER + "city/" + city_fid)
    const province_fid = resCity.data[0].province_fid
    //console.log("province_fid-"+ province_fid)

    const resProvince = await axiosInstance.get(process.env.API_SERVER + "province/" + province_fid)
    const country_fid = resProvince.data[0].country_fid
    //console.log("country_fid-"+ country_fid)

    setcountry_fid(country_fid);
    setprovince_fid(province_fid);
    //setcity_fid(city_fid)
  }


  useEffect(() => {
    fecthProvince()
    setprovince_fid("");
    setcity_fid("");
  }, [country_fid])

  const fecthProvince = async () => {
    const resProvince = provinces.filter(province => province.country_fid === country_fid)
    setprovincesList(resProvince)
    setprovince_fid(province_fid)
  }

  useEffect(() => {
    fecthCity()
  }, [province_fid])

  const fecthCity = async () => {
    const resCity = citys.filter(City => City.province_fid === province_fid)
    setcitysList(resCity)
    setcity_fid(city_fid)
  }

  const insertData = async () => {

    // Validation code 
    if (vendor == "") {
      seterrorvendor("Vendor name required!")
    } else {
      seterrorvendor("")
    }

    if (vendor_type_fid == "") {
      seterrorvendor_type("Vendor type required!")
    } else {
      seterrorvendor_type("")
    }

    if (city_fid == "") {
      seterrorcity("City required!")
    } else {
      seterrorcity("")
    }

    if (vendor != "" && vendor_type_fid != "" && city_fid != "") {
      const vendor_changecase = vendor.charAt(0).toUpperCase() + vendor.slice(1)
      const newdata = {
        updated_by,
        name: vendor_changecase,
        vendor_type_fid,
        city_fid,
        org_fid,
        address,
        phone,
        email,
        url
      };


      try {
        const res = await axiosInstance.put(process.env.API_SERVER + "vendor/" + vendorId, newdata);
        setorg_fid(1);
        setupdated_by(1);
        setvendor("");
        //setvendor_type_fid("");
        //setcity_fid("");
        setaddress("");
        setphone("");
        setemail("");
        seturl("");

      } catch (error) {
        console.log(error);
      }
      tableReload();
      //router.refresh();
      setIsOpen(false);
    }
  }

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
              <div className='p-6 bg-blue-500 text-white text-xl font-semibold'>
                Update Vendor
              </div>
              <div className='p-5'>
                <div className='space-y-3 text-sm'>
                  <label  className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">Vendor Name</label>

                  <input
                    type='text'
                    value={vendor}
                    onChange={(e) => { setvendor(e.target.value); seterrorvendor("") }}
                    placeholder='Vendor Name'
                    className={errorvendor != "" ? 'px-5 h-[45px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' :
                      'px-5 h-[45px] w-full bg-gray-200 rounded-md outline-none placeholder:text-gray-500'}
                  />

                  <label  className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">Vendor Type</label>
                  <VendorTypeDropDown
                    state={{ vendor_type_fid, setvendor_type_fid, errorvendor_type }}
                    list={vendor_types}
                  />

                  {/* <label  className="block mb-2 text-sm font-medium text-red-500 dark:text-white float-right">{errorcity}</label> */}
                  {/* <CityDropDown
                    state={{ city_fid, setcity_fid, errorcity }}
                    list={citys}
                  /> */}

                  <div className="grid grid-cols-3 gap-2 ">
                    <div>
                      <label  className="block mb-2 text-sm font-medium text-gray-700 dark:text-white ">Country</label>
                      <CountryDropdown
                        state={{ country_fid, setcountry_fid, errorcountry }}
                        list={countries}
                      />
                    </div>
                    <div>
                      <label  className="block mb-2 text-sm font-medium text-gray-700 dark:text-white ">Province</label>
                      <ProvinceDropDown
                        state={{ province_fid, setprovince_fid, errorprovince }}
                        list={provincesList}
                      />

                    </div>
                    <div>
                      <label  className="block mb-2 text-sm font-medium text-gray-700 dark:text-white ">City</label>
                      <CityDropDown
                        state={{ city_fid, setcity_fid, errorcity }}
                        list={citysList}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 ">
                    <div>
                      <label  className="block mb-2 text-sm font-medium text-gray-700 dark:text-white ">Address</label>
                      <input
                        type='text'
                        value={address}
                        onChange={(e) => setaddress(e.target.value)}
                        placeholder='Address'
                        className='px-5 h-[45px] w-full bg-gray-200 rounded-md outline-none placeholder:text-gray-500'
                      />
                    </div>
                    <div>
                      <label  className="block mb-2 text-sm font-medium text-gray-700 dark:text-white ">Phone / Mobile</label>
                      <input
                        type='number' min={0}
                        value={phone}
                        onChange={(e) => setphone(e.target.value)}
                        placeholder='Phone / Mobile'
                        className='px-5 h-[45px] w-full bg-gray-200 rounded-md outline-none placeholder:text-gray-500'
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 ">
                    <div>
                      <label  className="block mb-2 text-sm font-medium text-gray-700 dark:text-white ">Email</label>
                      <input
                        type='text'
                        value={email}
                        onChange={(e) => setemail(e.target.value)}
                        placeholder='Email'
                        className='px-5 h-[45px] w-full bg-gray-200 rounded-md outline-none placeholder:text-gray-500'
                      />
                    </div>
                    <div>
                      <label  className="block mb-2 text-sm font-medium text-gray-700 dark:text-white ">Url</label>
                      <input
                        type='text'
                        value={url}
                        onChange={(e) => seturl(e.target.value)}
                        placeholder='Url'
                        className='px-5 h-[45px] w-full bg-gray-200 rounded-md outline-none placeholder:text-gray-500'
                      />
                    </div>
                  </div>

                </div>
                <div className='mt-4 flex gap-x-4 justify-end'>
                  <button
                    className='px-6 py-2.5 bg-blue-500 text-white rounded-md'
                    onClick={insertData}
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className='px-6 py-2.5 bg-gray-400 text-white rounded-md'
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
