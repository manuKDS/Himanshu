import ActionBtn from "@/components/dashboard/country/ActionBtn";
import InsertData from "@/components/dashboard/country/InsertData";
import Pagination from "@/components/dashboard/country/Pagination";
import axiosInstance from "@/auth_services/instance";
import moment from "moment";
import { useEffect, useState } from "react";
import Layout from "@/components/dashboard/layout/Layout";
import { useDispatch } from "react-redux";
import { changeVisible, menuCurrent } from "@/redux/productionSlice";
import { getCookie } from "cookies-next";
import jwt from "jsonwebtoken";

const tabHeading = [
  "Country Name",
  "Country Code",
  "Active",
  "Last Modified",
  "Action",
];

const Country = ({ countries }) => {
  const dispatch = useDispatch()
  const search_visible = false;
  dispatch(changeVisible({ search_visible }))
  const [countriesList, setcountriesList] = useState(countries);
  const [countryList, setCountryList] = useState(countriesList);
  const [search, setSearch] = useState("");
  const [pageEntries, setPageEntries] = useState(10);
  const [pageTotal, setPageTotal] = useState(1);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [pageStart, setPageStart] = useState(0);
  const [pageEnd, setPageEnd] = useState(5);
  const [direction, setDirection] = useState("start");

  const [menuCheck, setmenuCheck] = useState("")

  useEffect(() => {
    let getToken = getCookie("token")
    let decodeUser = jwt.decode(getToken)
    const menus = decodeUser.menurole
    let result = menus.find(item => item.menu_fid == 25)

    if (result !== undefined) {
      setmenuCheck(result?.is_editable)
    }
    console.log("result ", result, result.is_editable)

  }, [])


  const tableReload = async () => {
    const res = await axiosInstance.get(process.env.API_SERVER + "country");

    if (res.status === 201) {
      setcountriesList(res.data);
      setCountryList(res.data);
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
      setCountryList(countriesList);
    } else {
      const newList = countriesList.filter((country) =>
        country.country.toLowerCase().includes(search.toLowerCase())
      );
      setCountryList(newList);
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
    const pageTotalVal = Math.ceil(countryList.length / pageEntries);
    setPageTotal(pageTotalVal);

    switch (direction) {
      case "prev":
        if (pageCurrent > 1) setPageCurrent(pageCurrent - 1);
        else setPageCurrent(1);
        break;
      case "next":
        if (pageCurrent < pageTotalVal) setPageCurrent(pageCurrent + 1);
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

  return (
    <div className="p-5">
      <div className="mx-auto">
        <div className="flex gap-2 text-lg mb-6">
          <div className="flex gap-2 text-lg">
            <span>Admin</span>
            <span>{">"}</span>
            <span>Country</span>
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
                countriesList && <InsertData tableReload={tableReload} countryData={countriesList} />
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
                  {tabHeading.map((heading, index) => {
                    return (
                      <th
                        className={`px-4 py-2 text-left ${index === 4 && "pl-[25px]"
                          } `}
                        key={index}
                      >
                        {heading}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="text-xs">
                {countryList.slice(pageStart, pageEnd).map((data, index) => {
                  {
                    /* {countryList.map((data, index) => {  */
                  }
                  return (
                    <tr className="bg-white" key={data.country_id}>
                      <td className="px-4 py-3 text-left ">{data.country}</td>
                      <td className="px-4 py-3 text-left">
                        {data.country_code}
                      </td>
                      <td className="px-4 py-3 text-left">
                        {data.is_active ? "Yes" : "No"}
                      </td>
                      <td className="px-4 py-3 text-left">
                        {moment(data.created_at).format("MMM Do, YYYY")}
                      </td>
                      <td className="px-4 py-3 text-left">
                        {menuCheck && countriesList ? (
                          <ActionBtn
                            countryList={countriesList}
                            countryId={data.country_id}
                            data={data}
                            tableReload={tableReload}
                            state={{}}
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
          {countryList.length > 0 &&
            <div className="flex gap-2 items-center justify-between pt-4 px-4">
              <span className="font-semibold text-sm">
                Showing {pageStart + 1} to{" "}
                {countryList.length > pageEnd ? pageEnd : countryList.length} of{" "}
                {countryList.length} entries
              </span>
              <Pagination pageCurrent={pageCurrent} setDirection={setDirection} />
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  const { data, error } = await axiosInstance.get(process.env.API_SERVER + "country");
  // const resData = data.sort(function (a, b) {
  //   return a.country < b.country ? -1 : a.country > b.country ? 1 : 0;
  // });
  return {
    props: {
      countries: data,
    },
  };
}

export default Country;

Country.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
