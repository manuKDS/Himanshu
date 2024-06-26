import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/auth_services/instance";

export default function UpdateData({ isOpen, setIsOpen, data, countryId, tableReload, countryList }) {
  const [country_id, setCountry_id] = useState(data.country_id);
  const [country, setCountry] = useState(data.country);
  const [country_code, setCountry_code] = useState(data.country_code);
  const [is_Active, setIs_Active] = useState(data.is_active);
  const router = useRouter();


  const [errorCountry, seterrorCountry] = useState("")
  const [errorCountryCode, seterrorCountryCode] = useState("")


  useEffect(() => {
    setCountry_id(data.country_id)
    setCountry(data.country)
    setCountry_code(data.country_code)
    setIs_Active(data.is_active)
  }, [data])

  // useEffect(() => {
  //  // console.log(country_id, country, country_code, is_Active)
  // }, [country_id, country, country_code, is_Active])

  const updateData = async () => {
    // Validation of input fields
    const isCountryAvailable = countryList.find(e => (e.country.toLowerCase() === country.toLowerCase() || e.country_code.toLowerCase() === country_code.toLowerCase()) && e.country_id !== country_id)
    if (isCountryAvailable) {
      if (isCountryAvailable.country.toLowerCase() === country.toLowerCase()) {
        seterrorCountry("Country allready available!")
      }
      if (isCountryAvailable.country_code.toLowerCase() === country_code.toLowerCase()) {
        seterrorCountryCode("Country code allready available!")
      }
    }

    if (country == "") {
      seterrorCountry("Country name required!")
    }
    if (country_code == "") {
      seterrorCountryCode("Country code required!")
    }

    if (country != "" && country_code != "" && !isCountryAvailable) {
      const country_changecase = country.charAt(0).toUpperCase() + country.slice(1)
      const newdata = {
        country: country_changecase,
        country_code: country_code,
        is_active: is_Active,
        country_id: country_id,
      };

      try {


        const res = await axiosInstance.put(process.env.API_SERVER + "country/" + country_id, newdata);
        //console.log(res.status)
      } catch (error) {
        console.log(error);
      }


      // const { data, error } = await supabase
      //   .from("tbl_country")
      //   .update({
      //     country: `${country ? country : country_data.country}`,
      //     country_code: `${country_code ? country_code : country_data.country_code
      //       }`,
      //     is_active: is_Active, //`${is_Active ? is_Active : country_data.is_active}`,
      //   })
      //   .eq("country_id", country_data.country_id)
      //   .select();

      tableReload()

      //router.refresh();
      setIsOpen(false);
      //console.log(data, error);
    }
  }

  const handleDiscard = () => {
    setIsOpen(false)
    setCountry(data.country)
    setCountry_code(data.country_code)
    setIs_Active(data.is_active)
    seterrorCountry("")
    seterrorCountryCode("")
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        open={isOpen}
        onClose={() => handleDiscard()}
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
                Update Country
                {/* - {country_id} */}
              </div>
              <div className='p-5'>
                <div className='space-y-3 text-sm'>
                  <label className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">Country Name</label>
                  <input
                    type='text'
                    defaultValue={country}
                    onChange={(e) => {
                      setCountry(e.target.value)
                      seterrorCountry("")
                    }}
                    placeholder='Country Name'
                    className={errorCountry != "" ? 'px-5 h-[45px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' :
                      'px-5 h-[45px] w-full bg-gray-200 rounded-md outline-none placeholder:text-gray-500'}
                  />
                  <label className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">Country Code</label>
                  <input
                    type='text'
                    defaultValue={country_code}
                    onChange={(e) => {
                      setCountry_code(e.target.value)
                      seterrorCountryCode("")
                    }}
                    placeholder='Country Code'
                    className={errorCountryCode != "" ? 'px-5 h-[45px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' :
                      'px-5 h-[45px] w-full bg-gray-200 rounded-md outline-none placeholder:text-gray-500'}
                  />
                  <label className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">Is Active</label>
                  <select value={is_Active ? "active" : "not_active"} id="is_active" onChange={(e) => setIs_Active(e.target.value === "active" ? true : false)} className="px-5 h-[45px] w-full bg-gray-200 rounded-md outline-none placeholder:text-gray-500 border-r-8">
                    <option value="active">Active</option>
                    <option value="not_active" >Inactive</option>
                  </select>
                </div>
                <div className='mt-4 flex gap-x-4 justify-end'>
                  {
                    (errorCountry && errorCountryCode)
                      ? <span className="text-red-500">Country & {errorCountryCode}</span>
                      : (<>
                        {errorCountry && <span className="text-red-500">{errorCountry}</span>}
                        {errorCountryCode && <span className="text-red-500">{errorCountryCode}</span>}
                      </>)
                  }
                  <button
                    className='px-6 py-2.5 bg-blue-500 text-white rounded-md'
                    onClick={updateData}
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => handleDiscard()}
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
