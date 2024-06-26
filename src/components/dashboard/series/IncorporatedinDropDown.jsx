import { useState } from "react";
import { Combobox } from "@headlessui/react";


const IncorporationinDropdown = ({ list, convetOrgTypeName, state }) => {
  const { incorporation_in, setincorporation_in, errorincorporation_in } = state;
  const [query, setQuery] = useState("");

  const filteredList =
    query === ""
      ? list
      : list.filter((org) => {
        return org.name.toLowerCase().includes(query.toLowerCase());
      });

  const convertedVal = convetincorporation_inCodeToName(incorporation_in)

  // CONVERT incorporationin to incorporationin
  function convetincorporation_inCodeToName(incorporation_in) {
    const incorporation_in1 = list.find((item) => item.id == incorporation_in);
    return incorporation_in1?.name;
  }

  //console.log(incorporation_in);
  return (
    <Combobox value={incorporation_in} onChange={setincorporation_in} as='div' className='relative z-100'>
      <div className='relative'>
        <Combobox.Input
          onChange={(event) => setQuery(event.target.value)}
          displayValue={() => convertedVal}
          placeholder='Incorporation In'
          // className='px-5 h-[45px] w-full bg-gray-200 rounded-md outline-none placeholder:text-gray-500'
          className={errorincorporation_in != "" ? 'px-5 h-[45px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' :
            'px-5 h-[45px] w-full bg-gray-200 rounded-md outline-none placeholder:text-gray-500'}
        />
        <Combobox.Button className='absolute inset-y-0 right-0 flex items-center pr-2'>

          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-chevron-down" width="17" height="17" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h17v17H0z" fill="none"></path>
            <path d="M6 9l6 6l6 -6"></path>
          </svg>
        </Combobox.Button>
      </div>
      {filteredList.length > 0 && (
        <Combobox.Options className='absolute mt-1 max-h-[160px] overflow-y-auto w-full rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-gray-300 ring-opaincorporationin-5 focus:outline-none sm:text-sm z-10'>
          {filteredList.map((org, index) => (
            <Combobox.Option
              className='relative cursor-pointer select-none py-2 pl-10 pr-4 text-gray-900 hover:bg-gray-100'
              key={index}
              value={org.id}
            >
              {org.name}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      )}
    </Combobox>
  );
};

export default IncorporationinDropdown;
