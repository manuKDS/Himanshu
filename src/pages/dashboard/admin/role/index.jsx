import InsertData from "@/components/dashboard/Admin/Role/InsertData";
import axiosInstance from "@/auth_services/instance";

import { useEffect, useState } from "react";
import Layout from "@/components/dashboard/layout/Layout";
import Rows from "@/components/dashboard/Admin/Role/Rows";
import { useDispatch } from "react-redux";
import { changeVisible, menuCurrent } from "@/redux/productionSlice";
import axios from "axios";
import { getCookie } from "cookies-next";
import jwt from "jsonwebtoken";
import _ from 'lodash';
import PaginationNew from "@/components/PaginationNew";

const tabHeading = [
  "Role Name",
  "Status",
  // "Modified By",
  "Last Modified",
  "Action",
];

const Role = ({
  roles,
  userLst,
  role_userLst,
}) => {
  const dispatch = useDispatch()
  const search_visible = false;
  dispatch(changeVisible({ search_visible }))
  dispatch(menuCurrent({ active_menu: "role" }))

  const [rolesList, setrolesList] = useState(roles);
  const [roleList, setroleList] = useState(rolesList);
  const [menuList, setMenuList] = useState();
  const [userList, setuserList] = useState(userLst);
  const [menuCheck, setmenuCheck] = useState("")

  const [search, setSearch] = useState("");
  const [pageEntries, setPageEntries] = useState(10);
  const [pageTotal, setPageTotal] = useState(1);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [pageStart, setPageStart] = useState(0);
  const [pageEnd, setPageEnd] = useState(5);
  const [direction, setDirection] = useState("start");

  const [sortType, setSortType] = useState('asc');

  useEffect(() => {
    let getToken = getCookie("token")
    let decodeUser = jwt.decode(getToken)
    const menus = decodeUser.menurole
    let result = menus.find(item => item.menu_fid == 21)

    if (result !== undefined) {
      setmenuCheck(result?.is_editable)
    }
    console.log("result ", result, result.is_editable)

  }, [])


  useEffect(() => {
    axiosInstance.get(process.env.API_SERVER + "menu").then((res) => {
      if (res.status === 201) {
        setMenuList(res.data);
      }
    })
  }, [])

  // convert user_fid to user real name
  function convetuserName(user_fid) {
    const user = userList.find(
      (item) => item.user_id === user_fid
    );
    return user?.user_name;
  }

  // convert genre_fid to genre real name
  function convetGenreName(genre_fid) {
    const genre = genreList.find((item) => item.genre_id === genre_fid);
    return genre?.genre;
  }

  // update status of role 
  async function updateStatus(role_id, toolstatus) {

    const res = await axiosInstance.put(process.env.API_SERVER + "role/status/" + role_id, { status: toolstatus });

  }

  const tableReload = async () => {
    const res = await axiosInstance.get(process.env.API_SERVER + "role");
    if (res.status === 201) {
      setrolesList(res.data);
      setroleList(res.data);

      if (search !== "") {
        setPageCurrent(1);
        setDirection("start");
      }
      pageHandler();
    }
  };

  // Search input handler
  useEffect(() => {
    searchHandler();
    setPageCurrent(1);
    setDirection("start");
    pageHandler();
  }, [search]);

  const searchHandler = () => {
    if (search == "") {
      setroleList(rolesList);
    } else {
      const newList = rolesList.filter((role1) =>
        role1.role_name.toLowerCase().includes(search.toLowerCase())
      );
      setroleList(newList);
    }
  };

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

  const pageHandler = () => {
    const pageTotalVal = Math.ceil(roleList.length / pageEntries);
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
  };

  useEffect(() => {
    var pgStart = pageEntries * (pageCurrent - 1);
    var pgEnd = pgStart + parseInt(pageEntries);
    setPageStart(pgStart);
    setPageEnd(pgEnd);
  }, [direction, pageCurrent, pageEntries]);

  useEffect(() => {
    const sorted = _.orderBy(rolesList, ['role_name'], [sortType]);
    setroleList(sorted);
  }, [rolesList, sortType]);

  const handleSort = () => {
    const newSortType = sortType === 'asc' ? 'desc' : 'asc';
    setSortType(newSortType);
  };

  return (
    <div className="p-5">
      <div className="mx-auto">
        <div className="flex gap-2 text-lg mb-6">
          <div className="flex gap-2 text-lg">
            <span>Admin</span>
            <span>{">"}</span>
            <span>Role</span>
          </div>
        </div>
        <div className="px-3 py-5 rounded-lg border shadow">
          <div className="flex justify-between items-center gap-2 px-4">
            <div className="flex items-center gap-2 text-sm">
              <span>Show</span>
              <div className="inline-flex items-center relative cursor-pointer min-w-[50px] text-sm">
                <select
                  defaultValue={10}
                  name=""
                  onChange={(e) => {
                    setPageEntries(e.target.value);
                  }}
                  id=""
                  className="appearance-none w-full border outline-none rounded-[4px] px-1 cursor-pointer"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
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
              <span>entries </span>
              {/* <span>entries - {pageEntries} total {pageTotal} - current {pageCurrent} | start {pageStart} = end {pageEnd} </span> */}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search"
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-5 pr-[45px] h-[40px] w-[400px] bg-gray-100 rounded-md outline-none"
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
                  tableReload={tableReload}
                  menuList={menuList}
                  state={{ roles, userLst, role_userLst }}
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
          <div className="relative overflow-x-auto mt-10 rounded-lg bg-gray-200 p-3">
            <table className="w-full border-separate border-spacing-y-2">
              <thead className="text-sm text-slate-700">
                <tr>
                <th className="pl-4 py-2 text-left " >
                    <span className="flex gap-4 cursor-pointer">
                      Role Name
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
                 
                  <th className="pl-4 py-2 text-left " >
                    Status
                  </th>
                  <th className="pl-4 py-2 text-left " >
                    Last Modified
                  </th>
                  <th className="pl-4 py-2 text-left " >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {roleList.slice(pageStart, pageEnd).map((data, index) => {

                  return (
                    <Rows data={data} menuCheck={menuCheck} menuList={menuList} key={data.role_id} updateStatus={updateStatus} roleId={data.role_id} tableReload={tableReload} state={{
                      roles, userLst, role_userLst
                    }} />

                  );

                })}
              </tbody>
            </table>
          </div>
          {roleList.length > 0 &&
            <div className="flex gap-2 items-center justify-between pt-4 px-4">
              <span className="font-semibold text-sm">
                Showing {pageStart + 1} to{" "}
                {roleList.length > pageEnd
                  ? pageEnd
                  : roleList.length}{" "}
                of {roleList.length} entries
              </span>
              <PaginationNew pageCurrent={pageCurrent} setDirection={setDirection} pageTotal={pageTotal} />
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  const { data, error } = await axiosInstance.get(process.env.API_SERVER + "role");
  const users = await axiosInstance.get(process.env.API_SERVER + "users");
  const role_users = await axiosInstance.get(process.env.API_SERVER + "role_user");

  return {
    props: {
      roles: data,
      userLst: users.data,
      role_userLst: role_users.data,
    },
  };
}
export default Role;

Role.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
