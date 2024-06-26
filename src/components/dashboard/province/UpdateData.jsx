import { Dialog, Transition } from "@headlessui/react";
import { supabase } from "@/lib/supabaseClient";
import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/auth_services/instance";
import moment from "moment"
import CountryDropdown from "./CountryDropDown";

export default function UpdateData({ isOpen, setIsOpen, data, provinceId, tableReload }) {
  const [province_data, setprovince_data] = useState(data);
  const [province_id, setprovince_id] = useState(province_data.province_id);
  const [province, setprovince] = useState(province_data.province);
  const [country_fid, setcountry_fid] = useState(province_data.country_fid);
  const [is_Active, setIs_Active] = useState(province_data.is_active);
  const [countries, setCountries] = useState([]);

  const router = useRouter();

  const [errorprovince, seterrorprovince] = useState("")

  // fetch data of Country table 
  useEffect(() => {
    const fetchCountry = async () => {
      const res = await axiosInstance.get(process.env.API_SERVER + "country")

      const resData = res.data.sort(function (a, b) {
        // sort country accending order
        return a.country < b.country ? -1 : a.country > b.country ? 1 : 0;
      });
      setCountries(resData)
    }
    fetchCountry()
  }, [])

  useEffect(() => {
    setprovince_id(data.province_id)
    setprovince(data.province)
    setcountry_fid(data.country_fid)
    setIs_Active(data.is_active)
  }, [isOpen, data])

  const updateData = async () => {

    // Validation code 
    if (province == "") {
      seterrorprovince("Province name required!")
    } else {
      seterrorprovince("")
    }

    if (province != "") {

      const province_changecase = province.charAt(0).toUpperCase() + province.slice(1)
      const newdata = {
        province: province_changecase,
        country_fid: country_fid,
        is_active: is_Active,
        province_id: province_id,
      };

      try {

      
        const res = await axiosInstance.put(process.env.API_SERVER + "province/" + province_id, newdata);
        //console.log(res.status)
      } catch (error) {
        console.log(error);
      }


      // const { data, error } = await supabase
      //   .from("tbl_province")
      //   .update({
      //     province: `${province ? province : province_data.province}`,
      //     country_fid: `${country_fid ? country_fid : province_data.country_fid
      //       }`,
      //     is_active: is_Active, //`${is_Active ? is_Active : province_data.is_active}`,
      //   })
      //   .eq("province_id", province_data.province_id)
      //   .select();

      tableReload()

      //router.refresh();
      setIsOpen(false);
      //console.log(data, error);
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
                Update province
                {/* - {province_id} */}
              </div>
              <div className='p-5'>
                <div className='space-y-3 text-sm'>
                  <label  className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">Province Name</label>
                  <input
                    type='text'
                    defaultValue={province}
                    onChange={(e) => { setprovince(e.target.value); seterrorprovince("") }}
                    placeholder='Expense Title'
                    className={errorprovince != "" ? 'px-5 h-[45px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' :
                      'px-5 h-[45px] w-full bg-gray-200 rounded-md outline-none placeholder:text-gray-500'}
                  />
                  <label  className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">Country Name</label>
                  <CountryDropdown
                    state={{ country_fid, setcountry_fid }}
                    list={countries}

                  />


                  <label  className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">Is Active</label> <select defaultValue={"active"} id="is_active" onChange={(e) => setIs_Active(e.target.value === "active" ? true : false)} className="px-5 h-[45px] w-full bg-gray-200 rounded-md outline-none placeholder:text-gray-500 border-r-8">
                    {is_Active === true ? (
                      <option value="active">Active</option>
                    ) : (
                      <option value="active">Active</option>
                    )}

                    {is_Active === true ? (
                      <option value="not_active" >Inactive</option>
                    ) : (
                      <option value="not_active" selected>Inactive</option>
                    )}
                  </select>
                </div>
                <div className='mt-4 flex gap-x-4 justify-end'>
                  <button
                    className='px-6 py-2.5 bg-blue-500 text-white rounded-md'
                    onClick={updateData}
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
