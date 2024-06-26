import ActionBtn from "@/components/dashboard/Menu/TaxCreditExpenseManagement/ActionBtn";
import InsertData from "@/components/dashboard/Menu/TaxCreditExpenseManagement/InsertData";
import Layout from "@/components/dashboard/layout/Layout";
import { supabase } from "@/lib/supabaseClient";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeVisible, menuCurrent } from "@/redux/productionSlice";
import { getCookie } from "cookies-next";
import jwt from "jsonwebtoken";
import axiosInstance from "@/auth_services/instance";
import PaginationNew from "@/components/PaginationNew";

const CreditExpense = ({
  assistances,
  provinces,
  organizations,
  creditTypes,
}) => {
  const dispatch = useDispatch()
  const search_visible = true;
  dispatch(changeVisible({ search_visible }))
  dispatch(menuCurrent({ active_menu: "tax-credit-expense" }))

  const redux_production_id = useSelector((state) => state.production.production_id)
  const creditTypeLst = creditTypes.filter((item) => item.production_fid == redux_production_id)


  const [assitanceList, setAssitanceList] = useState(assistances);
  const [creditTypeList, setCreditTypeList] = useState(creditTypeLst);
  const [provinceList, setProvinceList] = useState(provinces);
  const [orgList, setOrgList] = useState(organizations);
  const [pageEntries, setPageEntries] = useState(10);
  const [pageTotal, setPageTotal] = useState(1);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [pageStart, setPageStart] = useState(0);
  const [pageEnd, setPageEnd] = useState(5);
  const [direction, setDirection] = useState("start");
  const [query, setQuery] = useState("");

  const [menuCheck, setmenuCheck] = useState("")

  useEffect(() => {
    let getToken = getCookie("token")
    let decodeUser = jwt.decode(getToken)
    const menus = decodeUser.menurole
    let result = menus.find(item => item.menu_fid == 11)

    if (result !== undefined) {
      setmenuCheck(result?.is_editable)
    }
    //console.log("result ", result, result.is_editable)
  }, [])


  const tableReload = async () => {
    const res = await axiosInstance.get(process.env.API_SERVER + "tax_credit_type");

    if (res.status === 201) {
      //setCreditTypeList(res.data);
      const creditTypeLst1 = res.data.filter((item) => item.production_fid == redux_production_id)
      setCreditTypeList(creditTypeLst1)
      //setCreditTypeList(res.data);
      //if (search !== "") {
      setPageCurrent(1);
      setDirection("start");
      //}
      pageHandler();
    }
  };


  useEffect(() => {
    const getList = () => {
      const creditTypeLst1 = creditTypes.filter((item) => item.production_fid == redux_production_id)
      setCreditTypeList(creditTypeLst1)
    }
    getList()
  }, [redux_production_id])

  // convert Province id to Province
  function convertProvinceId(province_id) {
    const provinceTypeName = provinceList.find(
      (item) => item.province_id === province_id
    );

    return provinceTypeName?.province;
  }

  // convert tax_assistance_id to type
  function convertTaxAssTypeName(tax_ass_id) {
    const tax_ass = assitanceList.find((item) => item.tax_assitance_id === tax_ass_id);
    return tax_ass?.type;
  }

  // convert tax_assistance_id to sub_type
  function convertTaxAssSubType(tax_ass_id) {
    const tax_ass = assitanceList.find((item) => item.tax_assitance_id === tax_ass_id);
    return tax_ass?.sub_type;
  }

  // convert tax_assistance_id to Application Name
  function convertApplicationName(tax_ass_id) {
    const tax_ass = assitanceList.find((item) => item.tax_assitance_id === tax_ass_id);
    return tax_ass?.application_name;
  }

  // convert org_id to expense_nature
  function convertOrgTypeName(org_id) {
    const org = orgList.find((item) => item.org_id === org_id);

    return org?.org_name;
  }

  // convert credit application id to assistance type
  function convertApplType(id) {
    const assistance = assitanceList.find(
      (item) => item.tax_assitance_id === id
    );

    return assistance?.type;
  }

  // convert credit sub application id to assistance type
  function convertApplSubType(id) {
    const assistance = assitanceList.find(
      (item) => item.tax_assitance_id === id
    );

    return assistance?.sub_type;
  }

  // convert credit sub application id to assistance type
  function convertTaxCreditApplName(id) {
    const assistance = assitanceList.find(
      (item) => item.tax_assitance_id === id
    );

    return assistance?.application_name;
  }

  // const filteredResults =
  query === ""
    ? creditTypeList
    : creditTypeList.filter((filter) => {
      return convertApplType(filter.app_type)
        .toLowerCase()
        .includes(query.toLowerCase());
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
    
    const pageTotalVal = Math.ceil(creditTypeList.length / pageEntries);
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

  return (
    <>
      <div className='p-5'>
        <div className='mx-auto'>
          <div className='flex gap-2 text-lg mb-6'>
            <div className='flex gap-2 text-lg'>
              <span>Menu</span>
              <span>{">"}</span>
              <span>Tax Credit Expense Management</span>
            </div>
          </div>

          {redux_production_id ? (

            <div className='px-3 py-5 rounded-lg border shadow bg-white'>
              <div className='flex justify-between items-center gap-2 px-4'>
                <div className='flex items-center gap-2 text-sm'>
                  <span>Show</span>
                  <div className='inline-flex items-center relative cursor-pointer min-w-[50px] text-sm'>
                    <select
                     defaultValue={10}
                      onChange={(e) => {
                        setPageEntries(e.target.value);
                      }}
                      className='appearance-none w-full border outline-none rounded-[4px] px-1 cursor-pointer'
                    >
                      <option value='5'>5</option>
                      <option value='10'>10</option>
                      <option value='20'>20</option>
                      <option value='50'>50</option>
                      <option value='100'>100</option>
                    </select>
                    <span className='absolute right-2 pointer-events-none'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth='1.5'
                        stroke='currentColor'
                        className='w-4 h-4'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M19.5 8.25l-7.5 7.5-7.5-7.5'
                        />
                      </svg>
                    </span>
                  </div>
                  <span>entries</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='relative flex items-center'>
                    <input
                      type='text'
                      placeholder='Search'
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className='pl-5 pr-[45px] h-[40px] w-[400px] bg-gray-100 rounded-md outline-none'
                    />
                    <span className='absolute right-[12px] pointer-events-none'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth='1.5'
                        stroke='currentColor'
                        className='w-5 h-5'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
                        />
                      </svg>
                    </span>
                  </div>
                  {menuCheck ? (
                    <InsertData
                      fn={{ convertProvinceId, convertOrgTypeName, convertTaxAssTypeName }}
                      state={{
                        assitanceList,
                        provinceList,
                        setAssitanceList,
                        setProvinceList,
                        orgList,
                        creditTypeList,
                        setCreditTypeList,
                      }}
                      tableReload={tableReload}
                    />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-400 icon icon-tabler icon-tabler-pencil-off" width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <path d="M10 10l-6 6v4h4l6 -6m1.99 -1.99l2.504 -2.504a2.828 2.828 0 1 0 -4 -4l-2.5 2.5"></path>
                      <path d="M13.5 6.5l4 4"></path>
                      <path d="M3 3l18 18"></path>
                    </svg>
                  )}

                </div>
              </div>
              <div className='relative overflow-x-auto mt-10 rounded-lg bg-[#E9E9E9] p-3'>
                <table className='w-full border-separate border-spacing-y-2'>
                  <thead className='text-sm text-slate-700'>
                    <tr>
                      <th className='px-4 py-2 text-left'>
                        Application <br /> Type
                      </th>
                      <th className='px-4 py-2 text-left'>
                        Application <br /> Sub - Type
                      </th>
                      <th className='px-4 py-2 text-left'>
                        Province <br /> Name
                      </th>
                      <th className='px-4 py-2 text-left'>
                        Tax Credit <br /> Application Name
                      </th>
                      <th className='px-4 py-2 text-left'>
                        Tax Credit <br /> Application Date
                      </th>
                      <th className='px-4 pl-8 py-2 text-left'>Action</th>
                    </tr>
                  </thead>
                  <tbody className='text-xs'>
                    {creditTypeList
                      .slice(pageStart, pageEnd)
                      .map((data, index) => {
                        return (
                          <tr className='bg-white' key={data.tax_credit_type_id}>
                            <td className='px-4 py-3 text-left'>
                              {convertApplType(data.app_type)}
                            </td>
                            <td className='px-4 py-3 text-left'>
                              {convertTaxAssSubType(data.app_type)}
                            </td>
                            <td className='px-4 py-3 text-left'>
                              {convertProvinceId(data.province_fid)}
                            </td>
                            <td className='px-4 py-3 text-left'>
                              {convertApplicationName(data.app_type)}
                            </td>

                            <td className='px-4 py-3 text-left'>
                              {moment(data.created_at).format("MMM Do, YYYY")}
                            </td>

                            <td className='px-4 py-3 text-left'>
                              {menuCheck ? (
                                <ActionBtn
                                  tax_credit_id={data.tax_credit_type_id}
                                  data={data}
                                  fn={{
                                    convertProvinceId,
                                    convertOrgTypeName,
                                    convertApplType,
                                    convertApplSubType,
                                  }}
                                  state={{
                                    creditTypeList,
                                    setCreditTypeList,
                                    provinceList,
                                    setProvinceList,
                                    assitanceList,
                                    provinceList,

                                  }}
                                  tableReload={tableReload}
                                />
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-400 icon icon-tabler icon-tabler-pencil-off" width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                  <path d="M10 10l-6 6v4h4l6 -6m1.99 -1.99l2.504 -2.504a2.828 2.828 0 1 0 -4 -4l-2.5 2.5"></path>
                                  <path d="M13.5 6.5l4 4"></path>
                                  <path d="M3 3l18 18"></path>
                                </svg>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
              {creditTypeList.length > 0 &&
                <div className='flex gap-2 items-center justify-between pt-4 px-4'>
                  <span className='font-semibold text-sm'>
                    Showing {pageStart + 1} to{" "}
                    {creditTypeList.length > pageEnd
                      ? pageEnd
                      : creditTypeList.length}{" "}
                    of {""}
                    {creditTypeList.length} entries
                  </span>
                  <PaginationNew pageCurrent={pageCurrent} setDirection={setDirection} pageTotal={pageTotal} />
                </div>
              }
            </div>

          ) : (
            <span className="text-red-400">Please choose a production</span>
          )}

        </div>
      </div>
    </>
  );
};

export async function getServerSideProps() {
  const tbl_tax_assistance = await supabase
    .from("tbl_tax_assistance")
    .select()
    .order("created_at", { ascending: false });

  const tbl_tax_credit_type = await supabase
    .from("tbl_tax_credit_type")
    .select()
    .order("created_at", { ascending: false });

  const tbl_province = await supabase
    .from("tbl_province")
    .select()
    .order("created_at", { ascending: false });

  const tbl_organization = await supabase
    .from("tbl_organization")
    .select()
    .order("org_id", { ascending: false });

  return {
    props: {
      creditTypes: tbl_tax_credit_type.data,
      assistances: tbl_tax_assistance.data,
      provinces: tbl_province.data,
      organizations: tbl_organization.data,
    },
  };
}

export default CreditExpense;

CreditExpense.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
