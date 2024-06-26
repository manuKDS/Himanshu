import { useState } from "react";
import { Combobox } from "@headlessui/react";

const ImportBudgetDropdown = ({ list, convetproductionIdToName, state }) => {
  const { productionId, setProductionId, errorimport } = state;

  const [query, setQuery] = useState("");

  const filteredList =
    query === ""
      ? list
      : list.filter((exp) => {
          return exp.production.toLowerCase().includes(query.toLowerCase());
        });

  const convertedVal = convetproductionIdToName(productionId);

  console.log(productionId);
  return (
    <Combobox
      value={productionId}
      onChange={setProductionId}
      as='div'
      className='relative '
    >
      <div className='relative'>
        <Combobox.Input
          autoComplete='off'
          onChange={(event) => setQuery(event.target.value)}
          displayValue={() => convertedVal}
          placeholder='Select Production Name'
           className={
            errorimport != ""
            ? "px-5 h-[45px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500"
            : "px-5 h-[45px] w-full bg-gray-200 rounded-md outline-none placeholder:text-gray-500"
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
      {filteredList.length > 0 && (
        <Combobox.Options className='absolute mt-1 max-h-[160px] overflow-y-auto w-full rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10'>
          {filteredList.map((exp, index) => (
            <Combobox.Option
              className='relative cursor-pointer select-none py-2 pl-10 pr-4 text-gray-900 hover:bg-gray-100'
              key={index}
              value={exp.production_id}
            >
              {exp.production}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      )}
    </Combobox>
  );
};

export default ImportBudgetDropdown;