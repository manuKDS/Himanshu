import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import AddProvinceDropdown from "./AddProvinceDropdown";
import axiosInstance from "@/auth_services/instance";
import AddCityCountryDropdown from "./AddCityCountryDropdown";

export default function AddCities({
  data,
  isOpen,
  setIsOpen,
  fn,
  state,
  selectedRegionId,
  tableReload
}) {
  const citiesData = data;

  const { convertProvinceId, convertOrgTypeName, convertCountryId } = fn;
  const {
    provinceList,
    countryList,
    cityList,
    province,
    setProvince,
  } = state;
  const { regionCities } = state;

  const [loading, setLoading] = useState(false);
  const [provinceId, setProvinceId] = useState("");
  const [countryId, setCountryId] = useState("");
  const [leftCity, setLeftCity] = useState([]);
  const [rightCity, setRightCity] = useState({});
  const [isLeftCheckAll, setIsLeftCheckAll] = useState(false);
  const [isRightCheckAll, setIsRightCheckAll] = useState(false);
  const [isLeftCheck, setIsLeftCheck] = useState([]);
  const [isRightCheck, setIsRightCheck] = useState([]);

  // city in a region
  function countCityInRegion() {
    var citiesRegion = {}
    const provinceUnique = {}
    // find regions
    data.citiesOfregion.map(region => {
      const city1 = cityList.filter(item => item.city_id === region.city_fid)
      const province1 = provinceList.filter(item1 => item1.province_id == city1[0].province_fid)

      provinceUnique[province1[0].province_id] = province1[0].province
    });

    Object.keys(provinceUnique).forEach(function (key, index) {

      const cityTmpList = []
      data.citiesOfregion.map(region => {

        if (region.region_fid == data.region_id) {
          const city1 = cityList.filter(item => item.city_id === region.city_fid)
          const province1 = provinceList.filter(item1 => item1.province_id == city1[0].province_fid)

          if (province1[0].province_id == key) {
            cityTmpList.push(city1[0])
          }

        }
      });

      citiesRegion[provinceUnique[key]] = cityTmpList

    })

    setRightCity(citiesRegion)
    return citiesRegion;
  }

  // Find region on state change
  useEffect(() => {
    isOpen && countCityInRegion()
  }, [isOpen]);


  // Send post request to api in
  const insertData = async () => {
    setLoading(true);

    await axiosInstance.delete(process.env.API_SERVER + "region/city/" + selectedRegionId);

    const objEntries = Object.entries(rightCity);

    const cityArray = []
    objEntries.map(mainObj => {
      return mainObj[1].map((obj, index) => {
        cityArray.push({
          region_fid: selectedRegionId,
          city_fid: obj.city_id,
          is_active: true,
          modified_by: 1,
        })
      })
    })

    const res = await axiosInstance.post(process.env.API_SERVER + "region/city", { cityArray });
    if (res.status == 200) {
      tableReload()
      setIsOpen(false);
      setLeftCity([])
      setRightCity([])
      setIsLeftCheckAll(false)
      setIsRightCheckAll(false)
      setIsLeftCheck([])
      setIsRightCheck([])
    }
    setLoading(false);

  };

  // Find province
  useEffect(() => {
    const fetchProvince = async () => {
      const res = provinceList.filter(
        (province) => province.country_fid === citiesData.country_fid
      );
      setProvince(res);
    };
    fetchProvince();
    setProvinceId("");
  }, [countryId, isOpen]);

  // Find Cities from Province Dropdown
  useEffect(() => {
    if (provinceId !== "") {
      setIsLeftCheckAll(false)
      setIsLeftCheck([])
      // 1. Fetch cities from Province
      const fetchCity = async () => {
        const resCity = cityList.filter(
          (city) => city.province_fid === provinceId
        );

        // 2. Converty all right section of cities values in single array
        var output = [];
        const right = Object.values(rightCity).map((city) => {
          for (var i = 0; i < city.length; i++) output.push(city[i]);
        });

        // 2. Check no duplicate values in the right cities section
        const noLeftDuplicates = resCity.filter((item1) => {
          return (
            output.findIndex((item2) => {
              return item1.city_id === item2.city_id;
            }) === -1
          );
        });

        // 2. Set no duplicate values to setLeftCity state
        setLeftCity(noLeftDuplicates);
      };
      // 3. Function invoke
      fetchCity();
    }
  }, [provinceId, rightCity]);

  // function Move single and all data with handel move
  const handelmove = (direction) => {
    // 1. check left direction
    if (direction === "left") {
      if (isRightCheck.length > 0) {
        let newRightArray = {}
        Object.keys(rightCity).forEach(function (key, index) {
          newRightArray = { ...newRightArray, [key]: rightCity[key].filter((e) => { return isRightCheck.findIndex(selected => selected.city_id === e.city_id) < 0 }) }
        })
        setRightCity(newRightArray)
        setLeftCity(provinceId !== "" ? [...isRightCheck] : [...leftCity, ...isRightCheck])
        setProvinceId("");
        setIsLeftCheck([]);
        setIsRightCheck([]);
      }
    }

    // 2. check right direction
    else {
      if (direction === "right" && isLeftCheck.length > 0) {
        const key = findProvinceByCityList(provinceId);
        if (provinceId !== "") {
          if (rightCity[key]) {
            setRightCity({
              ...rightCity,
              [key]: rightCity[key].concat(isLeftCheck),
            });
          } else {
            setRightCity({
              ...rightCity,
              [key]: isLeftCheck,
            });
          }
        }
        else {
          const combinedObjects = isLeftCheck.reduce((accumulator, currentObject) => {
            const existingObject = accumulator.find(obj => obj.province_fid === currentObject.province_fid);
            if (existingObject) {
              existingObject.cityArray = [...existingObject.cityArray, currentObject];
            } else {
              accumulator.push({ ...currentObject, cityArray: [currentObject] });
            }
            return accumulator;
          }, []);

          let newRightCity = { ...rightCity }
          combinedObjects.forEach((cityOfProvince) => {
            const key = findProvinceByCityList(cityOfProvince.province_fid);
            newRightCity = {
              ...newRightCity,
              [key]: rightCity[key] ? [...cityOfProvince.cityArray, ...rightCity[key]] : cityOfProvince.cityArray,
            }
          })
          setRightCity(newRightCity)
          setLeftCity(leftCity.filter(e => !isLeftCheck.includes(e)))
        }
        setIsLeftCheck([]);
        setIsRightCheck([]);
      }
    }
  };

  // convert city id to country
  function convertCityId(id) {
    const res = cityList.find((item) => item.city_id === id);
    return res?.city;
  }

  // handleSelectAll
  const handleSelectAll = (direction, e) => {
    const { checked } = e.target;
    if (direction === "left") {
      setIsLeftCheckAll(checked);
      if (checked) {
        setIsLeftCheck(leftCity.map((li) => li));
      } else {
        setIsLeftCheck([]);
      }
    }
    if (direction === "right") {
      console.log("right select all", rightCity)
      setIsRightCheckAll(checked);

      if (checked) {
        let output = [];
        Object.keys(rightCity).forEach(function (key, index) {
          output = [...output, ...rightCity[key]]
        })
        setIsRightCheck(output)
      }
      else {
        setIsRightCheck([]);
      }
    }
  };

  // HandleClick checked single checkbox -- single check
  const handelClick = (direction, e, data) => {

    const { checked } = e.target;
    if (direction === "left") {
      if (checked) {
        setIsLeftCheck([...isLeftCheck, data]);
      } else {
        setIsLeftCheck(isLeftCheck.filter((item) => item !== data));
      }
    }
    if (direction === "right") {
      if (checked) {
        setIsRightCheck([...isRightCheck, data]);
      } else {
        setIsRightCheck(isRightCheck.filter((item) => item !== data));
      }
    }
  };

  // disable all both side checkbox
  useEffect(() => {
    setIsLeftCheckAll(false);
    setIsRightCheckAll(false);

    // setIsLeftCheck([]);
    // setIsRightCheck([]);
  }, [provinceId, leftCity, rightCity]);

  //findProvinceByCityList
  const findProvinceByCityList = (province_fid) => {
    const res = provinceList.find((item) => item.province_id === province_fid);

    return res?.province;
  };

  const calc_total = (rightcitys) => {
    var total = 0;
    rightcitys.map((city, index) => (total += city.length))
    return total
  }

  const handleDiscard = () => {
    setIsOpen(false)
    setProvinceId("")
    countCityInRegion()
    setLeftCity([])
    setIsLeftCheckAll(false)
    setIsRightCheckAll(false)
    setIsLeftCheck([])
    setIsRightCheck([])
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        open={isOpen}
        onClose={() => { handleDiscard() }}
        className='relative z-50'
      >
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <div className='fixed inset-0 bg-black/60' aria-hidden='true' />

        {/* Full-screen container to center the panel */}
        <div className='fixed inset-0 flex items-center justify-center p-4'>
          {/* The actual dialog panel  */}
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-100'
            enterFrom='opacity-0 scale-95'
            enterTo='opacity-100 scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-95'
          >
            <Dialog.Panel className='mx-auto w-[800px] rounded-[15px] bg-white overflow-hidden'>
              <div className='p-6 bg-[#0CA8F8] text-white text-xl font-semibold'>
                Select Cities
                {/* - {selectedRegionId} */}
              </div>
              <div className='py-5 px-10'>
                <div className='space-y-5 text-sm'>
                  <div className='grid grid-cols-3 gap-3'>

                    <div className='w-full'>
                      <label  className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Country</label>

                      <AddCityCountryDropdown
                        list={countryList}
                        state={{ countryId, setCountryId }}
                        convertCountryId={convertCountryId}
                        selectedCountry={citiesData.country_fid}
                      />
                    </div>
                    <div className='w-full'>
                    <label  className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Province</label>

                    <AddProvinceDropdown
                      list={province}
                      state={{ provinceId, setProvinceId }}
                      convertProvinceId={convertProvinceId}
                    />
                    {/* <OrgDropdown
                      state={{ orgId, setOrgId }}
                      list={orgList}
                      convertOrgTypeName={convertOrgTypeName}
                    /> */}
                  </div>
                </div>
                <div className='flex items-center gap-3'>



                  {/* Left---------------------------------      */}

                  <div className='flex-1'>
                    <h2 className='mb-2 font-medium text-lg text-[#0CA8F8] px-2'>
                      Cities {provinceId && `of ${findProvinceByCityList(provinceId)}`}
                    </h2>
                    <div className='border h-[300px] overflow-y-auto rounded-lg'>
                      {leftCity.length ? (
                        <>
                          <div className='flex items-center gap-2.5 py-1 px-2.5 border-b border-gray-200/75'>
                            <input
                              className='h-4 w-4 cursor-pointer'
                              type='checkbox'
                              checked={isLeftCheckAll}
                              onClick={(e) => handleSelectAll("left", e)}
                              onChange={() => { }}
                            />
                            <span className='py-1 text-gray-500'>
                              Total:{" "}
                              <span className='font-semibold text-gray-700'>
                                {leftCity.length}
                              </span>
                            </span>
                          </div>
                          {leftCity.map((data, index) => {
                            return (
                              <div
                                className='flex items-center gap-2.5 py-[6px] px-2.5'
                                key={index}
                              >
                                <input
                                  className='h-4 w-4 cursor-pointer'
                                  // disabled={fields(data.city_id)}
                                  type='checkbox'
                                  onChange={(e) =>
                                    handelClick("left", e, data)
                                  }
                                  checked={isLeftCheck.includes(data)}
                                />
                                <span className='text-gray-600'>
                                  {data.city}
                                </span>
                              </div>
                            );
                          })}
                        </>
                      ) : (
                        <p className='px-4 py-0.5'>{provinceId ? "No Cities Found..." : "Please select province"}</p>
                      )}
                    </div>
                  </div>



                  {/* Button ------------------------------- [  >  ]    [  <  ]  */}
                  <div className='flex flex-col gap-8'>
                    <div className='flex flex-col gap-3'>
                      <button
                        onClick={() => handelmove("right")}
                        className='py-0.5 px-4 rounded-xl bg-[#24b1f9] border border-[#0ca8f8] text-white border-none outline-none'
                      >
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
                            d='M8.25 4.5l7.5 7.5-7.5 7.5'
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handelmove("left")}
                        className='py-0.5 px-4 rounded-xl bg-[#24b1f9] border border-[#0ca8f8] text-white border-none outline-none'
                      >
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
                            d='M15.75 19.5L8.25 12l7.5-7.5'
                          />
                        </svg>
                      </button>
                    </div>
                  </div>



                  {/* Right --------------------------------    */}
                  <div className='flex-1'>
                    <h2 className='mb-2 font-medium text-lg text-[#0CA8F8] px-2'>
                      Cities under {data.Region} Region
                    </h2>
                    {/* Hide filterCity.List2 */}
                    <div className='border h-[300px] overflow-y-auto rounded-lg pb-4'>
                      {Object.values(rightCity).length ? (
                        <>
                          <div className='flex items-center gap-2.5 py-1 px-2.5 border-b border-gray-200/75'>
                            <input
                              className='h-4 w-4 cursor-pointer'
                              type='checkbox'
                              checked={isRightCheckAll}
                              onChange={() => { }}
                              onClick={(e) => handleSelectAll("right", e)}
                            />

                            <span className='py-1 text-gray-500'>
                              Total:{" "}
                              <span className='font-semibold text-gray-700'>
                                {calc_total(Object.values(rightCity))}
                                {/* {Object.values(rightCity).map(
                                    (city, index) => {
                                      return (
                                        <React.Fragment key={index}>
                                          {city.length}
                                        </React.Fragment>
                                      );
                                    }
                                  )} */}
                              </span>
                            </span>
                          </div>
                          <div>
                            <div>
                              {Object.entries(rightCity)
                                //.reverse()
                                .map((city, index) => {
                                  return (
                                    <React.Fragment key={index}>
                                      {city[1].length > 0 && (
                                        <>
                                          <p className='py-2 px-3  font-semibold text-gray-800'>
                                            {city[0]}
                                          </p>


                                          {city[1].map((data, index) => {
                                            return (
                                              <div key={index}>
                                                <label className='flex items-center pl-3 border-gray-300/90 border-l ml-4 gap-2.5  py-[2px]  px-2.5 cursor-pointer hover:bg-gray-100/70'>
                                                  <input
                                                    className='h-4 w-4 cursor-pointer'
                                                    type='checkbox'
                                                    checked={isRightCheck.includes(data)}
                                                    onChange={(e) =>
                                                      handelClick(
                                                        "right",
                                                        e,
                                                        data
                                                      )
                                                    }
                                                  // checked={isCheck?.list2?.includes(
                                                  //   data
                                                  // )}
                                                  />

                                                  <span className='text-gray-600/85'>
                                                    {data.city}
                                                  </span>
                                                </label>
                                              </div>
                                            );
                                          })}
                                        </>
                                      )}
                                    </React.Fragment>
                                  );
                                })}
                            </div>
                          </div>
                        </>
                      ) : (
                        <p className='px-4 py-0.5'></p>
                      )}
                    </div>
                  </div>





                </div>
              </div>
              <div className='mt-6 flex gap-x-4 justify-end'>
                <button
                  className='px-6 py-2.5 min-w-[140px] bg-[#0CA8F8] text-white font-semibold rounded-md'
                  disabled={loading ? true : false}
                  onClick={insertData}
                >
                  {loading ? "Adding..." : " Add"}
                </button>
                <button
                  className='px-6 py-2.5 bg-[#DDE0E2] min-w-[140px] text-gray-500 font-semibold rounded-md'
                  onClick={() => { handleDiscard() }}
                >
                  Discard
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </div>
    </Dialog>
    </Transition >
  );
}
