import ActionBtn from "@/components/dashboard/feature/ActionBtn";
import InsertData from "@/components/dashboard/feature/InsertData";
import axiosInstance from "@/auth_services/instance";
import moment from "moment";
import { useEffect, useState, Fragment } from "react";
import Layout from "@/components/dashboard/layout/Layout";
import { useDispatch } from "react-redux";
import { changeVisible, updateProductionList, menuCurrent } from "@/redux/productionSlice";
import { getCookie } from "cookies-next";
import jwt from "jsonwebtoken";
import Router from 'next/router'
import PaginationNew from "@/components/PaginationNew";

const tabHeading = [
  "Production Name",
  "Status",
  "Genre",
  "Distributor",
  "Incorporation Name",
  "Incorporation Date",
  "Incorporation in Federal/Province",
  "Province",
  "Last Modified",
  "Action",
];

const Feature = ({ productions, distributorLst, genreLst, citysLst, provinceLst, countryLst, }) => {
  const dispatch = useDispatch()
  const search_visible = false;
  dispatch(changeVisible({ search_visible }))
  dispatch(menuCurrent({ active_menu: "features" }))

  const [productionsList, setproductionsList] = useState(productions);
  const [productionList, setproductionList] = useState(productionsList);
  const [distributorList, setdistributorList] = useState(distributorLst);
  const [genreList, setgenreList] = useState(genreLst);
  const [provinceList, setprovinceList] = useState(provinceLst);
  const [cityList, setcityList] = useState(citysLst);
  //const [userlist, setuserlist] = useState(users);


  const [menuCheck, setmenuCheck] = useState("")

  useEffect(() => {
    let getToken = getCookie("token")
    let decodeUser = jwt.decode(getToken)
    const menus = decodeUser.menurole
    let result = menus.find(item => item.menu_fid == 4)

    if (result !== undefined) {
      setmenuCheck(result?.is_editable)
    }
    console.log("result ", result, result.is_editable)

  }, [])

  // convert distributor_fid to distributor real name
  function convertDistributorName(distributor_fid) {
    const distributor = distributorList.find(
      (item) => item.distributor_id === distributor_fid
    );
    return distributor?.distributor_name;
  }

  // convert genre_fid to genre real name
  function convertGenreName(genre_fid) {
    const genre = genreList.find((item) => item.genre_id === genre_fid);
    return genre?.genre;
  }

  // convert province_fid to province real name
  function convertProvince_fidName(province_fid) {
    const province = provinceList.find(
      (item) => item.province_id === province_fid
    );
    return province?.province;
  }

  // convert city_fid to city real name
  function convertCity_fidName(city_fid) {
    const city = cityList.find((item) => item.city_id === city_fid);
    return city?.city;
  }

  const [search, setSearch] = useState("");
  const [pageEntries, setPageEntries] = useState(10);
  const [pageTotal, setPageTotal] = useState(1);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [pageStart, setPageStart] = useState(0);
  const [pageEnd, setPageEnd] = useState(5);
  const [direction, setDirection] = useState("start");

  // update status of production 
  async function updateStatus(production_id, toolstatus) {
    console.log(production_id, toolstatus)
    const res = await axiosInstance.put(process.env.API_SERVER + "production/status/" + production_id, { status: toolstatus });

  }

  const tableReload = async () => {
    //Router.reload('/feature')
    const res = await axiosInstance.get(process.env.API_SERVER + "production");
    dispatch(updateProductionList({ data: res.data }))
    const prductionData = res.data.filter((item) => item.type === 1)
    if (res.status === 201) {
      setproductionsList(prductionData);
      setproductionList(prductionData);

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
      setproductionList(productionsList);
    } else {
      const newList = productionsList.filter((production) =>
        production.production.toLowerCase().includes(search.toLowerCase())
      );
      setproductionList(newList);
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
    const pageTotalVal = Math.ceil(productionList.length / pageEntries);
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

  return (
    <div className="p-5">
      <div className="mx-auto">
        <div className="flex gap-2 text-lg mb-6">
          <div className="flex gap-2 text-lg">
            <span>Features</span>
            {/* <span>{">"}</span>
            <span>production</span>  */}
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
                  state={{ distributorLst, genreLst, provinceLst, countryLst }}
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
                {productionList.slice(pageStart, pageEnd).map((data, index) => {
                  return (

                    <tr className="bg-white hover:shadow-lg cursor-default" key={data.production_id}>
                      <td className="px-4 py-3 text-left ">
                        {data.production}
                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#000"><path d="M12.04 3.5c.59 0 7.54.02 9.34.5a3.02 3.02 0 0 1 2.12 2.15C24 8.05 24 12 24 12v.04c0 .43-.03 4.03-.5 5.8A3.02 3.02 0 0 1 21.38 20c-1.76.48-8.45.5-9.3.51h-.17c-.85 0-7.54-.03-9.29-.5A3.02 3.02 0 0 1 .5 17.84c-.42-1.61-.49-4.7-.5-5.6v-.5c.01-.9.08-3.99.5-5.6a3.02 3.02 0 0 1 2.12-2.14c1.8-.49 8.75-.51 9.34-.51zM9.54 8.4v7.18L15.82 12 9.54 8.41z"/></svg> */}
                      </td>

                      <td className="px-4 py-3 text-left ">
                        <label className="relative inline-flex items-center mr-5 cursor-pointer">
                          <input
                            type="checkbox"
                            onChange={e => (updateStatus(data.production_id, e.target.checked))}
                            defaultChecked={data.status ? true : false}
                            value=""
                            className="sr-only peer"
                            disabled={!menuCheck}
                          />
                          <div className="w-9 h-5  bg-gray-400 rounded-full peer dark:bg-gray-700  dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                        </label>


                      </td>

                      <td className="px-4 py-3 text-left ">
                        {convertGenreName(data.genre_fid)}
                      </td>

                      <td className="px-4 py-3 text-left ">
                        {convertDistributorName(data.distributor_fid)}
                      </td>

                      <td className="px-4 py-3 text-left ">
                        {data.incorporation_name}
                      </td>

                      <td className="px-4 py-3 text-left ">
                        {moment(data.incorporation_date).format(
                          "MMM Do, YYYY"
                        )}
                      </td>

                      <td className="px-4 py-3 text-left ">
                        {data.Incorporation_in}
                      </td>

                      <td className="px-4 py-3 text-left ">
                        {convertProvince_fidName(data.province_fid)}
                      </td>

                      <td className="px-6 py-3 text-left w-[140px]">
                        {moment(data.created_at).format("MMM Do, YYYY")}
                      </td>
                      <td className="px-4 py-3 text-left">
                        {menuCheck ? (

                          <ActionBtn
                            productionId={data.production_id}
                            data={data}
                            tableReload={tableReload}
                            state={{
                              distributorLst,
                              genreLst,
                              provinceLst,
                              countryLst,
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
          {productionList.length > 0 &&
            <div className="flex gap-2 items-center justify-between pt-4 px-4">
              <span className="font-semibold text-sm">
                Showing {pageStart + 1} to{" "}
                {productionList.length > pageEnd
                  ? pageEnd
                  : productionList.length}{" "}
                of {productionList.length} entries
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
  const { data, error } = await axiosInstance.get(process.env.API_SERVER + "production");
  const distributors = await axiosInstance.get(process.env.API_SERVER + "distributor");
  const genres = await axiosInstance.get(process.env.API_SERVER + "genre");
  const citys = await axiosInstance.get(process.env.API_SERVER + "city");
  const provinceLst = await axiosInstance.get(process.env.API_SERVER + "province");
  const countryLst = await axiosInstance.get(process.env.API_SERVER + "country");
  const prductionData = data.filter((item) => item.type === 1)

  return {
    props: {
      productions: prductionData,
      distributorLst: distributors.data,
      genreLst: genres.data,
      citysLst: citys.data,
      // users: users.data,
      provinceLst: provinceLst.data,
      countryLst: countryLst.data,
    },
  };
}

export default Feature;

Feature.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
