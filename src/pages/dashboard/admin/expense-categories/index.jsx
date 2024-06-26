import ActionBtn from "@/components/dashboard/Admin/ExpenceCetegories/ActionBtn";
import InsertData from "@/components/dashboard/Admin/ExpenceCetegories/InsertData";
import Layout from "@/components/dashboard/layout/Layout";
import axiosInstance from "@/auth_services/instance";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { changeVisible, menuCurrent } from "@/redux/productionSlice";
import { getCookie } from "cookies-next";
import jwt from "jsonwebtoken";
import PaginationNew from "@/components/PaginationNew";

// export async function getServerSideProps() {
//   const fetchUsers = await axiosInstance.get(process.env.API_SERVER + "expense-categories");

//   return {
//     props: {
//       userLists: fetchUsers.data,
//     },
//   };
// }

const Users = () => {
  // console.log("userLists:::", userLists)
  const dispatch = useDispatch()
  const parentCategories = [
    { value: "A", description: "Above the Line" },
    { value: "B", description: "Production" },
    { value: "C", description: "Post-Production" },
    { value: "D", description: "Other" },
  ]
  const search_visible = false;
  dispatch(changeVisible({ search_visible }))
  dispatch(menuCurrent({ active_menu: "expense-categories" }))

  const [categoryList, setCategoryList] = useState([]);
  const [pageEntries, setPageEntries] = useState(10);
  const [pageTotal, setPageTotal] = useState(1);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [pageStart, setPageStart] = useState(0);
  const [pageEnd, setPageEnd] = useState(5);
  const [direction, setDirection] = useState("start");
  const [query, setQuery] = useState("");
  const [parentCategoryFilter, setParentCategoryFilter] = useState("");
  const [menuCheck, setmenuCheck] = useState("")

  useEffect(() => {
    let getToken = getCookie("token")
    let decodeUser = jwt.decode(getToken)
    const menus = decodeUser.menurole
    let result = menus.find(item => item.menu_fid == 29)

    if (result !== undefined) {
      setmenuCheck(result?.is_editable)
    }
    console.log("result ", result, result.is_editable)
    tableReload()
  }, [])

  const tableReload = async () => {
    const res = await axiosInstance.get(process.env.API_SERVER + "expense_categories");

    if (res.status === 201) {
      setCategoryList(res.data);
      console.log("res.data:::", res.data);

      if (query !== "") {
        setPageCurrent(1);
        setDirection("start");
      }
      pageHandler();
    }
  };

  const filteredResults =
    query === "" && parentCategoryFilter == ""
      ? categoryList
      : query !== "" && parentCategoryFilter == "" ? categoryList.filter((category) => category.category_name.toLowerCase().includes(query.toLowerCase()))
        : query == "" && parentCategoryFilter != "" ? categoryList.filter((category) => category.category_parent === parentCategoryFilter)
          : query !== "" && parentCategoryFilter != "" ? categoryList.filter((category) => category.category_name.toLowerCase().includes(query.toLowerCase()) && category.category_parent === parentCategoryFilter) : categoryList

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
 
    const pageTotalVal = Math.ceil(filteredResults.length / pageEntries);
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


  async function updateStatus(category_id, toolstatus) {
    console.log("expense_categories", category_id)
    const res = await axiosInstance.put(process.env.API_SERVER + "expense_categories/status/" + category_id, { is_active: toolstatus });
  }

  return (
    <div className='p-5'>
      <div className='mx-auto'>
        <div className='flex gap-2 text-lg mb-6'>
          <span>Admin</span>
          <span>{">"}</span>
          <span>Expense Categories</span>
        </div>
      </div>
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
                fn={{
                  tableReload,
                }}
                state={{
                  categoryList,
                }}
                parentCategories={parentCategories}
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
                <th className='px-4 py-2 text-left'>Parent Category :
                  <select
                    value={parentCategoryFilter}
                    onChange={(e) => {
                      setParentCategoryFilter(e.target.value);
                    }}
                    className='appearance-none border outline-none rounded-[4px] px-1 ml-3 cursor-pointer'
                  >
                    <option value=''>All</option>
                    {parentCategories.map((e) => <option value={e.value}>{e.value}</option>)}
                  </select></th>
                <th className='px-4 py-2 text-left'>Category Number</th>
                <th className='px-4 py-2 text-left'>Category Name</th>
                {/* <th className='px-4 py-2 text-left'>Last Modified</th> */}
                <th className='px-4 py-2 text-left'>Is Active</th>
                <th className='py-2 text-left pl-[25px]'>Action</th>
              </tr>
            </thead>
            <tbody className='text-xs'>
              {filteredResults.slice(pageStart, pageEnd).map((data, index) => {
                return (
                  <tr className='bg-white' key={data.user_id}>
                    <td className='px-4 py-3 text-left'>
                      {data.category_parent}: {parentCategories.find(e => e.value === data.category_parent).description}
                    </td>
                    <td className='px-4 py-3 text-left'>{data.category_number}</td>
                    <td className='px-4 py-3 text-left'>{data.category_name}</td>
                    <td className='px-4 py-3 text-left'>
                      <label className="relative inline-flex items-center mr-5 cursor-pointer">
                        <input
                          type="checkbox"
                          onChange={e => (updateStatus(data.category_id, e.target.checked))}
                          defaultChecked={data.is_active}
                          value=""
                          className="sr-only peer"
                          disabled={!menuCheck}
                        />
                        <div className="w-9 h-5  bg-gray-400 rounded-full peer dark:bg-gray-700  dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                      </label>
                      {/* {data.is_active ? "Active" : "Inactive"} */}
                    </td>
                    {/* <td className='px-4 py-3 text-left'>
                      {moment(data.updated_at).format("MMM Do, YYYY")}
                    </td> */}

                    <td className='px-4 py-3 text-left'>
                      {menuCheck ? (
                        <ActionBtn
                          data={data}
                          fn={{
                            tableReload,
                          }}
                          state={{
                            categoryList,
                          }}
                          parentCategories={parentCategories}
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
        {filteredResults.length > 0 &&
          <div className='flex gap-2 items-center justify-between pt-4 px-4'>
            <span className='font-semibold text-sm'>
              Showing {pageStart + 1} to{" "}
              {filteredResults.length > pageEnd ? pageEnd : filteredResults.length} of{" "}
              {filteredResults.length} entries
            </span>
             <PaginationNew pageCurrent={pageCurrent} setDirection={setDirection} pageTotal={pageTotal} />
          </div>
        }
      </div>
    </div>
  );
};

export default Users;

Users.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
