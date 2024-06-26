import { Dialog, Transition } from "@headlessui/react";
import { supabase } from "@/lib/supabaseClient";
import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/auth_services/instance";
import CountryDropdown from "./CountryDropDown";
import ProvinceDropDown from "./ProvinceDropDown";

export default function UpdateData({
  isOpen,
  setIsOpen,
  data,
  cityId,
  state,
  tableReload,
}) {
  const { provinceLst, countryLst } = state;

  const [city_id, setcity_id] = useState(data.city_id);
  const [city, setcity] = useState(data.city);
  const [is_rural, setis_rural] = useState(data.is_rural);
  const [country_fid, setcountry_fid] = useState(null);
  const [province_fid, setprovince_fid] = useState(data.province_fid);
  const [province_id, setprovince_id] = useState(data.province_fid);
  const [is_active, setis_active] = useState(data.is_active);
  const [countries, setCountries] = useState(countryLst);
  const [provinces, setprovinces] = useState([]);
  const router = useRouter();

  const [errorcity, seterrorcity] = useState("");
  const [errorprovince_fid, seterrorprovince_fid] = useState("");
  const [errorcountry, seterrorcountry] = useState("");

  useEffect(() => {
    setcity_id(data.city_id);
    setcity(data.city);
    setis_rural(data.is_rural);
    //setcountry_fid(null);
    setprovince_fid(data.province_fid);
    setprovince_id(data.province_fid);
    setis_active(data.is_active);
  }, [isOpen, data]);

  // useEffect(() => {
  //   getfetchProvince_Country_fid()
  //   fetchProvince()
  // }, [province_fid])

  // fetch data of Country table
  useEffect(() => {
    getfetchProvince_Country_fid();
    // const fetchCountry = async () => {
    //   const res = await axiosInstance.get(process.env.API_SERVER + "country")
    //   setCountries(res.data)
    // }
    // fetchCountry()
  }, []);

  const getfetchProvince_Country_fid = async () => {
    const res = await axiosInstance.get(
      process.env.API_SERVER + "province/" + province_fid
    );
    const country_fid = res.data?.map((country) => {
      return country.country_fid;
    });
    setcountry_fid(country_fid);
    //console.log(country_fid)
  };

  // fetch data of province table
  useEffect(() => {
    fetchProvince();
  }, [country_fid]);

  const fetchProvince = async () => {
    //const res = await axiosInstance.get(process.env.API_SERVER + "province")
    //const provinceData = res.data.filter(province => province.country_fid == country_fid);
    const res = provinceLst;
    const provinceData = res.filter(
      (province) => province.country_fid == country_fid
    );
    setprovinces(provinceData);
    //provinceData && setprovince_fid(provinceData[0]?.province_id);
  };

  const getProvince = async (e) => {
    setcountry_fid(e.target.value);
  };

  const updateData = async (e) => {
    // Validation code
    if (city == "") {
      seterrorcity("City name required!");
    } else {
      seterrorcity("");
    }

    if (province_fid == null) {
      seterrorprovince_fid("Province name required!");
    } else {
      seterrorprovince_fid("");
    }

    if (city != "" && province_fid != null) {
      //console.log(city, is_rural, province_fid, is_active);

      const city_changecase = city.charAt(0).toUpperCase() + city.slice(1);

      const data = {
        city: city_changecase,
        is_rural,
        province_fid,
        is_active,
      };

      try {
        const res = await axiosInstance.put(
          process.env.API_SERVER + "city/" + cityId,
          data
        );
        setIsOpen(false);
        //setcity("");
        //setcountry_fid("");
      } catch (error) {
        console.log(error);
      }

      tableReload();
      //router.refresh();
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <div className="fixed inset-0 bg-black/60" aria-hidden="true" />

        {/* Full-screen container to center the panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          {/* The actual dialog panel  */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-100"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto w-[600px] rounded-[15px] bg-white overflow-hidden">
              <div className="p-6 bg-blue-500 text-white text-xl font-semibold">
                Update City
              </div>

              <div className="p-5">
                <div className="space-y-3 text-sm">
                  <label  className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">City Name</label>

                  <input
                    type="text"
                    value={city}
                    onChange={(e) => {
                      setcity(e.target.value);
                      seterrorcity("");
                    }}
                    placeholder="City Name"
                    className={
                      errorcity != ""
                        ? "px-5 h-[45px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500"
                        : "px-5 h-[45px] w-full bg-gray-200 rounded-md outline-none placeholder:text-gray-500"
                    }
                  />

                  {/* // Country -- Province  */}
                  <div className="grid grid-cols-2 gap-2 divide-x">
                    <div>
                      <label  className="block mb-2 text-sm font-medium text-gray-700 dark:text-white ">Country Name</label>
                      <CountryDropdown
                        state={{ country_fid, setcountry_fid, errorcountry }}
                        list={countries}
                      />
                    </div>
                    <div>
                      <label  className="block mb-2 text-sm font-medium text-gray-700 dark:text-white ">Province Name</label>
                      <ProvinceDropDown
                        state={{ province_fid, setprovince_fid, errorprovince_fid }}
                        list={provinces}
                      />
                    </div>
                  </div>



                  <div className="grid grid-cols-2 gap-2 divide-x">
                    {/* <div>
                      <label  className="block mb-2 text-sm font-medium text-gray-700 dark:text-white ">Is Rural</label>
                      <select
                        defaultValue={is_rural ? "rural" : "urban"}
                        id="is_rural"
                        onChange={(e) =>
                          setis_rural(e.target.value == "rural" ? true : false)
                        }
                        className="px-5 h-[45px] w-full bg-gray-200 rounded-md outline-none placeholder:text-gray-500  border-r-8"
                      >
                        <option value="rural">Rural</option>
                        <option value="urban">Urban</option>
                      </select>
                    </div> */}
                    <div>
                      <label  className="block mb-2 text-sm font-medium text-gray-700 dark:text-white ">Is Active</label>
                      <select
                        defaultValue={is_active ? "active" : "not_active"}
                        id="is_active"
                        onChange={(e) =>
                          setis_active(
                            e.target.value == "active" ? true : false
                          )
                        }
                        className="px-5 h-[45px] w-full bg-gray-200 rounded-md outline-none placeholder:text-gray-500  border-r-8"
                      >
                        <option value="active">Active</option>
                        <option value="not_active">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-x-4 justify-end">
                  <button
                    className="px-6 py-2.5 bg-blue-500 text-white rounded-md"
                    onClick={(e) => updateData(e)}
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-2.5 bg-gray-400 text-white rounded-md"
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
