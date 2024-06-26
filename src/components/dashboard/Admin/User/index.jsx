import ActionBtn from "@/components/dashboard/Admin/User/ActionBtn";
import InsertData from "@/components/dashboard/Admin/User/InsertData";
import Pagination from "@/components/dashboard/Admin/User/Pagination";
import Layout from "@/components/dashboard/layout/Layout";
import axiosInstance from "@/auth_services/instance";
import moment from "moment";
import { useEffect, useState } from "react";

export async function getServerSideProps() {
  const fetchUsers = await axiosInstance.get(process.env.API_SERVER + "users");

  return {
    props: {
      userLists: fetchUsers.data,
    },
  };
}

const Users = ({ userLists }) => {
  const [userList, setUserList] = useState(userLists);
  const [pageEntries, setPageEntries] = useState(5);
  const [pageTotal, setPageTotal] = useState(1);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [pageStart, setPageStart] = useState(0);
  const [pageEnd, setPageEnd] = useState(5);
  const [direction, setDirection] = useState("start");
  const [query, setQuery] = useState("");

  const tableReload = async () => {
    const res = await axiosInstance.get(process.env.API_SERVER + "users");
    if (res.status === 201) {
      setProdLocationList(res.data);

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
    var num1 = userList.length / pageEntries;
    var num2 = Math.round(userList.length / pageEntries);
    if (num1 > num2) {
      num2 = num2 + 1;
    }
    setPageTotal(num2);

    switch (direction) {
      case "prev":
        if (pageCurrent > 1) setPageCurrent(pageCurrent - 1);
        else setPageCurrent(1);
        break;
      case "next":
        if (pageCurrent < pageTotal) setPageCurrent(pageCurrent + 1);
        else setPageCurrent(pageTotal);
        break;
      case "start":
        setPageCurrent(1);
        break;
      case "end":
        setPageCurrent(pageTotal);
        break;
      default:
        //setPageCurrent(1)
        break;
    }

    setDirection("");
    var pgStart = pageEntries * (pageCurrent - 1);
    var pgEnd = pgStart + parseInt(pageEntries);
    setPageStart(pgStart);
    setPageEnd(pgEnd);
  };

  return (
    <div className='p-5'>
      <div className='mx-auto'>
        <div className='flex gap-2 text-lg mb-6'>
          <span>Menu</span>
          <span>{">"}</span>
          <span>Location</span>
        </div>
      </div>
      <div className='px-3 py-5 rounded-lg border shadow bg-white'>
        <div className='flex justify-between items-center gap-2 px-4'>
          <div className='flex items-center gap-2 text-sm'>
            <span>Show</span>
            <div className='inline-flex items-center relative cursor-pointer min-w-[50px] text-sm'>
              <select
                onChange={(e) => {
                  setPageEntries(e.target.value);
                }}
                className='appearance-none w-full border outline-none rounded-[4px] px-1 cursor-pointer'
              >
                <option defaultValue='5'>5</option>
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
            <InsertData
              fn={{
                tableReload,
              }}
              state={{
                userList,
              }}
            />
          </div>
        </div>
        <div className='relative overflow-x-auto mt-10 rounded-lg bg-[#E9E9E9] p-3'>
          <table className='w-full border-separate border-spacing-y-2'>
            <thead className='text-sm text-slate-700'>
              <tr>
                <th className='px-4 py-2 text-left'>Username</th>
                <th className='px-4 py-2 text-left'>Name</th>
                <th className='px-4 py-2 text-left'>Email</th>
                <th className='px-4 py-2 text-left'>Password</th>
                <th className='px-4 py-2 text-left'>Is Active</th>
                <th className='px-4 py-2 text-left'>Last Modified</th>
                <th className='px-4 py-2 text-left'>Is Deleted</th>
                <th className='py-2 text-left pl-[25px]'>Action</th>
              </tr>
            </thead>
            <tbody className='text-xs'>
              {filteredResults.slice(pageStart, pageEnd).map((data, index) => {
                return (
                  <tr className='bg-white' key={index}>
                    <td className='px-4 py-3 text-left'>{data.user_name}</td>
                    <td className='px-4 py-3 text-left'>{data.name}</td>
                    <td className='px-4 py-3 text-left'>{data.email}</td>
                    <td className='px-4 py-3 text-left'>{data.password}</td>
                    <td className='px-4 py-3 text-left'>
                      {data.is_active ? "True" : "False"}
                    </td>
                    <td className='px-4 py-3 text-left'>
                      {moment(data.created_at).format("MMM Do, YYYY")}
                    </td>
                    <td className='px-4 py-3 text-left'>
                      {data.is_deleted ? "True" : "False"}
                    </td>
                    <td className='px-4 py-3 text-left'>
                      {/* <ActionBtn
                        data={data}
                        fn={{
                          tableReload,
                        }}
                        state={{
                          cityList,
                        }}
                      /> */}
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
            <Pagination pageCurrent={pageCurrent} setDirection={setDirection} />
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
