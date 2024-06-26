import ActionBtn from "@/components/dashboard/Menu/LocationInformation/ActionBtn";
import InsertData from "@/components/dashboard/Menu/LocationInformation/InsertData";
import Pagination from "@/components/dashboard/Menu/LocationInformation/Pagination";
import Layout from "@/components/dashboard/layout/Layout";
import axiosInstance from "@/auth_services/instance";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeVisible, menuCurrent } from "@/redux/productionSlice";
import { getCookie } from "cookies-next";
import jwt from "jsonwebtoken";
import PaginationNew from "@/components/PaginationNew";

const LocationInformation = ({
  ProdLocationList,
  userLists,
  country_list,
  province_list,
  city_lists,
}) => {

  const dispatch = useDispatch()
  const search_visible = true;
  dispatch(changeVisible({ search_visible }))
  dispatch(menuCurrent({ active_menu: "location-information" }))

  const redux_production_id = useSelector((state) => state.production.production_id)
  const LocationLst = ProdLocationList.filter((item) => item.production_fid == redux_production_id)

  const [prodLocationList, setProdLocationList] = useState(LocationLst);
  const [userList, setUserList] = useState(userLists);
  const [countryList, setCounryList] = useState(country_list);
  const [cityList, setCityList] = useState(city_lists);
  const [provinceList, setProvinceList] = useState(province_list);
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
    let result = menus.find(item => item.menu_fid == 9)

    if (result !== undefined) {
      setmenuCheck(result?.is_editable)
    }
    //console.log("result ", result, result.is_editable)

  }, [])

  useEffect(() => {
    const getList = () => {
      const LocationLst1 = ProdLocationList.filter((item) => item.production_fid == redux_production_id)
      setProdLocationList(LocationLst1)
    }
    getList()
  }, [redux_production_id])

  const tableReload = async () => {

    const res = await axiosInstance.get(process.env.API_SERVER + "production_location");
    if (res.status === 201) {

      const LocationLst1 = res.data.filter((item) => item.production_fid == redux_production_id)
      setProdLocationList(LocationLst1)

      if (query !== "") {
        setPageCurrent(1);
        setDirection("start");
      }
      pageHandler();
    }
  };

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
  // find province_fid from city_id
  function findProvinceId(id) {
    const city = cityList.find((item) => item.city_id === id);

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

  // convert last_modified_id to user_id
  function convertLastModifiedBy(id) {
    const user = userList.find((item) => item.user_id === id);

    return user?.user_name;
  }

  const filteredResults =
    query === ""
      ? prodLocationList
      : prodLocationList.filter((prod) => {
        return prod.description.toLowerCase().includes(query.toLowerCase());
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
  
    const pageTotalVal = Math.ceil(prodLocationList.length / pageEntries);
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
          <span>Location</span>
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
                  fn={{
                    convertCityId,
                    convertCountryId,
                    convertProvinceId,
                    tableReload,
                  }}
                  state={{
                    prodLocationList,
                    setProdLocationList,
                    countryList,
                    provinceList,
                    cityList,
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
                  <th className='px-4 py-2 text-left'>Location</th>
                  <th className='px-4 py-2 text-left'>
                    No of <br />
                    Shooting Days
                  </th>
                  <th className='px-4 py-2 text-left'>Description</th>

                  {/* <th className='px-4 py-2 text-left'>Last Modified By</th> */}
                  <th className='px-4 py-2 text-left'>Last Modified</th>
                  <th className='py-2 text-left pl-[25px]'>Action</th>
                </tr>
              </thead>
              <tbody className='text-xs'>
                {filteredResults.slice(pageStart, pageEnd).map((data, index) => {
                  return (
                    <tr className='bg-white' key={index}>
                      <td className='px-4 py-3 text-left'>
                        {data.cityData.city}, {data.cityData.provinceData.province}
                      </td>
                      <td className='px-4 py-3 text-left'>
                        {data.shooting_days}
                      </td>
                      <td className='px-4 py-3 text-left'>{data.description}</td>

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
                              convertCityId,
                              convertCountryId,
                              convertProvinceId,
                              tableReload,
                            }}
                            state={{
                              prodLocationList,
                              setProdLocationList,
                              countryList,
                              provinceList,
                              cityList,
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
          {prodLocationList.length > 0 &&
            <div className='flex gap-2 items-center justify-between pt-4 px-4'>
              <span className='font-semibold text-sm'>
                Showing {pageStart + 1} to{" "}
                {prodLocationList.length > pageEnd
                  ? pageEnd
                  : prodLocationList.length}{" "}
                of {prodLocationList.length} entries
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
  const fetchProdLoction = await axiosInstance.get(
    process.env.API_SERVER + "production_location"
  );

  const fetchUsers = await axiosInstance.get(process.env.API_SERVER + "users");

  // 6. Fetching all data from tbl_city
  const fetchCityList = await axiosInstance.get(process.env.API_SERVER + "city");

  // 7. Fetching all data from tbl_country
  const fetchCountryList = await axiosInstance.get(process.env.API_SERVER + "country");

  // 7. Fetching all data from tbl_province
  const fetchProvinceList = await axiosInstance.get(
    process.env.API_SERVER + "province"
  );
  return {
    props: {
      ProdLocationList: fetchProdLoction.data,
      userLists: fetchUsers.data,
      country_list: fetchCountryList.data,
      city_lists: fetchCityList.data,
      province_list: fetchProvinceList.data,
    },
  };
}

export default LocationInformation;

LocationInformation.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
