import { useState } from "react";
import { Combobox } from "@headlessui/react";

const HeaderDropDown = ({ state, list }) => {

  const { production_id, setproduction_id } = state;

  const [query, setQuery] = useState("");

  const filteredList =
    query === ""
      ? list
      : list?.filter((org) => {
        return org.production.toLowerCase().includes(query.toLowerCase());
      });

  const convertedVal = convetproductionIdToName(production_id);

  // CONVERT production_id to production
  function convetproductionIdToName(production_id) {
    const production = list.find((item) => item.production_id == production_id);
    return production?.production;
  }

  //console.log(production_id);
  return (
    <Combobox
      value={production_id}
      onChange={setproduction_id}
      as='div'
      className='relative z-100'
    >
      <div className='relative'>
        <Combobox.Input
          onChange={(event) => setQuery(event.target.value)}
          displayValue={() => convertedVal}
          placeholder='Choose Production'
          // className='px-5 h-[45px] w-full bg-gray-200 rounded-md outline-none placeholder:text-gray-500'
          className={
            // errorproduction != ""
            //   ? "w-[400px] px-5 h-[45px] bg-red-200 rounded-md outline-none placeholder:text-gray-500 text-sm"
            "w-[400px] px-5 h-[45px] bg-gray-100 rounded-md outline-none placeholder:text-gray-500 text-sm font-normal"
          }
        />
        <Combobox.Button className='absolute inset-y-0 right-0 flex items-center pr-2'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='icon icon-tabler icon-tabler-chevron-down'
            width='17'
            height='17'
            viewBox='0 0 24 24'
            strokeWidth='3'
            stroke='currentColor'
            fill='none'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path stroke='none' d='M0 0h17v17H0z' fill='none'></path>
            <path d='M6 9l6 6l6 -6'></path>
          </svg>
        </Combobox.Button>
      </div>
      {filteredList?.length > 0 && (
        <Combobox.Options className='absolute mt-1 max-h-[160px] overflow-y-auto w-full rounded-md bg-white py-1  shadow-lg ring-1 ring-gray-300 ring-opaproduction-5 focus:outline-none sm:text-sm z-10 text-sm font-normal'>
          {filteredList.map((org, index) => (
            <Combobox.Option
              className='relative cursor-pointer select-none py-2 pl-10 pr-4 text-gray-900 hover:bg-gray-100'
              key={index}
              value={org.production_id}
            >
              {org.production}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      )}
    </Combobox>
  );
};

export default HeaderDropDown;
