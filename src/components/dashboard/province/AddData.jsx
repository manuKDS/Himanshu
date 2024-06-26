import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/auth_services/instance";
import moment from "moment";
import CountryDropDown from "./CountryDropDown";

export default function AddData({ isOpen, setIsOpen, tableReload }) {
  const [province, setprovince] = useState("");
  const [country_fid, setcountry_fid] = useState("");
  const [is_active, setIs_active] = useState(true);
  const [countries, setCountries] = useState([]);
  const router = useRouter();

  const [errorprovince, seterrorprovince] = useState("");

  // fetch data of Country table
  useEffect(() => {
    const fetchCountry = async () => {
      const res = await axiosInstance.get(process.env.API_SERVER + "country");

      const resData = res.data.sort(function (a, b) {
        // sort country accending order
        return a.country < b.country ? -1 : a.country > b.country ? 1 : 0;
      });
      setCountries(resData);
      setcountry_fid(resData[0].country_id);
    };
    fetchCountry();
  }, []);

  const insertData = async () => {
    // Validation code
    if (province == "") {
      seterrorprovince("Province name required!");
    } else {
      seterrorprovince("");
    }

    if (province != "") {
      const province_changecase = province.charAt(0).toUpperCase() + province.slice(1)
      const data = {
        province: province_changecase,
        country_fid,
        is_active,
      };

      try {
        
        const res = await axiosInstance.post(process.env.API_SERVER + "province", data);
        setIsOpen(false);
        setprovince("");
        setcountry_fid("");
      } catch (error) {
        console.log(error);
      }
      tableReload();
      //router.refresh();
    }
  };

  useEffect(() => {
    setprovince("")
    setcountry_fid("")
    setIs_active(true)
  }, [isOpen])

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
                Add Province
              </div>
              <div className="p-5">
                <div className="space-y-3 text-sm">
                  <label  className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">Province Name</label>
                  <input
                    type="text"
                    value={province}
                    onChange={(e) => {
                      setprovince(e.target.value);
                      seterrorprovince("");
                    }}
                    placeholder="Province Name"
                    className={
                      errorprovince != ""
                        ? "px-5 h-[45px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500"
                        : "px-5 h-[45px] w-full bg-gray-200 rounded-md outline-none placeholder:text-gray-500"
                    }
                  />
                  <label  className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">Country Name</label>
                  <CountryDropDown
                    state={{ country_fid, setcountry_fid }}
                    list={countries}
                  />

                  <label  className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">Is Active</label>
                  <select
                    defaultValue={"active"}
                    id="is_active"
                    onChange={(e) =>
                      setIs_active(e.target.value === "active" ? true : false)
                    }
                    className="px-5 h-[45px] w-full bg-gray-200 rounded-md outline-none placeholder:text-gray-500 border-r-8"
                  >
                    <option value="active">Active</option>
                    <option value="not_active">Inactive</option>
                  </select>
                </div>
                <div className="mt-4 flex gap-x-4 justify-end">
                  <button
                    className="px-6 py-2.5 bg-blue-500 text-white rounded-md"
                    onClick={insertData}
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
