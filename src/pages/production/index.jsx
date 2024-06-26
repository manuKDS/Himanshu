import ActionBtn from "@/components/dashboard/production/ActionBtn";
import InsertData from "@/components/dashboard/production/InsertData";
import Pagination from "@/components/dashboard/production/Pagination";
import axiosInstance from "@/auth_services/instance";
import moment from "moment";
import { useEffect, useState, Fragment } from "react";
import Layout from "@/components/dashboard/layout/Layout";
import Seasons from "@/components/dashboard/series/Seasons";
import Rows from "@/components/dashboard/series/Rows";
import { useDispatch } from "react-redux";
import { changeVisible, menuCurrent } from "@/redux/productionSlice";
import { getCookie } from "cookies-next";
import jwt from "jsonwebtoken";

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

const Production = ({ productions, distributorLst, genreLst, citysLst, provinceLst, countryLst, }) => {
  const dispatch = useDispatch()
  const search_visible = false;
  dispatch(changeVisible({ search_visible }))
  dispatch(menuCurrent({ active_menu: "productions" }))

  const [productionsList, setproductionsList] = useState(productions);
  const [productionList, setproductionList] = useState(productionsList);
  const [ListPage, setListPage] = useState(productionList.filter(item => item.parent_id === null))

  // const [distributorList, setdistributorList] = useState(distributorLst);
  // const [genreList, setgenreList] = useState(genreLst);
  // const [provinceList, setprovinceList] = useState(provinceLst);
  // const [cityList, setcityList] = useState(citysLst);

  const [menuCheck, setmenuCheck] = useState("")

  useEffect(() => {
    let getToken = getCookie("token")
    let decodeUser = jwt.decode(getToken)
    const menus = decodeUser.menurole
    let result = menus.find(item => item.menu_fid == 3)

    if (result !== undefined) {
      setmenuCheck(result?.is_editable)
    }

  }, [])


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
    const res = await axiosInstance.get(process.env.API_SERVER + "production");
    if (res.status === 201) {
      setproductionsList(res.data);
      setproductionList(res.data);
      setListPage(res.data.filter(item => item.parent_id === null))

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

    const pageTotalVal = Math.ceil(ListPage.length / pageEntries);
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
            <span>All Productions</span>
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
              {/* <InsertData
                tableReload={tableReload}
                state={{ distributorLst, genreLst, provinceLst, countryLst }}
              /> */}
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
                {ListPage.slice(pageStart, pageEnd).map((data, index) => {
                  if (data.parent_id === null) {
                    return (
                      <Rows data={data} menuCheck={menuCheck} key={data.production_id} updateStatus={updateStatus} productionId={data.production_id} tableReload={tableReload} state={{
                        distributorLst,
                        genreLst,
                        provinceLst,
                        countryLst,
                        productions,
                      }} />
                    );
                  }
                })}
              </tbody>
            </table>
          </div>
          {ListPage.length > 0 &&
            <div className="flex gap-2 items-center justify-between pt-4 px-4">
              <span className="font-semibold text-sm">
                Showing {pageStart + 1} to{" "}
                {ListPage.length > pageEnd
                  ? pageEnd
                  : ListPage.length}{" "}
                of {ListPage.length} entries
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
  const { data, error } = await axiosInstance.get(process.env.API_SERVER + "production");
  const distributors = await axiosInstance.get(process.env.API_SERVER + "distributor");
  const genres = await axiosInstance.get(process.env.API_SERVER + "genre");
  const citys = await axiosInstance.get(process.env.API_SERVER + "city");
  const provinceLst = await axiosInstance.get(process.env.API_SERVER + "province");
  const countryLst = await axiosInstance.get(process.env.API_SERVER + "country");

  return {
    props: {
      productions: data,
      distributorLst: distributors.data,
      genreLst: genres.data,
      citysLst: citys.data,
      // users: users.data,
      provinceLst: provinceLst.data,
      countryLst: countryLst.data,
    },
  };
}

export default Production;

Production.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
