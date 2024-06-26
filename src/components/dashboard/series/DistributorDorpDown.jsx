import { useState } from "react";
import { Combobox } from "@headlessui/react";

const DistributorDropdown = ({ list, convetOrgTypeName, state }) => {
  const { distributor_fid, setdistributor_fid } = state;

  const [query, setQuery] = useState("");

  const filteredList =
    query === ""
      ? list
      : list.filter((org) => {
        return org.distributor_name.toLowerCase().includes(query.toLowerCase());
      });

  const convertedVal = convetdistributorCodeToName(distributor_fid)

  // CONVERT distributor_fid to distributor
  function convetdistributorCodeToName(distributor_fid) {
    const distributor = list.find((item) => item.distributor_id == distributor_fid);
    return distributor?.distributor_name;
  }

  //console.log(distributor_fid);
  return (
    <Combobox value={distributor_fid} onChange={setdistributor_fid} as='div' className='relative z-100'>
      <div className='relative'>
        <Combobox.Input
          onChange={(event) => setQuery(event.target.value)}
          displayValue={() => convertedVal}
          placeholder='Choose distributor'
          className='px-5 h-[45px] w-full bg-gray-200 rounded-md outline-none placeholder:text-gray-500'
        />
        <Combobox.Button className='absolute inset-y-0 right-0 flex items-center pr-2'>
          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-chevron-down" width="17" height="17" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h17v17H0z" fill="none"></path>
            <path d="M6 9l6 6l6 -6"></path>
          </svg>
        </Combobox.Button>
      </div>
      {filteredList.length > 0 && (
        <Combobox.Options className='absolute mt-1 max-h-[160px] overflow-y-auto w-full rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-gray-300 ring-opacity-5 focus:outline-none sm:text-sm z-10'>
          {filteredList.map((org, index) => (
            <Combobox.Option
              className='relative cursor-pointer select-none py-2 pl-10 pr-4 text-gray-900 hover:bg-gray-100'
              key={index}
              value={org.distributor_id}
            >
              {org.distributor_name}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      )}
    </Combobox>
  );
};

export default DistributorDropdown;
