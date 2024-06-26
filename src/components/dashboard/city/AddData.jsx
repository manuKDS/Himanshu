import { Dialog, Transition } from "@headlessui/react";
import { supabase } from "@/lib/supabaseClient";
import { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/auth_services/instance";
import moment from "moment";
import CountryDropdown from "./CountryDropDown";
import ProvinceDropDown from "./ProvinceDropDown";

export default function AddData({ isOpen, setIsOpen, tableReload }) {
  const [city, setcity] = useState("");
  const [province_fid, setprovince_fid] = useState("");
  const [country_fid, setcountry_fid] = useState("");
  const [is_active, setIs_active] = useState(true);
  const [is_rural, setis_rural] = useState(true);
  const [provinces, setprovinces] = useState([]);
  const [provincesList, setprovincesList] = useState([]);
  const [countries, setCountries] = useState([]);
  const router = useRouter();

  const [errorcity, seterrorcity] = useState("")
  const [errorprovince_fid, seterrorprovince_fid] = useState("");
  const [errorprovince, seterrorprovince] = useState("")
  const [errorcountry, seterrorcountry] = useState("")

  // reset all on close
  const setClose = () => {
    seterrorcity("")
    setprovince_fid("");
    setcountry_fid("");
    seterrorprovince_fid("");
    setIsOpen(false)
  }


  // fetch data of Country table 
  useEffect(() => {

    const fetchCountry = async () => {

      const res = await axiosInstance.get(process.env.API_SERVER + "country")
      const resData = res.data.sort(function (a, b) {
        // sort country accending order
        return a.country < b.country ? -1 : a.country > b.country ? 1 : 0;
      });
      setCountries(resData)
      //setcountry_fid(resData[0].country_id)
    }
    fetchCountry()

  }, [])


  // fetch data of province table 

  useEffect(() => {
    //setprovince_fid("");
    //setcountry_fid("");
    const fetchProvince = async () => {

      const res = await axiosInstance.get(process.env.API_SERVER + "province")
      const provinceData = res.data.filter(province => province.country_fid == country_fid);
      //console.log(provinceData)
      const resData = provinceData.sort(function (a, b) {
        // select province of selected country
        return a.province < b.province ? -1 : a.province > b.province ? 1 : 0;
      });
      setprovinces(resData)
      resData && setprovince_fid(resData[0]?.province_id)
    }
    fetchProvince()
  }, [country_fid])

  const getProvince = async (e) => {
    setcountry_fid(e.target.value)
  }




  //console.log(countries)
  //console.log(city, country_fid, is_active);

  const insertData = async (e) => {
    // Validation code 
    if (city == "") {
      seterrorcity("City name required!")
    } else {
      seterrorcity("")
    }

    if (province_fid == null) {
      seterrorprovince_fid("Province name required!")
    } else {
      seterrorprovince_fid("")
    }

    if (city != "" && province_fid != null) {

      // const { data, error } = await supabase
      //   .from("tbl_expense")
      //   .insert({
      //     expense_title: city,
      //     expense_type_fid: country_fid,
      //     expense_code: is_active,
      //   })
      //   .select();

      const city_changecase = city.charAt(0).toUpperCase() + city.slice(1)

      const data = {
        city: city_changecase,
        is_rural,
        province_fid,
        is_active,
      };

      try {
       
       // const res = await axiosInstance.post("http://localhost:3000/api/city", data);
        const res = await axiosInstance.post(process.env.API_SERVER + "city", data);
        setClose();
        setcity("");
        //setcountry_fid("");
      } catch (error) {
        console.log(error);
      }

      tableReload()
      //router.refresh();

    }

  }

  useEffect(() => {

    setcity("");
    setis_rural("");
    //setcountry_fid(null);
    setprovince_fid("");
  }, [isOpen]);

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        open={isOpen}
        onClose={() => setClose()}
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
                Add City
              </div>
              <div className='p-5'>
                <div className='space-y-3 text-sm'>
                  <label  className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">City Name</label>
                  <input
                    type='text'
                    value={city}
                    onChange={(e) => { setcity(e.target.value); seterrorcity("") }}
                    placeholder='City Name'
                    className={errorcity != "" ? 'px-5 h-[45px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' :
                      'px-5 h-[45px] w-full bg-gray-200 rounded-md outline-none placeholder:text-gray-500'}
                  />




                  <div className="grid grid-cols-2 gap-2 ">
                    <div>
                      <label  className="block mb-2 text-sm font-medium text-gray-700 dark:text-white ">Country Name</label><CountryDropdown
                        state={{ country_fid, setcountry_fid, errorcountry }}
                        list={countries}
                      />
                    </div>
                    <div>
                      <label  className="block mb-2 text-sm font-medium text-gray-700 dark:text-white ">Province Name</label><ProvinceDropDown
                        state={{ province_fid, setprovince_fid, errorprovince_fid }}
                        list={provinces}
                      />
                    </div>
                  </div>





                  <div className="grid grid-cols-2 gap-2 ">
                    {/* <div>
                      <label  className="block mb-2 text-sm font-medium text-gray-700 dark:text-white ">Is Rural</label>
                      <select defaultValue={"not_active"} id="is_rural" onChange={(e) => setis_rural(e.target.value === "active" ? true : false)} className="px-5 h-[45px] w-full bg-gray-200 rounded-md outline-none placeholder:text-gray-500 border-r-8">
                        <option value="active" >Rural</option>
                        <option value="not_active">Urban</option>
                      </select>
                    </div> */}
                    <div>
                      <label  className="block mb-2 text-sm font-medium text-gray-700 dark:text-white ">Is Active</label>
                      <select defaultValue={"active"} id="is_active" onChange={(e) => setis_active(e.target.value === "active" ? true : false)} className="px-5 h-[45px] w-full bg-gray-200 rounded-md outline-none placeholder:text-gray-500 border-r-8">
                        <option value="active">Active</option>
                        <option value="not_active">Inactive</option>
                      </select>
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
                    onClick={() => setClose()}
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
