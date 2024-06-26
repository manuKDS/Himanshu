import ActionBtn from "@/components/dashboard/Menu/BudgetInformation/ActionBtn";
import InsertData from "@/components/dashboard/Menu/BudgetInformation/InsertData";
import Layout from "@/components/dashboard/layout/Layout";
import axiosInstance from "@/auth_services/instance";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeVisible, menuCurrent } from "@/redux/productionSlice";
import { getCookie } from "cookies-next";
import jwt from "jsonwebtoken";
import ImportBudget from "@/components/dashboard/Menu/BudgetInformation/ImportBudget";
import ImportBudgetDropdown from "@/components/dashboard/Menu/BudgetInformation/ImportBudgetDropDown";
import jsPDF from 'jspdf';
import PaginationNew from "@/components/PaginationNew";

const BudgetInformation = ({
  production_Budget_list,
  expense_list,
  nature_list,
  vendor_list,
  country_list,
  city_lists,
  province_list,
  currency_list,
}) => {
  const dispatch = useDispatch();
  const search_visible = true;
  dispatch(changeVisible({ search_visible }))
  dispatch(menuCurrent({ active_menu: "budget-information" }))

  const redux_production_id = useSelector(
    (state) => state.production.production_id
  );
  const production_Budget_Lst = production_Budget_list.filter(
    (item) => item.production_fid == redux_production_id
  );

  const [prodBudgetList, setProdBudgetList] = useState(production_Budget_Lst);
  const [expenseList, setExpenseList] = useState(expense_list);
  const [natureList, setNatureList] = useState(nature_list);
  const [vendorList, setVendorList] = useState(vendor_list);
  const [countryList, setCounryList] = useState(country_list);
  const [cityList, setCityList] = useState(city_lists);
  const [provinceList, setProvinceList] = useState(province_list);
  const [currencyList, setCurrencyList] = useState(currency_list);

  const [pageEntries, setPageEntries] = useState(10);
  const [pageTotal, setPageTotal] = useState(1);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [pageStart, setPageStart] = useState(0);
  const [pageEnd, setPageEnd] = useState(5);
  const [direction, setDirection] = useState("start");
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [production, setproduction] = useState([]);
  const [production_id, setproduction_id] = useState("");
  const [productionId, setProductionId] = useState("");

  const [menuCheck, setmenuCheck] = useState("");
  const [errorimport, seterrorimport] = useState("");
  var total = 0;

  //--------------------- Report Print ------------------------
  const reportTemplateRef = useRef(null);

  const handleGeneratePdf = () => {
    // const doc = new jsPDF({
    //   format: 'a4',
    //   unit: 'px',

    // });

    const doc = new jsPDF('l', 'pt', 'a3', true);
    //Adding the fonts.
    doc.setFont('Inter-Regular', 'normal');

    doc.html(reportTemplateRef.current, {
      async callback(doc) {
        await doc.save('Budget Information  ' + convetproductionIdToName(redux_production_id));
      },
    });
  };

  // CONVERT production_id to production
  function convetproductionIdToName(production_id) {
    const production1 = productions_list.find(
      (item) => item.production_id == production_id
    );
    return production1?.production;
  }
  //--------------------------------- Report End ----------------


  useEffect(() => {
    let getToken = getCookie("token");
    let decodeUser = jwt.decode(getToken);
    const menus = decodeUser.menurole;
    let result = menus.find((item) => item.menu_fid == 8);
    if (result !== undefined) {
      setmenuCheck(result?.is_editable);
    }
  }, []);

  // Load series/features list to display on Import Budget 
  useEffect(() => {
    const getProduction = async () => {
      const { data, error } = await axiosInstance.get(
        process.env.API_SERVER + "production"
      );
      const resultFinal = [];
      const result = data.filter((item) => item.parent_id == null);
      const resultNew = result.map((item) => {
        const productionId = item.production_id;

        if (item.type === 2) {
          // series only --- add to final list
          data.map((series) => {
            if (series.parent_id == productionId) {
              series.production = item.production + " - " + series.production;
              resultFinal.push(series);
            }
          });
        } else {
          // features only --- add to final list
          resultFinal.push(item);
        }
      });

      if (production_id == "") {
        setproduction_id(resultFinal[0].production_id);
      }
      const finalList = resultFinal.filter(
        (item) => item.production_id != redux_production_id
      );
      console.log("redux_production_id ", redux_production_id);
      setproduction(finalList);
    };
    getProduction();
  }, [redux_production_id]);

  // leload budget list on production changed
  useEffect(() => {
    const getList = () => {
      const production_Budget_Lst = production_Budget_list.filter(
        (item) => item.production_fid == redux_production_id
      );
      setProdBudgetList(production_Budget_Lst);
    };
    getList();
  }, [redux_production_id]);



  // CONVERT production_id to production
  function convetproductionIdToName(production_id) {
    const production1 = production.find(
      (item) => item.production_id == production_id
    );
    return production1?.production;
  }


  // convert expense_id to expense_title
  function convertExpenseId(exp_id) {
    const expense = expenseList.find((item) => item.expense_id === exp_id);
    return expense?.expense_title;
  }


  // convert expense_id to expense_code
  function convertExpenseCode(exp_id) {
    const expense = expenseList.find((item) => item.expense_id === exp_id);
    return expense?.expense_code;
  }


  // find expense_nature_type_fid from tbl_expense column expense_type_fid
  function findExpenseNatureType(exp_id) {
    const expense = expenseList.find((item) => item.expense_id === exp_id);
    return expense?.expense_type_fid;
  }


  // convert exp_typeFid to expense_nature
  function convertExpenseNatureId(nature_id) {
    const nature = natureList.find(
      (item) => item.expense_nature_id === nature_id
    );
    return nature?.expense_nature;
  }


  // convert vendor_id to vendor_name
  function convertVendorId(vendor_id) {
    const vendor = vendorList.find((item) => item.vendor_id === vendor_id);
    return vendor?.name;
  }


  // convert country_id to country_name
  function convertCountryId(country_id) {
    const country = countryList.find((item) => item.country_id === country_id);
    return country?.country;
  }


  // convert city_id to city_name
  function convertCityId(city_id) {
    const city = cityList.find((item) => item.city_id === city_id);
    return city?.city;
  }


  // find province from city
  function findProvinceByCity(city_id) {
    const city = cityList.find((item) => item.city_id === city_id);
    return city?.province_fid;
  }


  // convert province_id to province
  function convertProvinceId(province_id) {
    const province = provinceList.find(
      (item) => item.province_id === province_id
    );
    return province?.province;
  }


  // find province from city
  function findCountryByProvince(province_id) {
    const province = provinceList.find(
      (item) => item.province_id === province_id
    );
    return province?.country_fid;
  }


  // convert currenct_id to currency
  function convertCurrencyId(currency_id) {
    const currency = currency_list.find(
      (item) => item.currency_id === currency_id
    );
    return currency?.currency;
  }


  // convert orginzation_id to organization name
  function convertOrgTypeName(org_id) {
    const org = orgList.find((item) => item.org_id === org_id);
    return org?.org_name;
  }


  // convert currenct_id to currency_code
  function convertCurrencyCode(currency_id) {
    const currency = currency_list.find(
      (item) => item.currency_id === currency_id
    );
    return currency?.currency_code;
  }


  const filteredResults =
    query === ""
      ? prodBudgetList
      : prodBudgetList.filter((budget) => {
        return budget.expense_fid.toLowerCase().includes(query.toLowerCase());
      });

  // Page Previous Next First Last
  useEffect(() => {
    pageHandler();
  }, [direction, pageCurrent]);

  // Change Entries 5, 10, 15, 20 per page
  useEffect(() => {
    setPageCurrent(1);
    setDirection("start");
    pageHandler();
  }, [pageEntries]);

  // Search input handler
  useEffect(() => {
    setPageCurrent(1);
    setDirection("start");
  }, [query]);

  const pageHandler = () => {
    // var num1 = prodBudgetList.length / pageEntries;
    // var num2 = Math.round(prodBudgetList.length / pageEntries);
    // if (num1 > num2) {
    //   num2 = num2 + 1;
    // }
    // setPageTotal(num2);

    const pageTotalVal = Math.ceil(prodBudgetList.length / pageEntries);
    setPageTotal(pageTotalVal);

    switch (direction) {
      case "prev2":
        if (pageCurrent > 2) setPageCurrent(pageCurrent - 2);
        else setPageCurrent(1);
        break;
      case "prev":
        if (pageCurrent > 1) setPageCurrent(pageCurrent - 1);
        else setPageCurrent(1);
        break;
      case "next2":
        if (pageCurrent < pageTotalVal - 2) setPageCurrent(pageCurrent + 2);
        else setPageCurrent(pageTotalVal);
        break;
      case "next":
        if (pageCurrent < pageTotalVal - 1) setPageCurrent(pageCurrent + 1);
        else setPageCurrent(pageTotalVal);
        break;
      case "start":
        setPageCurrent(1);
        break;
      case "end":
        setPageCurrent(pageTotalVal);
        break;
      default:
        //setPageCurrent(1)
        break;
    }

    setDirection("");
    // var pgStart = pageEntries * (pageCurrent - 1);
    // var pgEnd = pgStart + parseInt(pageEntries);
    // setPageStart(pgStart);
    // setPageEnd(pgEnd);
  };

  useEffect(() => {
    var pgStart = pageEntries * (pageCurrent - 1);
    var pgEnd = pgStart + parseInt(pageEntries);
    setPageStart(pgStart);
    setPageEnd(pgEnd);
  }, [direction, pageCurrent, pageEntries]);


  const tableReload = async () => {
    const res = await axiosInstance.get(process.env.API_SERVER + "production_budget");
    console.log("Res.data ", res.data)
    console.log("redux_production_id - ", redux_production_id)

    const production_Budget_Lst = res.data.filter(
      (item) => item.production_fid == redux_production_id
    );
    console.log("production_Budget_Lst ", production_Budget_Lst)
    setProdBudgetList(production_Budget_Lst);
    console.log("ProdBudgetList ", prodBudgetList)
    if (query !== "") {
      setPageCurrent(1);
      setDirection("start");
    }
    pageHandler();

  };


  useEffect(() => {
    console.log("ProdBudgetList -- ", prodBudgetList)
  }, [prodBudgetList])



  const handleImport = () => {
    seterrorimport("")
    if (productionId == "") {
      seterrorimport("Select any features / series")
    } else {
      setIsOpen(true)
    }

  }

  return (
    <div className="p-5 w-full">
      <div className="mx-auto w-full">
        <div className="flex justify-between gap-2 text-lg mb-4 w-full ">
          <span>Menu &gt; Budget Information</span>

          {/* <button className="text-right px-6 py-2.5 bg-blue-500 text-white rounded-md" onClick={handleGeneratePdf}>
          Generate Pdf
        </button> */}

          {/* <button className="ml-4 bg-green-500 hover:bg-blue-700 text-sm text-white font-bold py-2 px-8 rounded-xl" onClick={handleGeneratePdf}>
            Generate Pdf
          </button> */}
        </div>
      </div>

      {redux_production_id ? (
        <div  className="px-3 py-5 rounded-lg border shadow bg-white">
          <div className="flex justify-between items-center gap-2 px-4">
            <div className="flex items-center gap-2 text-sm">
              <span>Show</span>
              <div className="inline-flex items-center relative cursor-pointer min-w-[50px] text-sm">
                <select
                  defaultValue={10}
                  onChange={(e) => {
                    setPageEntries(e.target.value);
                  }}
                  className="appearance-none w-full border outline-none rounded-[4px] px-1 cursor-pointer"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <span className="absolute right-2 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </span>
              </div>
              <span>entries</span>
            </div>
            <div className="flex gap-2">

              <ImportBudgetDropdown
                state={{ productionId, setProductionId, errorimport }}
                list={production}
                convetproductionIdToName={convetproductionIdToName}
              />
              <button
                onClick={() => handleImport()}
                className="px-5 py-0 rounded-md bg-[#0CA8F8] text-white text-sm"
              >
                Import Budget
              </button>
              {/* {productionId} */}

            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-5 pr-[45px] h-[40px] w-[300px] bg-gray-100 rounded-md outline-none"
                />
                <span className="absolute right-[12px] pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                </span>
              </div>
              {menuCheck ? (
                <InsertData
                  fn={{
                    convertOrgTypeName,
                    convertExpenseId,
                    convertVendorId,
                    convertExpenseNatureId,
                    convertCityId,
                    convertCountryId,
                    convertCurrencyId,
                    convertProvinceId,
                    tableReload,
                  }}
                  state={{
                    prodBudgetList,
                    setProdBudgetList,
                    natureList,
                    expenseList,
                    vendorList,
                    countryList,
                    provinceList,
                    cityList,
                    currencyList,
                  }}
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-gray-400 icon icon-tabler icon-tabler-pencil-off"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M10 10l-6 6v4h4l6 -6m1.99 -1.99l2.504 -2.504a2.828 2.828 0 1 0 -4 -4l-2.5 2.5"></path>
                  <path d="M13.5 6.5l4 4"></path>
                  <path d="M3 3l18 18"></path>
                </svg>
              )}
            </div>
          </div>
          <div ref={reportTemplateRef} className="relative overflow-x-auto mt-10 rounded-lg bg-[#E9E9E9] p-3">
            <table className="w-full border-separate border-spacing-y-2">
              <thead className="text-sm text-slate-700">
                <tr>
                  <th className="px-4 py-2 text-left">
                    Expense <br />
                    Title
                  </th>
                  <th className="px-4 py-2 text-left">
                    Expense <br />
                    Code
                  </th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">
                    Party <br />
                    Name
                  </th>
                  <th className="px-4 py-2 text-left">Location</th>
                  <th className="px-4 py-2 text-left">
                    Nature of
                    <br />
                    Expense
                  </th>
                  <th className="px-4 py-2 text-right">Amount</th>
                  <th className="px-4 py-2 text-left ">Currency</th>
                  <th className="px-4 py-2 text-left ">
                    Expected <br />
                    Time To <br />
                    Spend
                  </th>
                  <th className="px-4 py-2 text-left ">Last Modified</th>
                  <th className="px-4 py-2 text-left ">Action</th>
                </tr>
              </thead>

              <tbody className="text-xs">
                {filteredResults
                  .slice(pageStart, pageEnd)
                  .map((data, index) => {
                    total += data.amount;
                    return (
                      <tr className="bg-white" key={index}>
                        <td className="px-4 py-3 text-left w-[100px]">
                          {convertExpenseId(data.expense_fid)}
                        </td>
                        <td className="px-4 py-3 text-left w-[100px]">
                          {convertExpenseCode(data.expense_fid)}
                        </td>
                        <td className="px-4 py-3 text-left w-[170px]">
                          {data.description}
                        </td>
                        <td className="px-4 py-3 text-left w-[150px]">
                          {convertVendorId(data.vendor_fid)}
                        </td>
                        <td className="px-4 py-3 text-left w-[180px]">
                          {convertCountryId(
                            findCountryByProvince(
                              findProvinceByCity(data.city_fid)
                            )
                          )}{" "}
                          -{" "}
                          {convertProvinceId(findProvinceByCity(data.city_fid))}{" "}
                          - {convertCityId(data.city_fid)}
                        </td>
                        <td className="px-4 py-3 text-left w-[140px]">
                          {convertExpenseNatureId(
                            findExpenseNatureType(data.expense_fid)
                          )}
                        </td>
                        <td className="px-4 py-3 w-[100px] text-right">
                          {data.amount.toLocaleString(0, "en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </td>
                        <td className="px-4 py-3  text-left">
                          {convertCurrencyCode(data.currency_fid)}
                        </td>
                        <td className="px-4 py-3 text-left">
                          {moment(data.expected_spend_time).format(
                            "MMM Do, YYYY"
                          )}
                        </td>
                        <td className="px-4 py-3 text-left">
                          {moment(data.created_at).format("MMM Do, YYYY")}
                        </td>

                        <td className="px-4 py-3 text-left">
                          {menuCheck ? (
                            <ActionBtn
                              data={data}
                              fn={{
                                convertOrgTypeName,
                                convertExpenseId,
                                convertVendorId,
                                convertExpenseNatureId,
                                convertCityId,
                                convertCountryId,
                                convertCurrencyId,
                                convertProvinceId,
                                tableReload,
                              }}
                              state={{
                                prodBudgetList,
                                setProdBudgetList,
                                natureList,
                                expenseList,
                                vendorList,
                                countryList,
                                provinceList,
                                cityList,
                                currencyList,
                              }}
                            />
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="text-gray-400 icon icon-tabler icon-tabler-pencil-off"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              strokeWidth="2"
                              stroke="currentColor"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                              ></path>
                              <path d="M10 10l-6 6v4h4l6 -6m1.99 -1.99l2.504 -2.504a2.828 2.828 0 1 0 -4 -4l-2.5 2.5"></path>
                              <path d="M13.5 6.5l4 4"></path>
                              <path d="M3 3l18 18"></path>
                            </svg>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                {total > 0 && (
                  <tr className="">
                    <td className="px-4 py-3 text-left w-[100px]"></td>
                    <td className="px-4 py-3 text-left w-[100px]"></td>
                    <td className="px-4 py-3 text-left w-[170px]"></td>
                    <td className="px-4 py-3 text-left w-[150px]"></td>
                    <td className="px-4 py-3 text-left w-[180px]"></td>
                    <td className="px-4 py-3 text-left w-[140px]">Total</td>

                    <td className="px-4 py-3 text-right">
                      {total.toLocaleString(0, "en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>

                    <td className="px-4 py-3 text-left"></td>
                    <td className="px-4 py-3 text-left"></td>
                    <td className="px-4 py-3 text-left"></td>
                    <td className="px-4 py-3 text-left"></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {prodBudgetList.length > 0 && (
            <div className="flex gap-2 items-center justify-between pt-4 px-4">
              <span className="font-semibold text-sm">
                Showing {pageStart + 1} to{" "}
                {prodBudgetList.length > pageEnd
                  ? pageEnd
                  : prodBudgetList.length}{" "}
                of {prodBudgetList.length} entries
              </span>
              <PaginationNew pageCurrent={pageCurrent} setDirection={setDirection} pageTotal={pageTotal} />
            </div>
          )}
          <ImportBudget
            // fn={{ deleteHandel }}
            state={{ isOpen, setIsOpen, convetproductionIdToName, tableReload, productionId }}
            data={{ production, redux_production_id }}
          />
        </div>
      ) : (
        <span className="text-red-400">Please choose a production</span>
      )}
    </div>
  );
};

export async function getServerSideProps() {
  // 1. Fetching all data from tbl_production_budget
  const fetchProductionBudget = await axiosInstance.get(
    process.env.API_SERVER + "production_budget"
  );

  // 3. Fetching all data from tbl_expense
  const fetchExpenseList = await axiosInstance.get(
    process.env.API_SERVER + "expense"
  );

  // 4. Fetching all data from tbl_expense_nature
  const fetchExpenseNatureList = await axiosInstance.get(
    process.env.API_SERVER + "expense_nature"
  );

  // 5. Fetching all data from tbl_vendor
  const fetchVendorList = await axiosInstance.get(
    process.env.API_SERVER + "vendor"
  );

  // 6. Fetching all data from tbl_city
  const fetchCityList = await axiosInstance.get(
    process.env.API_SERVER + "city"
  );

  // 7. Fetching all data from tbl_country
  const fetchCountryList = await axiosInstance.get(
    process.env.API_SERVER + "country"
  );

  // 7. Fetching all data from tbl_province
  const fetchProvinceList = await axiosInstance.get(
    process.env.API_SERVER + "province"
  );

  // 8. Fetching all data from tbl_currency
  const fetchCurrencyList = await axiosInstance.get(
    process.env.API_SERVER + "currency"
  );

  return {
    props: {
      production_Budget_list: fetchProductionBudget.data,
      expense_list: fetchExpenseList.data,
      nature_list: fetchExpenseNatureList.data,
      vendor_list: fetchVendorList.data,
      country_list: fetchCountryList.data,
      city_lists: fetchCityList.data,
      province_list: fetchProvinceList.data,
      currency_list: fetchCurrencyList.data,
    },
  };
}

export default BudgetInformation;

BudgetInformation.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
