import ActionBtn from "@/components/dashboard/vendor/ActionBtn";
import InsertData from "@/components/dashboard/vendor/InsertData";
import axiosInstance from "@/auth_services/instance";
import moment from "moment";
import { useEffect, useState } from "react";
import Layout from "@/components/dashboard/layout/Layout";
import { useDispatch } from "react-redux";
import { changeVisible, menuCurrent } from "@/redux/productionSlice";
import { getCookie } from "cookies-next";
import jwt from "jsonwebtoken";
import _ from 'lodash';
import PaginationNew from "@/components/PaginationNew";

const tabHeading = [
  "Vendor Name",
  "Vendor Type",
  "Residency",
  // "Last Modified By",
  "Last Modified",
  "Action",
];

const Vendor = ({ vendors, users, vendor_typesLst, citysLst, provinceLst, countryLst }) => {
  const dispatch = useDispatch()
  const search_visible = false;
  dispatch(changeVisible({ search_visible }))
  dispatch(menuCurrent({ active_menu: "vendor-list" }))
  
  const [vendorsList, setvendorsList] = useState(vendors);
  const [vendorList, setvendorList] = useState(vendorsList);
  const [vendortypelist, setvendortypelist] = useState(vendor_typesLst);
  const [citylist, setcitylist] = useState(citysLst);
  const [userlist, setuserlist] = useState(users);
  const [sortType, setSortType] = useState('asc');

  const [menuCheck, setmenuCheck] = useState("")

  useEffect(() => {
    let getToken = getCookie("token")
    let decodeUser = jwt.decode(getToken)
    const menus = decodeUser.menurole
    let result = menus.find(item => item.menu_fid == 23)

    if (result !== undefined) {
      setmenuCheck(result?.is_editable)
    }
    console.log("result ", result, result.is_editable)

  }, [])

  // convert vendor_type_fid to vendor_type real name
  function convetVendorTypeName(vendor_type_fid) {
    const vendorType = vendortypelist.find(
      (item) => item.vendor_type_id === vendor_type_fid
    );
    return vendorType?.vendor_type;
  }

  // convert city_fid to city real name
  function convetCity_fidName(city_fid) {
    const city = citylist.find((item) => item.city_id === city_fid);
    return city?.city;
  }

  // convert vendor_type_fid to vendor_type real name
  function convetuser_fidName(user_fid) {
    const user = userlist.find((item) => item.user_id === user_fid);
    return user?.name;
  }

  const [search, setSearch] = useState("");
  const [pageEntries, setPageEntries] = useState(10);
  const [pageTotal, setPageTotal] = useState(1);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [pageStart, setPageStart] = useState(0);
  const [pageEnd, setPageEnd] = useState(5);
  const [direction, setDirection] = useState("start");


  const tableReload = async () => {
    const res = await axiosInstance.get(process.env.API_SERVER + "vendor");
    if (res.status === 201) {
      setvendorsList(res.data);
      setvendorList(res.data);

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
      setvendorList(vendorsList);
    } else {
      const newList = vendorsList.filter((vendor) =>
        vendor.name.toLowerCase().includes(search.toLowerCase())
      );
      setvendorList(newList);
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
    const pageTotalVal = Math.ceil(vendorList.length / pageEntries);
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
    const sorted = _.orderBy(vendorsList, ['name'], [sortType]);
    setvendorList(sorted);
  }, [vendorsList, sortType]);

  const handleSort = () => {
    const newSortType = sortType === 'asc' ? 'desc' : 'asc';
    setSortType(newSortType);
    console.log(sortType)
  };

  return (
    <div className="p-5">
      <div className="mx-auto">
        <div className="flex gap-2 text-lg mb-6">
          <div className="flex gap-2 text-lg">
            <span>Admin</span>
            <span>{">"}</span>
            <span>Vendor</span>
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
                  <option value="10">
                    10
                  </option>
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
                <InsertData tableReload={tableReload} />
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
                      Vendor Name
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
                    Vendor Type
                  </th>
                  <th className="pl-4 py-2 text-left " >
                    Residency
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
                {vendorList.slice(pageStart, pageEnd).map((data, index) => {
                  {
                    /* {vendorList.map((data, index) => {  */
                  }
                  return (
                    <tr className="bg-white" key={data.vendor_id}>
                      <td className="px-4 py-3 text-left ">{data.name}</td>

                      <td className="px-4 py-3 text-left ">
                        {convetVendorTypeName(data.vendor_type_fid)}
                      </td>

                      <td className="px-4 py-3 text-left ">
                        {convetCity_fidName(data.city_fid)}
                      </td>

                      {/* <td className="px-4 py-3 text-left ">
                        {convetuser_fidName(data.updated_by)}
                      </td> */}

                      <td className="px-6 py-3 text-left">
                        {moment(data.created_at).format("MMM Do, YYYY")}
                      </td>
                      <td className="px-4 py-3 text-left">
                        {menuCheck ? (
                          <ActionBtn
                            vendorId={data.vendor_id}
                            data={data}
                            tableReload={tableReload}
                            state={{ vendor_typesLst, citysLst, provinceLst, countryLst }}
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
          {vendorList.length > 0 &&
            <div className="flex gap-2 items-center justify-between pt-4 px-4">
              <span className="font-semibold text-sm">
                Showing {pageStart + 1} to{" "}
                {vendorList.length > pageEnd ? pageEnd : vendorList.length} of{" "}
                {vendorList.length} entries
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

  const { data, error } = await axiosInstance.get(process.env.API_SERVER + "vendor");
  const vendor_type = await axiosInstance.get(process.env.API_SERVER + "vendor_type");
  const users = await axiosInstance.get(process.env.API_SERVER + "users");
  const citys = await axiosInstance.get(process.env.API_SERVER + "city");
  const provinceLst = await axiosInstance.get(process.env.API_SERVER + "province");
  const countryLst = await axiosInstance.get(process.env.API_SERVER + "country");

  return {
    props: {
      vendors: data,
      vendor_typesLst: vendor_type.data,
      citysLst: citys.data,
      users: users.data,
      provinceLst: provinceLst.data,
      countryLst: countryLst.data,
    },
  };

}

export default Vendor;

Vendor.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
