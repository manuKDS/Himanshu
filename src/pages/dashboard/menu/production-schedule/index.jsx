import ActionBtn from "@/components/dashboard/Menu/ProductionSchedule/ActionBtn";
import InsertData from "@/components/dashboard/Menu/ProductionSchedule/InsertData";
import Layout from "@/components/dashboard/layout/Layout";
import axiosInstance from "@/auth_services/instance";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeVisible, menuCurrent } from "@/redux/productionSlice";
import { getCookie } from "cookies-next";
import jwt from "jsonwebtoken";
import PaginationNew from "@/components/PaginationNew";



const ProductionSchedule = ({ scheduleLists, userLists, productionLists }) => {
  const dispatch = useDispatch()
  const search_visible = true;
  dispatch(changeVisible({ search_visible }))
  dispatch(menuCurrent({ active_menu: "productio-schedule" }))

  const redux_production_id = useSelector((state) => state.production.production_id)
  const redux_production_name = useSelector((state) => state.production.production_name)
  const scheduleLst = scheduleLists.filter((item) => item.production_fid == redux_production_id)

  const [prodScheduleLists, setProdScheduleLists] = useState(scheduleLst);
  const [prodList, setProdList] = useState(productionLists);
  const [userList, setUserList] = useState(userLists);
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
    let result = menus.find(item => item.menu_fid == 10)

    if (result !== undefined) {
      setmenuCheck(result?.is_editable)
    }
    //console.log("result ", result, result.is_editable)

  }, [])

  useEffect(() => {
    const getList = () => {
      const scheduleLst1 = scheduleLists.filter((item) => item.production_fid == redux_production_id)
      setProdScheduleLists(scheduleLst1)
    }
    getList()
  }, [redux_production_id])

  const tableReload = async () => {
    const res = await axiosInstance.get(process.env.API_SERVER + "production_schedule");
    if (res.status === 201) {
      const scheduleLst1 = res.data.filter((item) => item.production_fid == redux_production_id)
      setProdScheduleLists(scheduleLst1)

      if (query !== "") {
        setPageCurrent(1);
        setDirection("start");
      }
      pageHandler();
    }
  };

  // convert exp_typeFid to expense_nature
  function convetExpTypeName(exp_type) {
    const expenseTypeName = natureList.find(
      (item) => item.expense_nature_id === exp_type
    );

    return expenseTypeName?.expense_nature;
  }

  // convert production_id to production_name
  function convertProductionName(prodId) {
    const production = prodList.find((p) => p.production_id === prodId);

    return production?.production;
  }
  // convert exp_typeFid to expense_nature
  function convertOrgTypeName(org_id) {
    const org = orgList.find((item) => item.org_id === org_id);

    return org?.org_name;
  }

  // convert last_modified_id to user_id
  function convertLastModifiedBy(id) {
    const user = userList.find((item) => item.user_id === id);

    return user?.user_name;
  }

  const filteredResults =
    query === ""
      ? prodScheduleLists
      : prodScheduleLists.filter((production) => {
        return production.incorp_date
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
    
    const pageTotalVal = Math.ceil(prodScheduleLists.length / pageEntries);
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
    <div className='p-5'>
      <div className='mx-auto'>
        <div className='flex gap-2 text-lg mb-6'>
          <span>Menu</span>
          <span>{">"}</span>
          <span>Production Schedule</span>
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
                  fn={{ convetExpTypeName, convertOrgTypeName, tableReload }}
                  state={{
                    prodScheduleLists,
                    setProdScheduleLists,
                  }}
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
                    Production
                    <br />
                    Name
                  </th>
                  <th className='px-4 py-2 text-left'>
                    Production
                    <br />
                    Company
                    <br />
                    Incorporated Date
                  </th>
                  <th className='px-4 py-2 text-left'>
                    Pre -
                    <br />
                    Production
                    <br />
                    Start Date
                  </th>
                  <th className='px-4 py-2 text-left'>
                    Pre -
                    <br />
                    Production
                    <br />
                    End Date
                  </th>
                  <th className='px-4 py-2 text-left'>
                    Production
                    <br />
                    Start Date
                  </th>
                  <th className='px-4 py-2 text-left'>
                    Production
                    <br />
                    End Date
                  </th>
                  <th className='px-4 py-2 text-left'>
                    Post-
                    <br />
                    Production
                    <br />
                    Start Date
                  </th>
                  <th className='px-4 py-2 text-left'>
                    Post-
                    <br />
                    Production
                    <br />
                    End Date
                  </th>
                  {/* <th className='px-4 py-2 text-left'>
                  Modified <br />
                  By
                </th> */}
                  <th className='px-4 py-2 text-left'>
                    Modified <br />
                    On
                  </th>
                  <th className='py-2 text-left pl-[25px]'>Action</th>
                </tr>
              </thead>
              <tbody className='text-xs'>
                {filteredResults.slice(pageStart, pageEnd).map((data, index) => {
                  return (
                    <tr className='bg-white' key={index}>
                      <td className='px-4 py-3 text-left'>
                        {redux_production_name}
                      </td>
                      <td className='px-4 py-3 text-left'>
                        {moment(data.incorp_date).format("MMM Do, YYYY")}
                      </td>
                      <td className='px-4 py-3 text-left'>
                        {moment(data.pre_prod_start_date).format("MMM Do, YYYY")}
                      </td>
                      <td className='px-4 py-3 text-left'>
                        {moment(data.pre_prod_end_date).format("MMM Do, YYYY")}
                      </td>
                      <td className='px-4 py-3 text-left'>
                        {moment(data.prod_start_date).format("MMM Do, YYYY")}
                      </td>
                      <td className='px-4 py-3 text-left'>
                        {moment(data.prod_end_date).format("MMM Do, YYYY")}
                      </td>
                      <td className='px-4 py-3 text-left'>
                        {moment(data.post_prod_start_date).format("MMM Do, YYYY")}
                      </td>
                      <td className='px-4 py-3 text-left'>
                        {moment(data.post_prod_end_date).format("MMM Do, YYYY")}
                      </td>
                      {/* <td className='px-4 py-3 text-left'>
                      {convertLastModifiedBy(data.modified_by)}
                    </td> */}
                      <td className='px-4 py-3 text-left'>
                        {moment(data.created_at).format("MMM Do, YYYY")}
                      </td>
                      <td className='px-4 py-3 text-left'>
                        {menuCheck ? (
                          <ActionBtn
                            data={data}
                            fn={{
                              convetExpTypeName,
                              convertOrgTypeName,
                              tableReload,
                            }}
                            state={{
                              prodScheduleLists,
                              setProdScheduleLists,
                            }}
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
          {prodScheduleLists.length > 0 &&
            <div className='flex gap-2 items-center justify-between pt-4 px-4'>
              <span className='font-semibold text-sm'>
                Showing {pageStart + 1} to{" "}
                {prodScheduleLists.length > pageEnd
                  ? pageEnd
                  : prodScheduleLists.length}{" "}
                of {prodScheduleLists.length} entries
              </span>
              <PaginationNew pageCurrent={pageCurrent} setDirection={setDirection} pageTotal={pageTotal} />
            </div>
          }
        </div>

      ) : (
        <span className="text-red-400">Please choose a production</span>
      )}

    </div>
  );
};


export async function getServerSideProps() {
  const fetchProdSchedule = await axiosInstance.get(
    process.env.API_SERVER + "production_schedule"
  );
  const fetchUsers = await axiosInstance.get(
    process.env.API_SERVER + "users"
  );
  const fetchProduction = await axiosInstance.get(
    process.env.API_SERVER + "production"
  );

  return {
    props: {
      scheduleLists: fetchProdSchedule.data,
      userLists: fetchUsers.data,
      productionLists: fetchProduction.data,
    },
  };
}

export default ProductionSchedule;

ProductionSchedule.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
