import { Dialog, Transition } from "@headlessui/react";
import axiosInstance from "@/auth_services/instance";
import { Fragment, useEffect, useState } from "react";
import CityDropdown from "./CityDropDown";
import CountryDropdown from "./CountryDropdown";
import CurrencyDropdown from "./CurrencyDropdown";
import EditCountryDropdown from "./EditCountryDropdown";
import EditExpTypeDropdown from "./EditExpTypeDropdown";
import ExpenseNatureDropdown from "./ExpenseNatureDropdown";
import ExpenseTitleDropdown from "./ExpenseTitleDropdown";
import PartyNameDropdown from "./PartyNameDropdown";
import ProvinceDropdown from "./provinceDropdown";

export default function UpdateBudget({ isOpen, setIsOpen, data, state, fn }) {
  let budgetInfo = data;

  const {
    convertExpenseNatureId,
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

  // console.log(exp_data);
  const [loading, setLoading] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [expenseTitle, setExpenseTitle] = useState("");
  const [description, setDescription] = useState("");
  const [natureExpenseId, setNatureExpenseId] = useState("");
  const [countryId, setCountryId] = useState("");
  const [defaultCountry, setDefaultCountry] = useState("");
  const [provinceId, setProvinceId] = useState("");
  const [cityId, setCityId] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [amount, setAmount] = useState("");
  const [expectedDate, setExpectedDate] = useState("");
  const [currencyId, setCurrencyId] = useState("");
  const [productionId, setProductionId] = useState(55);
  const [modifiedBy, setModifiedBy] = useState(1);
  const [orgId, setOrgId] = useState(1);
  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [provinceLoad, setProvinceLoad] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    handleSetData()
    fetchData();
  }, [isOpen, data]);

  const handleSetData = () => {
    setExpenseTitle(data.expense_fid);
    setDescription(data.description);
    setCityId(data.city_fid);
    setCity(data.city_fid);
    setVendorId(data.vendor_fid);
    setAmount(data.amount);
    setExpectedDate(data.expected_spend_time);
    setCurrencyId(data.currency_fid);
    setOrgId(data.organization_fid);
    setProductionId(data.production_fid);
    setModifiedBy(data.modified_by);
    setErrorMessage("");
  }

  const updateData = async (budgetId) => {
    // 1. Add data in object
    // const selectedData = {
    //   expense_fid: expenseTitle,
    //   description: description,
    //   vendor_fid: vendorId,
    //   city_fid: cityId,
    //   currency_fid: currencyId,
    //   expected_spend_time: expectedDate,
    //   amount: amount,
    //   modified_by: modifiedBy,
    //   production_fid: productionId,
    //   organization_fid: orgId,
    // };

    try {
      setLoading(true);
      if (expenseTitle == "" || description == "" || vendorId == "" || countryId == "" || provinceId == "" || cityId == "" || amount == "" || expectedDate == "" || currencyId == "" || natureExpenseId == "") {
        setErrorMessage("Every field is required!")
        setLoading(false);
      } else {
        setErrorMessage("");
        const res = await axiosInstance.put(
          process.env.API_SERVER + "production_budget/" + budgetId,
          {
            expense_fid: expenseTitle,
            description: description,
            vendor_fid: vendorId,
            city_fid: cityId,
            currency_fid: currencyId,
            expected_spend_time: expectedDate,
            amount: amount,
            modified_by: modifiedBy,
            production_fid: productionId,
            organization_fid: orgId,
          }
        );

        if (res.status !== 200) throw error;

        tableReload();
        // 1. Add data in state
        // setProdBudgetList((prev) =>
        //   prev.map((item) =>
        //     item.tbl_production_budget_id === budgetId ? selectedData : item
        //   )
        // );

        setIsOpen(false);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error.error_description || error.message);
    }
  };

  const fetchData = () => {
    // Find  nature_expense title from tbl_expense column expense_type_fid
    const findNatureExp = expenseList.find(
      (n) => n.expense_id === expenseTitle
    );
    setNatureExpenseId(findNatureExp?.expense_type_fid);

    // Find province_fid from tbl_city column province_fid
    const findProvince = cityList.find((c) => c.city_id === city);

    setProvince(findProvince?.province_fid);
    setProvinceId(findProvince?.province_fid);

    // Find country_fid from tbl_province column country_fid
    const findCountry = provinceList.find((p) => p.province_id === province);

    // setCountryId(findCountry?.country_fid);
    setCountry(findCountry?.country_fid);
    setCountryId(findCountry?.country_fid);
  };

  useEffect(() => {
    // Find province from tbl_province column country_fid
    const res = provinceList.filter((p) => p.country_fid === country);
    setSelectedProvince(res);

    fetchData();
  }, [province, country, city]);

  useEffect(() => {
    const fetchCityList = async () => {
      const res = cityList.filter((c) => c.province_fid === province);
      setSelectedCities(res);
    };
    fetchCityList();
    if (!provinceLoad) {
      setProvinceId(province);
    }
    setProvinceLoad(true);
  }, [isOpen, province]);

  useEffect(() => {
    const fetchProvince = () => {
      const res = provinceList.filter((p) => p.country_fid === countryId);
      setSelectedProvince(res);
    };

    fetchProvince();
    setProvinceId("");
    setCityId("");
  }, [countryId]);

  useEffect(() => {
    const fetchCityList = () => {
      const res = cityList.filter((c) => c.province_fid === provinceId);
      setSelectedCities(res);
    };

    fetchCityList();

    if (!provinceLoad) {
      setCityId("");
    }

    //console.log({ provinceLoad: provinceLoad });
    setProvinceLoad(false);
  }, [provinceId]);

  useEffect(() => {
    const findNatureExp = expenseList.find(
      (n) => n.expense_id === expenseTitle
    );

    setNatureExpenseId(findNatureExp?.expense_type_fid);
  }, [expenseTitle]);

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        open={isOpen}
        onClose={() => {
          setIsOpen(false)
          handleSetData()
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
                Update Budget Information
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

                  <div className='flex gap-3'>
                    <div className='flex-1'>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Party Name</label>
                      <PartyNameDropdown
                        state={{ vendorId, setVendorId }}
                        list={vendorList}
                        convertVendorId={convertVendorId}
                        error={errorMessage && vendorId === ""}
                      />
                    </div>
                    <div className='flex-1'>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Nature of Expense</label>
                      <input
                        type='text'
                        readOnly
                        value={convertExpenseNatureId(natureExpenseId)}
                        className={(errorMessage && natureExpenseId) ? 'px-5 h-[50px] cursor-default w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500' : 'px-5 h-[50px] cursor-default w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'}
                      />
                      {/* <ExpenseNatureDropdown
                        state={{ natureExpenseId, setNatureExpenseId }}
                        list={natureList}
                        convertExpenseNatureId={convertExpenseNatureId}
                      /> */}
                    </div>
                  </div>
                  <div className='flex gap-4'>
                    <div className='flex-1'>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Country</label>
                      <EditCountryDropdown
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
                        list={selectedProvince}
                        convertProvinceId={convertProvinceId}
                        error={errorMessage && provinceId === ""}
                      />
                    </div>
                  </div>
                  <div className='flex gap-4'>
                    <div className='flex-1'>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">City</label>
                      <CityDropdown
                        state={{ cityId, setCityId }}
                        list={selectedCities}
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
                    onClick={() => updateData(data.tbl_production_budget_id)}
                  >
                    {loading ? "Updating..." : " Update"}
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      handleSetData()
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
