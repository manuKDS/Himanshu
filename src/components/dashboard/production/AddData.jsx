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
import IncorporationinDropdown from "./IncorporatedinDropDown";

const status_data = [
  { id: 1, status: 'Active' },
  { id: 2, status: 'Inactive' },
]

const incorporated_in_data = [
  { id:  'Province', name: 'Province' },
  { id: 'Federal', name: 'Federal' },
  { id: 'N/A', name: 'N/A' },
]

export default function AddData({ isOpen, setIsOpen, state, tableReload }) {
  const { distributorLst, genreLst, provinceLst, countryLst } = state;

  const [org_fid, setorg_fid] = useState(1);
  const [modified_by, setmodified_by] = useState(1);
  const [production, setproduction] = useState("");

  // foreign key fields
  const [status_fid, setstatus_fid] = useState("");
  const [genre_fid, setgenre_fid] = useState("");
  const [distributor_fid, setdistributor_fid] = useState("");
  const [province_fid, setprovince_fid] = useState("");
  //const [city_fid, setcity_fid] = useState("");
  const [country_fid, setcountry_fid] = useState("");

  // optional fields
  const [incorporation_name, setincorporation_name] = useState("");
  const [incorporation_date, setincorporation_date] = useState("");
  const [incorporation_in, setincorporation_in] = useState("");
  const [incorporation_inName, setincorporation_inName] = useState("N/A");

  // list to use multiple time
  //const [citys, setcitys] = useState([]);
  //const [citysList, setcitysList] = useState([]);
  const [countries, setcountries] = useState(countryLst);
  const [provinces, setprovinces] = useState(provinceLst);
  const [provincesList, setprovincesList] = useState();
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
  const [errorincorporation_date, seterrorincorporation_date] = useState("")

  useEffect(() => {
    const incorporation_inToName = () => {
      setincorporation_inName("N/A")
      
      if (incorporation_in == 1)
        setincorporation_inName("Province")
      else if (incorporation_in == 2)
        setincorporation_inName("Federal")
      
       
    }
    incorporation_inToName()
  }, [incorporation_in])

  useEffect(() => {
    const fecthProvince = async () => {
      const resProvince = provinces.filter(province => province.country_fid === country_fid)
      setprovincesList(resProvince)
    }
    fecthProvince()
    setprovince_fid("");
    //setcity_fid("");
  }, [country_fid])

  // useEffect(() => {
  //   const fecthCity = async () => {
  //     const resCity = citys.filter(City => City.province_fid === province_fid)
  //     setcitysList(resCity)
  //   }
  //   fecthCity()
  // }, [province_fid])

  const insertData = async () => {

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

    if (province_fid == "") {
      seterrorprovince_fid("Province required!")
    } else {
      seterrorprovince_fid("")
    }

    //errorgenre
    if (genre_fid == "") {
      seterrorgenre("Genre required!")
    } else {
      seterrorgenre("")
    }
    //errordistributor
    if (distributor_fid == "") {
      seterrordistributor("Distributor required!")
    } else {
      seterrordistributor("")
    }

    if (incorporation_date == "") {
      seterrorincorporation_date("Date required!")
    } else {
      seterrorincorporation_date("")
    }

    if (production != "" && errorstatus == "" && province_fid != "" && incorporation_date != "") {    // && errorgenre =="" && errordistributor=="") {

      const production_changecase = production.charAt(0).toUpperCase() + production.slice(1)
      const data = {
        modified_by,
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

      console.log(incorporation_in)
      try {
        const res = await axiosInstance.post(process.env.API_SERVER + "production", data);
        setIsOpen(false);
        setorg_fid(1);
        setmodified_by(1);
        setproduction("");
        setstatus_fid("");
        setgenre_fid("");
        setdistributor_fid("");
        setprovince_fid("");
        setcountry_fid("");
        setincorporation_name("");
        setincorporation_date("");
        setincorporation_in("");
        setincorporation_inName("")

      } catch (error) {
        console.log(error);
      }
      tableReload();
      //router.refresh();
    }
  }

  useEffect(()=>{
    setorg_fid(1);
    setmodified_by(1);
    setproduction("");
    setstatus_fid("");
    setgenre_fid("");
    setdistributor_fid("");
    setprovince_fid("");
    setcountry_fid("");
    setincorporation_name("");
    setincorporation_date("");
    setincorporation_in("");
    setincorporation_inName("")
  },[isOpen])

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
                Add Production
              </div>
              <div className='p-5'>
                <div className='space-y-3 text-sm'>

                  <div className="grid grid-cols-1 gap-2 divide-x">
                 
                    <input
                      type='text'
                      value={production}
                      onChange={(e) => { setproduction(e.target.value); seterrorproduction("") }}
                      placeholder='Production Name'
                      className={errorproduction != "" ? 'px-5 h-[45px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' :
                        'px-5 h-[45px] w-full bg-gray-200 rounded-md outline-none placeholder:text-gray-500'}
                    />

                  
                  </div>

                  <div className="grid grid-cols-2 gap-2 divide-x">
                    {/* // Country -- Province  */}

                    {/* <label  className="block mb-2 text-sm font-medium text-red-500 dark:text-white float-right">{country_fid}</label> */}
                    <CountryDropdown
                      state={{ country_fid, setcountry_fid, errorcountry }}
                      list={countries}
                    />

                    {/* <label  className="block mb-2 text-sm font-medium text-red-500 dark:text-white float-right">{errorcity}</label> */}
                    <ProvinceDropDown
                      state={{ province_fid, setprovince_fid, errorprovince_fid }}
                      list={provincesList}
                    />

                    {/* <label  className="block mb-2 text-sm font-medium text-red-500 dark:text-white float-right">{errorcity}</label> */}
                    {/* <CityDropDown
                      state={{ city_fid, setcity_fid, errorcity }}
                      list={citysList}
                    /> */}
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


                    <IncorporationinDropdown
                      state={{ incorporation_in, setincorporation_in, errorincorporation_in }}
                      list={incorporated_in_data}
                    />

                  </div>

                  <div className="grid grid-cols-2 gap-2 divide-x">

                    {/* <input
                        type='text'
                        value={incorporation_in}
                        onChange={(e) => setincorporation_in(e.target.value)}
                        placeholder='Incorporation In'
                        className='px-5 h-[45px] w-full bg-gray-200 rounded-md outline-none placeholder:text-gray-500'
                      /> */}


                    <input
                      //type='date'
                      type="text" onFocus={(e) => e.target.type = 'date'}
                      value={incorporation_date}
                      onChange={(e) => setincorporation_date(e.target.value)}
                      placeholder='Incorporation Date'
                      
                      className={errorincorporation_date != "" ? 'px-5 h-[45px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' :
                        'px-5 h-[45px] w-full bg-gray-200 rounded-md outline-none placeholder:text-gray-500'}
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
