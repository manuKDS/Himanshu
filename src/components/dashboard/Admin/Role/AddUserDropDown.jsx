import { useState } from "react";
import { Combobox } from "@headlessui/react";


const AddUserDropDown = ({ list, convetOrgTypeName, state }) => {
  const { user_fid, setuser_fid, erroruser } = state;

  const [query, setQuery] = useState("");

  const filteredList =
    query === ""
      ? list
      : list.filter((org) => {
        return org.name.toLowerCase().includes(query.toLowerCase());
      });

  const convertedVal = convetuserCodeToName(user_fid)

  // CONVERT user_fid to username
  function convetuserCodeToName(user_fid) {
    const user = list.find((item) => item.user_id == user_fid);
    return user?.name;
  }

  //console.log(user_fid);
  return (
    <Combobox value={user_fid} onChange={setuser_fid} as='div' className='relative z-100'>
      <div className='relative'>
        <Combobox.Input
          onChange={(event) => setQuery(event.target.value)}
          displayValue={() => convertedVal}
          placeholder='User'
          // className='px-5 h-[45px] w-full bg-gray-200 rounded-md outline-none placeholder:text-gray-500'
          className={erroruser != "" ? 'px-5 h-[45px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' :
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
        <Combobox.Options className='absolute mt-1 max-h-[160px] overflow-y-auto w-full rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-gray-300 ring-opauser-5 focus:outline-none sm:text-sm z-10'>
          {filteredList.map((org, index) => (
            <Combobox.Option
              className='relative cursor-pointer select-none py-2 pl-10 pr-4 text-gray-900 hover:bg-gray-100'
              key={index}
              value={org.user_id}
            >
              {org.name}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      )}
    </Combobox>
  );
};

export default AddUserDropDown;
