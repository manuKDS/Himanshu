import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/auth_services/instance";

export default function AddData({ isOpen, setIsOpen, tableReload, countryData }) {
  const [country, setCountry] = useState("")
  const [country_code, setCountry_code] = useState("")
  const [is_active, setIs_active] = useState(true)
  const router = useRouter()

  const [errorCountry, seterrorCountry] = useState("")
  const [errorCountryCode, seterrorCountryCode] = useState("")

  const insertData = async () => {
    const isCountryAvailable = countryData.find(e => e.country.toLowerCase() === country.toLowerCase() || e.country_code.toLowerCase() === country_code.toLowerCase())
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

      const data = {
        country: country_changecase,
        country_code,
        is_active,
      };

      try {
        const res1 = await axiosInstance.get(process.env.API_SERVER + "country/" + data.country);
        //console.log(res1.data)
        if (res1.data.length > 0) {
          seterrorCountry("Country already exists!")
        } else {
          const res = await axiosInstance.post(process.env.API_SERVER + "country", data);
          setIsOpen(false);
          setCountry("");
          setCountry_code("");
        }
      } catch (error) {
        console.log(error);
      }
      tableReload();
      //router.refresh();
    }
  };

  const handleDiscard = () => {
    setIsOpen(false)
    setCountry("")
    setCountry_code("")
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
                Add Country
              </div>
              <div className='p-5'>
                <div className='space-y-3 text-sm'>

                  <label for="is_active" className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">Country Name</label>
                  <input
                    type='text'
                    value={country}
                    onChange={(e) => { setCountry(e.target.value); seterrorCountry(""); }}
                    placeholder='Country Name'

                    className={errorCountry != "" ? 'px-5 h-[45px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' :
                      'px-5 h-[45px] w-full bg-gray-200 rounded-md outline-none placeholder:text-gray-500'
                    }
                  />

                  <label for="is_active" className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">Country Code</label>
                  <input
                    type='text'
                    value={country_code}
                    onChange={(e) => { setCountry_code(e.target.value); seterrorCountryCode(""); }}
                    placeholder='Country Code'
                    className={errorCountryCode != "" ? 'px-5 h-[45px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' :
                      'px-5 h-[45px] w-full bg-gray-200 rounded-md outline-none placeholder:text-gray-500'}
                  />
                  <label for="is_active" className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">Is Active</label>
                  <select defaultValue={"active"} id="is_active" onChange={(e) => setIs_active(e.target.value === "active" ? true : false)} className="px-5 h-[45px] w-full bg-gray-200 rounded-md outline-none placeholder:text-gray-500 border-r-8">
                    <option value="active">Active</option>
                    <option value="not_active">Inactive</option>
                  </select>

                </div>
                <div className='mt-4 flex gap-x-4 justify-end'>
                  {errorCountry && <span className="text-red-500">{errorCountry}</span>}
                  <button
                    className='px-6 py-2.5 bg-blue-500 text-white rounded-md'
                    onClick={insertData}
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
