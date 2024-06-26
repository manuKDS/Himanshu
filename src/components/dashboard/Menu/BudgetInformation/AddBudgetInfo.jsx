import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import ExpTypeDropdown from "./ExpTypeDropdown";
import OrgDropdown from "./OrgDropdown";
import axiosInstance from "@/auth_services/instance";
import PartyNameDropdown from "./PartyNameDropdown";
import ExpenseTitleDropdown from "./ExpenseTitleDropdown";
import ExpenseNatureDropdown from "./ExpenseNatureDropdown";
import CityDropdown from "./CityDropDown";
import CountryDropdown from "./CountryDropdown";
import CurrencyDropdown from "./CurrencyDropdown";
import ProvinceDropdown from "./provinceDropdown";
import { useSelector } from "react-redux";

export default function AddBudgetInfo({ isOpen, setIsOpen, fn, state }) {
  const {
    convertExpenseId,
    convertVendorId,
    convertCityId,
    convertCountryId,
    convertCurrencyId,
    convertProvinceId,
    tableReload,
  } = fn;
  const {
    prodBudgetList,
    setProdBudgetList,
    natureList,
    expenseList,
    vendorList,
    countryList,
    provinceList,
    cityList,
    currencyList,
  } = state;

  const redux_production_id = useSelector((state) => state.production.production_id)

  const [loading, setLoading] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState("");
  const [province, setProvince] = useState("");
  const [filteredCities, setFilteredCities] = useState("");
  const [description, setDescription] = useState("");
  const [countryId, setCountryId] = useState("");
  const [provinceId, setProvinceId] = useState("");
  const [cityId, setCityId] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [amount, setAmount] = useState("");
  const [expectedDate, setExpectedDate] = useState("");
  const [currencyId, setCurrencyId] = useState("");
  const [productionId, setProductionId] = useState(55);
  const [modifiedBy, setModifiedBy] = useState(1);
  const [orgId, setOrgId] = useState(1);

  const [errorMessage, setErrorMessage] = useState("");
  // const budgedInfoId = prodBudgetList[0]?.tbl_production_budget_id;

  const clearFields = () => {
    setExpenseTitle("");
    setDescription("");
    setCountryId("");
    setProvinceId("");
    setCityId("");
    setAmount("");
    setVendorId("");
    setExpectedDate("");
    setCurrencyId("");
    setIsOpen(false);
    setLoading(false);
    setErrorMessage("");
  };

  const insertData = async () => {
    // const selectedData = {
    //   tbl_production_budget_id: budgedInfoId + 1,
    //   expense_fid: expenseTitle,
    //   description: description,
    //   vendor_fid: vendorId,
    //   city_fid: cityId,
    //   currency_fid: currencyId,
    //   expected_spend_time: expectedDate,
    //   expense_nature_fid: natureExpenseId,
    //   amount: amount,
    //   modified_by: modifiedBy,
    //   production_fid: productionId,
    //   organization_fid: orgId,
    // };

    try {
      setLoading(true);

      if (expenseTitle == "" || description == "" || vendorId == "" || countryId == "" || provinceId == "" || cityId == "" || amount == "" || expectedDate == "" || currencyId == "") {
        setErrorMessage("Every field is required!")
        setLoading(false);
      } else {
        setErrorMessage("")
        const data = {
          expense_fid: expenseTitle,
          description: description,
          vendor_fid: vendorId,
          city_fid: cityId,
          currency_fid: currencyId,
          expected_spend_time: expectedDate,
          amount: amount,
          modified_by: modifiedBy,
          production_fid: redux_production_id,
          organization_fid: orgId,
        };

        const res = await axiosInstance.post(
          process.env.API_SERVER + "production_budget",
          data
        );

        if (res.status !== 200) throw error;

        tableReload();
        // 1. Add data in state
        // setProdBudgetList([selectedData, ...prodBudgetList]);

        // 2. clear fields after adding data
        clearFields();
      }
    } catch (error) {
      setLoading(false);
      console.log(error.error_description || error.message);
    }
  };

  useEffect(() => {
    const fetchProvince = async () => {
      const res = provinceList.filter(
        (province) => province.country_fid === countryId
      );
      setProvince(res);
    };
    fetchProvince();
    setProvinceId("");
  }, [countryId]);

  useEffect(() => {
    const fetchCityList = async () => {
      const res = cityList.filter((city) => city.province_fid === provinceId);
      setFilteredCities(res);
    };
    fetchCityList();
    setCityId("");
  }, [provinceId]);

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        open={isOpen}
        onClose={() => {
          setIsOpen(false)
          clearFields()
        }}
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
              <div className='p-6 bg-[#0CA8F8] text-white text-xl font-semibold'>
                Add Budget Information
              </div>
              <div className='px-5 pt-5 pb-6'>
                <div className='space-y-4 text-sm'>

                  <label className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">Expense Title</label>
                  <ExpenseTitleDropdown
                    state={{ expenseTitle, setExpenseTitle }}
                    list={expenseList}
                    convertExpenseId={convertExpenseId}
                    error={errorMessage && expenseTitle === ""}
                  />

                  <label className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">Description</label>
                  <input
                    type='text'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder='Description'
                    className={errorMessage && description === "" ? 'bg-red-200 px-5 h-[50px] w-full rounded-md outline-none placeholder:text-gray-500' : 'bg-[#E9E9E9] px-5 h-[50px] w-full rounded-md outline-none placeholder:text-gray-500'}
                  />

                  <label className="block mb-0 text-sm font-medium text-gray-700 dark:text-white ">Party Name</label>
                  <PartyNameDropdown
                    state={{ vendorId, setVendorId }}
                    list={vendorList}
                    convertVendorId={convertVendorId}
                    error={errorMessage && vendorId === ""}
                  />


                  <div className='flex gap-4'>
                    <div className='flex-1'>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Country</label>
                      <CountryDropdown
                        state={{ countryId, setCountryId }}
                        list={countryList}
                        convertCountryId={convertCountryId}
                        error={errorMessage && countryId === ""}
                      />
                    </div>
                    <div className='flex-1'>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Province</label>

                      <ProvinceDropdown
                        state={{ provinceId, setProvinceId }}
                        list={province}
                        convertProvinceId={convertProvinceId}
                        error={errorMessage && provinceId === ""}
                      />
                    </div>
                  </div>
                  <div className='flex gap-1 m-0 p-0'>
                    <div className='flex-1 m-0 p-0'>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">City</label>

                      <CityDropdown
                        state={{ cityId, setCityId }}
                        list={filteredCities}
                        convertCityId={convertCityId}
                        error={errorMessage && cityId === ""}
                      />
                    </div>
                    <div className='flex-1'>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Amount</label>

                      <input
                        type='number' min={0}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder='Amount'
                        className={(errorMessage && amount === "") ? 'px-5 h-[50px] w-full flex-1 bg-red-200 rounded-md outline-none placeholder:text-gray-500' : 'px-5 h-[50px] w-full flex-1 bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'}
                      />
                    </div>
                  </div>
                  <div className='flex gap-4'>
                    <div className='flex-1'>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Expected Date To Spend</label>

                      <input
                        onFocus={(e) => (e.currentTarget.type = "date")}
                        value={expectedDate}
                        onChange={(e) => setExpectedDate(e.target.value)}
                        placeholder='Expected Date To Spend'
                        className={(errorMessage && expectedDate === "") ? 'px-5 h-[50px] w-full flex-1 bg-red-200 rounded-md outline-none placeholder:text-gray-500' : 'px-5 h-[50px] w-full flex-1 bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'}
                      />
                    </div>
                    <div className='flex-1'>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Currency</label>

                      <CurrencyDropdown
                        state={{ currencyId, setCurrencyId }}
                        list={currencyList}
                        convertCurrencyId={convertCurrencyId}
                        error={errorMessage && currencyId === ""}
                      />
                    </div>
                  </div>
                </div>
                <div className='mt-5 flex gap-x-4 justify-end'>
                  <button
                    className='px-6 py-2.5 min-w-[140px] bg-[#0CA8F8] text-white font-semibold rounded-md'
                    disabled={loading ? true : false}
                    onClick={insertData}
                  >
                    {loading ? "Adding..." : " Add"}
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      clearFields()
                    }}
                    className='px-6 py-2.5 bg-[#DDE0E2] min-w-[140px] text-gray-500 font-semibold rounded-md'
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
