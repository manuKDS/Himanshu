import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import ActiveLink from "./ActiveLink";
import { Icon } from "@iconify/react";
import { Disclosure } from '@headlessui/react'
import { hasCookie, getCookie } from "cookies-next";
import jwt from "jsonwebtoken";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const active_menu = useSelector(
    (state) => state.production.active_menu
  );
  const [user, setuser] = useState({})
  const [menuArray, setmenuArray] = useState([])
  const [menuCheck, setmenuCheck] = useState([])

  useEffect(() => {
    let validToken = hasCookie("token");

    if (!validToken) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    let getToken = getCookie("token")
    //console.log("token ", getToken)
    let decodeUser = jwt.decode(getToken)
    //console.log("decode ", decodeUser)
    setuser(decodeUser)

    const menus = decodeUser.menurole
    setmenuArray(menus);
    const menuCheck1 = [];
    for (let i = 1; i <= 30; i++) {
      let result = menus.find(item => item.menu_fid == i)
      if (result == undefined) {
        menuCheck1[i] = false
      } else {
        menuCheck1[i] = true
      }
    }
    setmenuCheck(menuCheck1)
    //console.log(menuCheck[3])
  }, [])


  return (
    <div className=' min-h-screen min-w-[200px] w-[200px]'>
      <div className='px-2  h-[72px] border-b text-center flex items-center justify-center'>
        <img className='w-[120px] ' src='/frames-logo.png' />
        {/* <h2 className="text-4xl font-bold">Four Frames</h2> */}
      </div>
      <div className=''>


        <div className="w-full px-0 pt-1 flex justify-start items-start ">
          <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-2">
            {/* {menuCheck[1] && ( */}
            <Link href="/" >
              <div
                //className='flex gap-2 p-1 pl-4 pb-2 w-full   items-center'
                className={
                  active_menu == "dashboard"
                    ? 'flex gap-2 p-1 pl-4 pb-2 w-full mb-1  items-center  bg-gray-100 text-blue-600'
                    : 'flex gap-2 p-1 pl-4 pb-2 w-full mb-1  items-center  hover:bg-gray-100'
                }
              >
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-layout-dashboard" width="20" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M4 4h6v8h-6z"></path>
                    <path d="M4 16h6v4h-6z"></path>
                    <path d="M14 12h6v8h-6z"></path>
                    <path d="M14 4h6v4h-6z"></path>
                  </svg>
                </span>
                <span>
                  <span className="text-sm">Dashboard</span>
                </span>
              </div>
            </Link>
            {/* )} */}

            {/* Production -------------------------------- */}

            {(menuCheck[3] || menuCheck[4] || menuCheck[5]) && <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full justify-between rounded-lg bg-blue-100 px-4 py-2 text-left text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">

                    <div className='flex gap-2 w-full   items-center'>
                      <span>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          strokeWidth='1.5'
                          stroke='currentColor'
                          className='w-6 h-6'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M3 8.25V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V8.25m-18 0V6a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6v2.25m-18 0h18M5.25 6h.008v.008H5.25V6zM7.5 6h.008v.008H7.5V6zm2.25 0h.008v.008H9.75V6z'
                          />
                        </svg>
                      </span>
                      <span>
                        Production
                      </span>
                    </div>

                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      //className='icon icon-tabler icon-tabler-chevron-down'
                      width='17'
                      height='17'
                      viewBox='0 0 24 24'
                      strokeWidth='3'
                      stroke='currentColor'
                      fill='none'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className={`${open ? 'rotate-180 transform' : ''
                        } h-5 w-5 text-blue-500`}
                    >
                      <path stroke='none' d='M0 0h17v17H0z' fill='none'></path>
                      <path d='M6 9l6 6l6 -6'></path>
                    </svg>

                  </Disclosure.Button>
                  <Disclosure.Panel className="px-2 pt-2 text-xs text-gray-600 bg-white">

                    {menuCheck[3] && (
                      <Link href="/production">
                        <button className='w-full'>
                          <div className={
                            active_menu == "productions"
                              ? 'flex gap-2 p-2 items-center  bg-gray-100 text-blue-600'
                              : 'flex gap-2 p-2 items-center  hover:bg-gray-100'
                          }
                          >
                            <span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-movie" width="20" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
                                <path d="M8 4l0 16"></path>
                                <path d="M16 4l0 16"></path>
                                <path d="M4 8l4 0"></path>
                                <path d="M4 16l4 0"></path>
                                <path d="M4 12l16 0"></path>
                                <path d="M16 8l4 0"></path>
                                <path d="M16 16l4 0"></path>
                              </svg>
                            </span>
                            <span>All Productions</span>
                          </div>
                        </button>
                      </Link>
                    )}

                    {menuCheck[4] && (
                      <Link href="/feature">
                        <button className='w-full'>
                          <div className={
                            active_menu == "features"
                              ? 'flex gap-2 p-2 items-center  bg-gray-100 text-blue-600'
                              : 'flex gap-2 p-2 items-center  hover:bg-gray-100'
                          }
                          >
                            <span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-video" width="20" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M15 10l4.553 -2.276a1 1 0 0 1 1.447 .894v6.764a1 1 0 0 1 -1.447 .894l-4.553 -2.276v-4z"></path>
                                <path d="M3 6m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z"></path>
                              </svg>
                            </span>
                            <span>Features</span>
                          </div>
                        </button>
                      </Link>
                    )}

                    {menuCheck[5] && (
                      <Link href="/series">
                        <button className='w-full'>
                          <div className={
                            active_menu == "series"
                              ? 'flex gap-2 p-2 items-center  bg-gray-100 text-blue-600 '
                              : 'flex gap-2 p-2 items-center  hover:bg-gray-100'
                          }
                          >
                            <span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-video-plus" width="20" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M15 10l4.553 -2.276a1 1 0 0 1 1.447 .894v6.764a1 1 0 0 1 -1.447 .894l-4.553 -2.276v-4z"></path>
                                <path d="M3 6m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z"></path>
                                <path d="M7 12l4 0"></path>
                                <path d="M9 10l0 4"></path>
                              </svg>
                            </span>
                            <span>Series</span>
                          </div>
                        </button>
                      </Link>
                    )}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>}


            {/* Menu -------------------------------- */}

            {(menuCheck[7] || menuCheck[8] || menuCheck[9] || menuCheck[10] || menuCheck[11] || menuCheck[12] || menuArray?.findIndex(e => e.menu_fid === 28) !== -1) && <Disclosure as="div" className="mt-2">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full justify-between rounded-lg bg-blue-100 px-4 py-2 text-left text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">

                    <div className='flex gap-2 w-full   items-center'>
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-list" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                          <path d="M9 6l11 0"></path>
                          <path d="M9 12l11 0"></path>
                          <path d="M9 18l11 0"></path>
                          <path d="M5 6l0 .01"></path>
                          <path d="M5 12l0 .01"></path>
                          <path d="M5 18l0 .01"></path>
                        </svg>
                      </span>
                      <span>
                        Menu
                      </span>
                    </div>

                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      //className='icon icon-tabler icon-tabler-chevron-down'
                      width='17'
                      height='17'
                      viewBox='0 0 24 24'
                      strokeWidth='3'
                      stroke='currentColor'
                      fill='none'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className={`${open ? 'rotate-180 transform' : ''
                        } h-5 w-5 text-blue-500`}
                    >
                      <path stroke='none' d='M0 0h17v17H0z' fill='none'></path>
                      <path d='M6 9l6 6l6 -6'></path>
                    </svg>
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-2 pt-2 text-xs text-gray-600 bg-white">

                    {menuCheck[7] && (
                      <Link href="/dashboard/menu/banking-information">
                        <button className='w-full'>
                          <div className={
                            active_menu == "banking-information"
                              ? 'flex gap-2 p-2 items-center  bg-gray-100 text-blue-600'
                              : 'flex gap-2 p-2 items-center  hover:bg-gray-100'
                          }>
                            <span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-building-bank" width="20" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M3 21l18 0"></path>
                                <path d="M3 10l18 0"></path>
                                <path d="M5 6l7 -3l7 3"></path>
                                <path d="M4 10l0 11"></path>
                                <path d="M20 10l0 11"></path>
                                <path d="M8 14l0 3"></path>
                                <path d="M12 14l0 3"></path>
                                <path d="M16 14l0 3"></path>
                              </svg>
                            </span>
                            <span>Banking Information</span>
                          </div>
                        </button>
                      </Link>
                    )}

                    {menuCheck[8] && (
                      <Link href="/dashboard/menu/budget-information">
                        <button className='w-full'>
                          <div className={
                            active_menu == "budget-information"
                              ? 'flex gap-2 p-2 items-center  bg-gray-100 text-blue-600'
                              : 'flex gap-2 p-2 items-center  hover:bg-gray-100'
                          }>
                            <span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-clipboard-data" width="20" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"></path>
                                <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path>
                                <path d="M9 17v-4"></path>
                                <path d="M12 17v-1"></path>
                                <path d="M15 17v-2"></path>
                                <path d="M12 17v-1"></path>
                              </svg>
                            </span>
                            <span>Budget Information</span>
                          </div>
                        </button>
                      </Link>
                    )}
                    {menuCheck[9] && (
                      <Link href="/dashboard/menu/location-information">
                        <button className='w-full'>
                          <div className={
                            active_menu == "location-information"
                              ? 'flex gap-2 p-2 items-center  bg-gray-100 text-blue-600'
                              : 'flex gap-2 p-2 items-center  hover:bg-gray-100'
                          }>
                            <span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-map-pin" width="20" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
                                <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"></path>
                              </svg>
                            </span>
                            <span>Location Information</span>
                          </div>
                        </button>
                      </Link>
                    )}
                    {menuCheck[10] && (
                      <Link href="/dashboard/menu/production-schedule">
                        <button className='w-full'>
                          <div className={
                            active_menu == "productio-schedule"
                              ? 'flex gap-2 p-2 items-center  bg-gray-100 text-blue-600'
                              : 'flex gap-2 p-2 items-center  hover:bg-gray-100'
                          }>
                            <span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-calendar-check" width="20" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M11.5 21h-5.5a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v6"></path>
                                <path d="M16 3v4"></path>
                                <path d="M8 3v4"></path>
                                <path d="M4 11h16"></path>
                                <path d="M15 19l2 2l4 -4"></path>
                              </svg>
                            </span>
                            <span>Production Schedule</span>
                          </div>
                        </button>
                      </Link>
                    )}

                    {menuCheck[11] && (
                      <Link href="/dashboard/menu/tax-credit-expense-management">
                        <button className='w-full'>
                          <div className={
                            active_menu == "tax-credit-expense"
                              ? 'flex gap-2 p-2 items-center  bg-gray-100 text-blue-600'
                              : 'flex gap-2 p-2 items-center  hover:bg-gray-100'
                          }>
                            <span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-notebook" width="20" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-11a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1m3 0v18"></path>
                                <path d="M13 8l2 0"></path>
                                <path d="M13 12l2 0"></path>
                              </svg>
                            </span>
                            <span>Tax Credit Expense</span>
                          </div>
                        </button>
                      </Link>
                    )}

                    {menuCheck[12] && (
                      <Link href="/dashboard/menu/tax-calculation">
                        <button className='w-full'>
                          <div className={
                            active_menu == "tax-credit-calc"
                              ? 'flex gap-2 p-2 items-center  bg-gray-100 text-blue-600'
                              : 'flex gap-2 p-2 items-center  hover:bg-gray-100'
                          }>
                            <span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-calculator" width="20" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M4 3m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
                                <path d="M8 7m0 1a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1v1a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1z"></path>
                                <path d="M8 14l0 .01"></path>
                                <path d="M12 14l0 .01"></path>
                                <path d="M16 14l0 .01"></path>
                                <path d="M8 17l0 .01"></path>
                                <path d="M12 17l0 .01"></path>
                                <path d="M16 17l0 .01"></path>
                              </svg>
                            </span>
                            <span>Tax Credit Calculation</span>
                          </div>
                        </button>
                      </Link>
                    )}

                    {menuArray.findIndex(e => e.menu_fid === 28) !== -1 && (
                      <Link href="/dashboard/menu/documents">
                        <button className='w-full'>
                          <div className={
                            active_menu == "documents"
                              ? 'flex gap-2 p-2 items-center  bg-gray-100 text-blue-600'
                              : 'flex gap-2 p-2 items-center  hover:bg-gray-100'
                          }>
                            <span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-file-text" width="20" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                                <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path>
                                <path d="M9 9l1 0"></path>
                                <path d="M9 13l6 0"></path>
                                <path d="M9 17l6 0"></path>
                              </svg>
                            </span>
                            <span>Documents</span>
                          </div>
                        </button>
                      </Link>
                    )}



                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>}


            {/* Admin -------------------------------- */}

            {(menuCheck[14] || menuCheck[15] || menuCheck[16] || menuCheck[17] || menuCheck[18] || menuCheck[19] || menuCheck[20] || menuCheck[21] || menuArray?.findIndex(e => e.menu_fid === 29) !== -1) && <Disclosure as="div" className="mt-2">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full justify-between rounded-lg bg-blue-100 px-4 py-2 text-left text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">

                    <div className='flex gap-2 w-full   items-center'>
                      <span>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='24'
                          height='24'
                          viewBox='0 0 20 20'
                        >
                          <path
                            fill='#3a3a3a'
                            d='M10 9.25c-2.27 0-2.73-3.44-2.73-3.44C7 4.02 7.82 2 9.97 2c2.16 0 2.98 2.02 2.71 3.81c0 0-.41 3.44-2.68 3.44zm0 2.57L12.72 10c2.39 0 4.52 2.33 4.52 4.53v2.49s-3.65 1.13-7.24 1.13c-3.65 0-7.24-1.13-7.24-1.13v-2.49c0-2.25 1.94-4.48 4.47-4.48z'
                          />
                        </svg>
                      </span>
                      <span>
                        Admin
                      </span>
                    </div>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      //className='icon icon-tabler icon-tabler-chevron-down'
                      width='17'
                      height='17'
                      viewBox='0 0 24 24'
                      strokeWidth='3'
                      stroke='currentColor'
                      fill='none'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className={`${open ? 'rotate-180 transform' : ''
                        } h-5 w-5 text-blue-500`}
                    >
                      <path stroke='none' d='M0 0h17v17H0z' fill='none'></path>
                      <path d='M6 9l6 6l6 -6'></path>
                    </svg>
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-2 pt-2  text-xs text-gray-600 bg-white">

                    {menuCheck[14] && (
                      <Link href="/dashboard/admin/user">
                        <button className='w-full'>
                          <div className={
                            active_menu == "user"
                              ? 'flex gap-2 p-2 items-center  bg-gray-100 text-blue-600'
                              : 'flex gap-2 p-2 items-center  hover:bg-gray-100'
                          }>
                            <span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-users" width="20" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
                                <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                <path d="M21 21v-2a4 4 0 0 0 -3 -3.85"></path>
                              </svg>
                            </span>
                            <span>User</span>
                          </div>
                        </button>
                      </Link>
                    )}

                    {menuCheck[15] && (
                      <Link href="/dashboard/admin/organization">
                        <button className='w-full'>
                          <div className={
                            active_menu == "organization"
                              ? 'flex gap-2 p-2 items-center  bg-gray-100 text-blue-600'
                              : 'flex gap-2 p-2 items-center  hover:bg-gray-100'
                          }>
                            <span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-building" width="20" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M3 21l18 0"></path>
                                <path d="M9 8l1 0"></path>
                                <path d="M9 12l1 0"></path>
                                <path d="M9 16l1 0"></path>
                                <path d="M14 8l1 0"></path>
                                <path d="M14 12l1 0"></path>
                                <path d="M14 16l1 0"></path>
                                <path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16"></path>
                              </svg>
                            </span>
                            <span>Organization</span>
                          </div>
                        </button>
                      </Link>
                    )}

                    {menuCheck[16] && (
                      <Link href="/dashboard/admin/nature-expense">
                        <button className='w-full'>
                          <div className={
                            active_menu == "nature-of-expense"
                              ? 'flex gap-2 p-2 items-center  bg-gray-100 text-blue-600'
                              : 'flex gap-2 p-2 items-center  hover:bg-gray-100'
                          }>
                            <span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-coins" width="20" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M9 14c0 1.657 2.686 3 6 3s6 -1.343 6 -3s-2.686 -3 -6 -3s-6 1.343 -6 3z"></path>
                                <path d="M9 14v4c0 1.656 2.686 3 6 3s6 -1.344 6 -3v-4"></path>
                                <path d="M3 6c0 1.072 1.144 2.062 3 2.598s4.144 .536 6 0c1.856 -.536 3 -1.526 3 -2.598c0 -1.072 -1.144 -2.062 -3 -2.598s-4.144 -.536 -6 0c-1.856 .536 -3 1.526 -3 2.598z"></path>
                                <path d="M3 6v10c0 .888 .772 1.45 2 2"></path>
                                <path d="M3 11c0 .888 .772 1.45 2 2"></path>
                              </svg>
                            </span>
                            <span>Nature Of Expense</span>
                          </div>
                        </button>
                      </Link>
                    )}


                    {(menuArray?.findIndex(e => e.menu_fid === 29) !== -1) && (
                      <Link href="/dashboard/admin/expense-categories">
                        <button className='w-full'>
                          <div className={
                            active_menu == "expense-categories"
                              ? 'flex gap-2 p-2 items-center  bg-gray-100 text-blue-600'
                              : 'flex gap-2 p-2 items-center  hover:bg-gray-100'
                          }>
                            <span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-file-dollar" width="20" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                                <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path>
                                <path d="M14 11h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5"></path>
                                <path d="M12 17v1m0 -8v1"></path>
                              </svg>
                            </span>
                            <span>Expense Categories</span>
                          </div>
                        </button>
                      </Link>
                    )}

                    {menuCheck[17] && (
                      <Link href="/dashboard/admin/expense-title">
                        <button className='w-full'>
                          <div className={
                            active_menu == "expense-title"
                              ? 'flex gap-2 p-2 items-center  bg-gray-100 text-blue-600'
                              : 'flex gap-2 p-2 items-center  hover:bg-gray-100'
                          }>
                            <span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-file-dollar" width="20" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                                <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path>
                                <path d="M14 11h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5"></path>
                                <path d="M12 17v1m0 -8v1"></path>
                              </svg>
                            </span>
                            <span>Expense Title</span>
                          </div>
                        </button>
                      </Link>
                    )}

                    {menuCheck[18] && (
                      <Link href="/dashboard/admin/tax-credit-application">
                        <button className='w-full'>
                          <div className={
                            active_menu == "tax-credit-application"
                              ? 'flex gap-2 p-2 items-center  bg-gray-100 text-blue-600'
                              : 'flex gap-2 p-2 items-center  hover:bg-gray-100'
                          }>
                            <span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-book-2" width="20" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M19 4v16h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12z"></path>
                                <path d="M19 16h-12a2 2 0 0 0 -2 2"></path>
                                <path d="M9 8h6"></path>
                              </svg>
                            </span>
                            <span>Tax Credit Application</span>
                          </div>
                        </button>
                      </Link>
                    )}

                    {menuCheck[19] && (
                      <Link href="/dashboard/admin/genre">
                        <button className='w-full'>
                          <div className={
                            active_menu == "genre-list"
                              ? 'flex gap-2 p-2 items-center  bg-gray-100 text-blue-600'
                              : 'flex gap-2 p-2 items-center  hover:bg-gray-100'
                          }>
                            <span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-list-check" width="20" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M3.5 5.5l1.5 1.5l2.5 -2.5"></path>
                                <path d="M3.5 11.5l1.5 1.5l2.5 -2.5"></path>
                                <path d="M3.5 17.5l1.5 1.5l2.5 -2.5"></path>
                                <path d="M11 6l9 0"></path>
                                <path d="M11 12l9 0"></path>
                                <path d="M11 18l9 0"></path>
                              </svg>
                            </span>
                            <span>Genre List</span>
                          </div>
                        </button>
                      </Link>
                    )}


                    {menuCheck[20] && (
                      <Link href="/dashboard/admin/region">
                        <button className='w-full'>
                          <div className={
                            active_menu == "region"
                              ? 'flex gap-2 p-2 items-center  bg-gray-100 text-blue-600'
                              : 'flex gap-2 p-2 items-center  hover:bg-gray-100'
                          }>
                            <span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-world" width="20" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
                                <path d="M3.6 9h16.8"></path>
                                <path d="M3.6 15h16.8"></path>
                                <path d="M11.5 3a17 17 0 0 0 0 18"></path>
                                <path d="M12.5 3a17 17 0 0 1 0 18"></path>
                              </svg>
                            </span>
                            <span>Region</span>
                          </div>
                        </button>
                      </Link>
                    )}

                    {menuCheck[21] && (
                      <Link href="/dashboard/admin/role">
                        <button className='w-full'>
                          <div className={
                            active_menu == "role"
                              ? 'flex gap-2 p-2 items-center  bg-gray-100 text-blue-600'
                              : 'flex gap-2 p-2 items-center  hover:bg-gray-100'
                          }>
                            <span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-key" width="20" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M16.555 3.843l3.602 3.602a2.877 2.877 0 0 1 0 4.069l-2.643 2.643a2.877 2.877 0 0 1 -4.069 0l-.301 -.301l-6.558 6.558a2 2 0 0 1 -1.239 .578l-.175 .008h-1.172a1 1 0 0 1 -.993 -.883l-.007 -.117v-1.172a2 2 0 0 1 .467 -1.284l.119 -.13l.414 -.414h2v-2h2v-2l2.144 -2.144l-.301 -.301a2.877 2.877 0 0 1 0 -4.069l2.643 -2.643a2.877 2.877 0 0 1 4.069 0z"></path>
                                <path d="M15 9h.01"></path>
                              </svg>
                            </span>
                            <span>Role</span>
                          </div>
                        </button>
                      </Link>
                    )}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
            }


            {/* Admin -------------------------------- */}

            {(menuCheck[23] || menuCheck[24] || menuCheck[25] || menuCheck[26] || menuCheck[27]) && <Disclosure as="div" className="mt-2">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full justify-between rounded-lg bg-blue-100 px-4 py-2 text-left text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">

                    <div className='flex gap-2 w-full   items-center'>
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-settings" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                          <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"></path>
                          <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
                        </svg>
                      </span>
                      <span>
                        Settings
                      </span>
                    </div>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      //className='icon icon-tabler icon-tabler-chevron-down'
                      width='17'
                      height='17'
                      viewBox='0 0 24 24'
                      strokeWidth='3'
                      stroke='currentColor'
                      fill='none'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className={`${open ? 'rotate-180 transform' : ''
                        } h-5 w-5 text-blue-500`}
                    >
                      <path stroke='none' d='M0 0h17v17H0z' fill='none'></path>
                      <path d='M6 9l6 6l6 -6'></path>
                    </svg>
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-2 pt-2  text-xs text-gray-600 bg-white">
                    {menuCheck[23] && (
                      <Link href="/dashboard/admin/vendor">
                        <button className='w-full'>
                          <div className={
                            active_menu == "vendor-list"
                              ? 'flex gap-2 p-2 items-center  bg-gray-100 text-blue-600'
                              : 'flex gap-2 p-2 items-center  hover:bg-gray-100'
                          }>
                            <span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-list-details" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M13 5h8"></path>
                                <path d="M13 9h5"></path>
                                <path d="M13 15h8"></path>
                                <path d="M13 19h5"></path>
                                <path d="M3 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"></path>
                                <path d="M3 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"></path>
                              </svg>
                            </span>
                            <span>Vendor List</span>
                          </div>
                        </button>
                      </Link>
                    )}

                    {menuCheck[24] && (
                      <Link href="/dashboard/admin/vendor_type">
                        <button className='w-full'>
                          <div className={
                            active_menu == "vendor-type"
                              ? 'flex gap-2 p-2 items-center  bg-gray-100 text-blue-600'
                              : 'flex gap-2 p-2 items-center  hover:bg-gray-100'
                          }>
                            <span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-truck" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                                <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                                <path d="M5 17h-2v-11a1 1 0 0 1 1 -1h9v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5"></path>
                              </svg>
                            </span>
                            <span>Vendor Type</span>
                          </div>
                        </button>
                      </Link>
                    )}


                    {menuCheck[25] && (
                      <Link href="/dashboard/admin/country">
                        <button className='w-full'>
                          <div className={
                            active_menu == "country"
                              ? 'flex gap-2 p-2 items-center  bg-gray-100 text-blue-600'
                              : 'flex gap-2 p-2 items-center  hover:bg-gray-100'
                          }>
                            <span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-flag-filled" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M4 5a1 1 0 0 1 .3 -.714a6 6 0 0 1 8.213 -.176l.351 .328a4 4 0 0 0 5.272 0l.249 -.227c.61 -.483 1.527 -.097 1.61 .676l.005 .113v9a1 1 0 0 1 -.3 .714a6 6 0 0 1 -8.213 .176l-.351 -.328a4 4 0 0 0 -5.136 -.114v6.552a1 1 0 0 1 -1.993 .117l-.007 -.117v-16z" strokeWidth="0" fill="currentColor"></path>
                              </svg>
                            </span>
                            <span>Country</span>
                          </div>
                        </button>
                      </Link>
                    )}

                    {menuCheck[26] && (
                      <Link href="/dashboard/admin/province">
                        <button className='w-full'>
                          <div className={
                            active_menu == "province"
                              ? 'flex gap-2 p-2 items-center  bg-gray-100 text-blue-600'
                              : 'flex gap-2 p-2 items-center  hover:bg-gray-100'
                          }>
                            <span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-map-2" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M12 18.5l-3 -1.5l-6 3v-13l6 -3l6 3l6 -3v7.5"></path>
                                <path d="M9 4v13"></path>
                                <path d="M15 7v5.5"></path>
                                <path d="M21.121 20.121a3 3 0 1 0 -4.242 0c.418 .419 1.125 1.045 2.121 1.879c1.051 -.89 1.759 -1.516 2.121 -1.879z"></path>
                                <path d="M19 18v.01"></path>
                              </svg>
                            </span>
                            <span>Province</span>
                          </div>
                        </button>
                      </Link>
                    )}

                    {menuCheck[27] && (
                      <Link href="/dashboard/admin/city">
                        <button className='w-full'>
                          <div className={
                            active_menu == "city"
                              ? 'flex gap-2 p-2 items-center  bg-gray-100 text-blue-600'
                              : 'flex gap-2 p-2 items-center  hover:bg-gray-100'
                          }>
                            <span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-location" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5"></path>
                              </svg>
                            </span>
                            <span>City</span>
                          </div>
                        </button>
                      </Link>
                    )}

                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>}

          </div>
        </div>



      </div>
    </div>
  );
};

export default Sidebar;
