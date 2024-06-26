import ActionBtn from "@/components/dashboard/Admin/User/ActionBtn";
import InsertData from "@/components/dashboard/Admin/User/InsertData";
import Layout from "@/components/dashboard/layout/Layout";
import axiosInstance from "@/auth_services/instance";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { changeVisible, menuCurrent } from "@/redux/productionSlice";
import { getCookie } from "cookies-next";
import jwt from "jsonwebtoken";
import _ from 'lodash';
import PaginationNew from "@/components/PaginationNew";

export async function getServerSideProps() {
  const fetchUsers = await axiosInstance.get(process.env.API_SERVER + "users");

  return {
    props: {
      userLists: fetchUsers.data,
    },
  };
}

const Users = ({ userLists }) => {
  const dispatch = useDispatch()
  const search_visible = false;
  dispatch(changeVisible({ search_visible }))
  dispatch(menuCurrent({ active_menu: "user" }))

  const [userList, setUserList] = useState(userLists);
  const [pageEntries, setPageEntries] = useState(10);
  const [pageTotal, setPageTotal] = useState(1);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [pageStart, setPageStart] = useState(0);
  const [pageEnd, setPageEnd] = useState(5);
  const [direction, setDirection] = useState("start");
  const [query, setQuery] = useState("");
  const [sortType, setSortType] = useState('asc');

  const [menuCheck, setmenuCheck] = useState("")

  useEffect(() => {
    let getToken = getCookie("token")
    let decodeUser = jwt.decode(getToken)
    const menus = decodeUser.menurole
    let result = menus.find(item => item.menu_fid == 14)

    if (result !== undefined) {
      setmenuCheck(result?.is_editable)
    }
    console.log("result ", result, result.is_editable)

  }, [])

  const tableReload = async () => {
    const res = await axiosInstance.get(process.env.API_SERVER + "users");

    if (res.status === 201) {
      setUserList(res.data);

      if (query !== "") {
        setPageCurrent(1);
        setDirection("start");
      }
      pageHandler();
    }
  };

  const filteredResults =
    query === ""
      ? userList
      : userList.filter((user) => {
        return user.user_name.toLowerCase().includes(query.toLowerCase());
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
   
    const pageTotalVal = Math.ceil(userList.length / pageEntries);
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

  // convert last_modified_id to user_id
  function convertLastModifiedBy(id) {
    const user = userList.find((item) => item.user_id === id);

    return user?.user_name;
  }

  // update status of user
  async function updateStatus(user_id, toolstatus) {
    console.log(user_id, toolstatus)
    const res = await axiosInstance.put(process.env.API_SERVER + "users/status/" + user_id, { is_active: toolstatus });

    // if (res.status === 201) {

    // }
  }

  //----------------- sorting -----------------
  useEffect(() => {
    const sorted = _.orderBy(userLists, ['user_name'], [sortType]);
    setUserList(sorted);
  }, [userLists, sortType]);

  const handleSort = () => {
    const newSortType = sortType === 'asc' ? 'desc' : 'asc';
    setSortType(newSortType);
  };


  return (
    <div className='p-5'>
      <div className='mx-auto'>
        <div className='flex gap-2 text-lg mb-6'>
          <span>Admin</span>
          <span>{">"}</span>
          <span>User</span>
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
                  userList,
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
                 <th className="pl-4 py-2 text-left " >
                    <span className="flex gap-4 cursor-pointer">
                      Username
                      {sortType == 'asc' ? (
                        <button onClick={() => handleSort()}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler text-blue-600 icon-tabler-sort-ascending" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M4 6l7 0"></path>
                            <path d="M4 12l7 0"></path>
                            <path d="M4 18l9 0"></path>
                            <path d="M15 9l3 -3l3 3"></path>
                            <path d="M18 6l0 12"></path>
                          </svg>
                        </button>
                      ) : (
                        <button onClick={() => handleSort()}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler text-blue-600 icon-tabler-sort-descending" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M4 6l9 0"></path>
                            <path d="M4 12l7 0"></path>
                            <path d="M4 18l7 0"></path>
                            <path d="M15 15l3 3l3 -3"></path>
                            <path d="M18 6l0 12"></path>
                          </svg>
                        </button>
                      )}
                    </span>
                  </th>
                <th className='px-4 py-2 text-left'>Name</th>
                <th className='px-4 py-2 text-left'>Email</th>
                {/* <th className='px-4 py-2 text-left'>Password</th> */}
                {/* <th className='px-4 py-2 text-left'>Meta Data</th> */}
                <th className='px-4 py-2 text-left'>Is Active</th>
                {/* <th className='px-4 py-2 text-left'>Updated By</th> */}
                {/* <th className='px-4 py-2 text-left'>Is Deleted</th> */}
                <th className='px-4 py-2 text-left'>Created Date</th>

                <th className='py-2 text-left pl-[25px]'>Action</th>
              </tr>
            </thead>
            <tbody className='text-xs'>
              {filteredResults.slice(pageStart, pageEnd).map((data, index) => {
                return (
                  <tr className='bg-white' key={data.user_id}>
                    <td className='px-4 py-3 text-left'>{data.user_name}</td>
                    <td className='px-4 py-3 text-left'>{data.name}</td>
                    <td className='px-4 py-3 text-left'>{data.email}</td>
                    {/* <td className='px-4 py-3 text-left'>{data.password}</td> */}
                    {/* <td className='px-4 py-3 text-left'>{data.metadata}</td> */}
                    <td className='px-4 py-3 text-left'>
                      <label className="relative inline-flex items-center mr-5 cursor-pointer">
                        <input
                          type="checkbox"
                          onChange={e => (updateStatus(data.user_id, e.target.checked))}
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
                      {convertLastModifiedBy(data.updated_by)}
                    </td> */}
                    {/* <td className='px-4 py-3 text-left'>
                      {data.is_deleted ? "Active" : "Inactive"}
                    </td> */}
                    <td className='px-4 py-3 text-left'>
                      {moment(data.created_at).format("MMM Do, YYYY")}
                    </td>

                    <td className='px-4 py-3 text-left'>
                      {menuCheck ? (
                        <ActionBtn
                          data={data}
                          fn={{
                            tableReload,
                          }}
                          state={{
                            userList,
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
        {userList.length > 0 &&
          <div className='flex gap-2 items-center justify-between pt-4 px-4'>
            <span className='font-semibold text-sm'>
              Showing {pageStart + 1} to{" "}
              {userList.length > pageEnd ? pageEnd : userList.length} of{" "}
              {userList.length} entries
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
