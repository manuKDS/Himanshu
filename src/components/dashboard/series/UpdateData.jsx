import { Dialog, Transition } from "@headlessui/react";
import { supabase } from "@/lib/supabaseClient";
import { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/auth_services/instance";
import moment from "moment";
import CityDropDown from "./CityDropDown";
import ProvinceDropDown from "./ProvinceDropDown";
import CountryDropdown from "./CountryDropDown";
import StatusDropDown from "./StatusDropDown";
import GenreDropdown from "./GenreDropDown";
import DistributorDropdown from "./DistributorDorpDown";
import Incorporation_inDropdown from "./IncorporatedinDropDown";


const status_data = [
  { id: 1, status: 'Active' },
  { id: 2, status: 'Inactive' },
]

const incorporated_in_data = [
  { id: 'Province', name: 'Province' },
  { id: 'Federal', name: 'Federal' },
  { id: 'N/A', name: 'N/A' },
]

export default function UpdateData({ isOpen, setIsOpen, productionId, data, tableReload, state }) {
  const { distributorLst, genreLst, provinceLst, countryLst } = state;

  const [org_fid, setorg_fid] = useState(data.org_fid);
  const [updated_by, setupdated_by] = useState(data.updated_by);
  const [production, setproduction] = useState(data.production);

  // foreign key fields
  const [status_fid, setstatus_fid] = useState(data.status ? 1 : 2);
  const [genre_fid, setgenre_fid] = useState(data.genre_fid);
  const [distributor_fid, setdistributor_fid] = useState(data.distributor_fid);
  const [province_fid, setprovince_fid] = useState(data.province_fid);
  //const [city_fid, setcity_fid] = useState("");
  const [country_fid, setcountry_fid] = useState("");

  // optional fields
  const [incorporation_name, setincorporation_name] = useState(data.incorporation_name);
  const [incorporation_date, setincorporation_date] = useState(data.incorporation_date);
  const [incorporation_in, setincorporation_in] = useState(data.incorporation_in);

  // list to use multiple time
  //const [citys, setcitys] = useState([]);
  //const [citysList, setcitysList] = useState([]);
  const [countries, setcountries] = useState(countryLst);
  const [provinces, setprovinces] = useState(provinceLst);
  const [genres, setgenres] = useState(genreLst);
  const [distributors, setdistributors] = useState(distributorLst);
  const router = useRouter();

  // error handler
  const [errorproduction, seterrorproduction] = useState("")
  const [errorstatus, seterrorstatus] = useState("")
  const [errorgenre, seterrorgenre] = useState("")
  const [errordistributor, seterrordistributor] = useState("")
  const [errorprovince_fid, seterrorprovince_fid] = useState("")
  const [errorcountry, seterrorcountry] = useState("")
  const [errorincorporation_in, seterrorincorporation_in] = useState("")

  useEffect(() => {
    getfetchProvince_Country_fid();
  }, []);

  const getfetchProvince_Country_fid = async () => {
    const res = await axiosInstance.get(
      process.env.API_SERVER + "province/" + province_fid
    );
    const country_fid = res.data?.map((country) => {
      return country.country_fid;
    });
    setcountry_fid(country_fid);
  };


  useEffect(() => {
    setproduction(data.production);
    setstatus_fid(data.status ? 1 : 2);
    setgenre_fid(data.genre_fid);
    setdistributor_fid(data.distributor_fid);
    setprovince_fid(data.province_fid);
    setincorporation_name(data.incorporation_name);
    setincorporation_date(data.incorporation_date);
    setincorporation_in(data.Incorporation_in);
  }, [isOpen, data]);


  useEffect(() => {
    fetchProvince()
    //setprovince_fid("");
    //setcity_fid("");
  }, [country_fid])


  const fetchProvince = async () => {
    const res = provinceLst;
    const provinceData = res.filter(
      (province) => province.country_fid == country_fid
    );
    setprovinces(provinceData);
    //provinceData && setprovince_fid(provinceData[0]?.province_id);
  };

  // useEffect(() => {
  //   const fecthProvince = async () => {
  //     const resProvince = provinces.filter(province => province.country_fid === country_fid)
  //     setprovincesList(resProvince)
  //   }
  //   fecthProvince()
  //   //setprovince_fid("");
  // }, [country_fid])


  const updateData = async () => {

    // Validation code 
    if (production == "") {
      seterrorproduction("Production name required!")
    } else {
      seterrorproduction("")
    }

    if (status_fid == "") {
      seterrorstatus("Status required!")
    } else {
      seterrorstatus("")
    }

    // if (province_fid == "") {
    //   seterrorprovince_fid("Province required!")
    // } else {
    //   seterrorprovince_fid("")
    // }

    if (production != "" && errorstatus == "") {  // && province_fid != "") {

      const production_changecase = production.charAt(0).toUpperCase() + production.slice(1)
      const data = {
        updated_by,
        org_fid,
        production: production_changecase,
        status: status_fid,
        distributor_fid,
        genre_fid,
        incorporation_name,
        incorporation_date,
        Incorporation_in: incorporation_in,
        province_fid,
      };


      try {
        const res = await axiosInstance.put(process.env.API_SERVER + "production/" + productionId, data);
        setIsOpen(false);
        // setorg_fid(1);
        // setupdated_by(1);
        // setproduction("");
        // setstatus_fid("");
        // setgenre_fid("");
        // setdistributor_fid("");
        // setprovince_fid("");
        // setcountry_fid("");
        // setincorporation_name("");
        // setincorporation_date("");
        // setincorporation_in("");

      } catch (error) {
        console.log(error);
      }
      tableReload();
      //router.refresh();
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
                Update Series
              </div>
              <div className='p-5'>
                <div className='space-y-3 text-sm'>

                  <div className="grid grid-cols-1 gap-2 divide-x">
                    <input
                      type='text'
                      value={production}
                      onChange={(e) => { setproduction(e.target.value); seterrorproduction("") }}
                      placeholder='Series Name'
                      className={errorproduction != "" ? 'px-5 h-[45px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' :
                        'px-5 h-[45px] w-full bg-gray-200 rounded-md outline-none placeholder:text-gray-500'}
                    />


                  </div>

                  <div className="grid grid-cols-2 gap-2 divide-x">
                    {/* // Country -- Province  */}


                    <CountryDropdown
                      state={{ country_fid, setcountry_fid, errorcountry }}
                      list={countries}
                    />
                    <ProvinceDropDown
                      state={{ province_fid, setprovince_fid, errorprovince_fid }}
                      list={provinces}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 divide-x">
                    <GenreDropdown
                      state={{ genre_fid, setgenre_fid, errorgenre }}
                      list={genres}
                    />
                    <DistributorDropdown
                      state={{ distributor_fid, setdistributor_fid, errordistributor }}
                      list={distributors}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 divide-x">
                    <input
                      type='text'
                      value={incorporation_name}
                      onChange={(e) => setincorporation_name(e.target.value)}
                      placeholder='Incorporation Name'
                      className='px-5 h-[45px] w-full bg-gray-200 rounded-md outline-none placeholder:text-gray-500'
                    />
                    <Incorporation_inDropdown
                      state={{ incorporation_in, setincorporation_in, errorincorporation_in }}
                      list={incorporated_in_data}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 divide-x">
                    <input
                      type='date'
                      value={incorporation_date}
                      onChange={(e) => setincorporation_date(e.target.value)}
                      placeholder='Incorporation Date'
                      className='px-5 h-[45px] w-full bg-gray-200 rounded-md outline-none placeholder:text-gray-500'
                    />
                    <StatusDropDown
                      state={{ status_fid, setstatus_fid, errorstatus }}
                      list={status_data}
                    />
                  </div>

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
