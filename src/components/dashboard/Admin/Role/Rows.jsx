import ActionBtn from "@/components/dashboard/Admin/Role/ActionBtn";
import moment from "moment";
import { useState } from "react";
import Users from "@/components/dashboard/Admin/Role/Users";

const Rows = ({ data, menuCheck, menuList, tableReload, state, roleId, updateStatus }) => {
    const {
        userLst,
        genreLst,
        roles, } = state;

    const [open, setopen] = useState(false);
    const [stat, setstat] = useState(false)

    // convert user_fid to user real name
    function convertuserName(user_fid) {
        const user = userLst.find((item) => item.user_id === user_fid);
        return user?.name;
    }


    return (
        <>
            <tr
                key={data.role_id}

                className={open ? "bg-white hover:shadow-lg" : "bg-white hover:shadow-lg "}

                onClick={e => setopen(!open)}
            >
                <td className="px-4 py-3 text-left ">

                    <div className="inline-flex items-center cursor-pointer">
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
                            className={`${open ? 'rotate-180 transform' : ''}`}
                        >
                            <path stroke='none' d='M0 0h17v17H0z' fill='none'></path>
                            <path d='M6 9l6 6l6 -6'></path>
                        </svg>

                        &nbsp;
                        &nbsp;
                        <span>
                            {data.role_name}
                        </span>

                    </div>
                    {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#000"><path d="M12.04 3.5c.59 0 7.54.02 9.34.5a3.02 3.02 0 0 1 2.12 2.15C24 8.05 24 12 24 12v.04c0 .43-.03 4.03-.5 5.8A3.02 3.02 0 0 1 21.38 20c-1.76.48-8.45.5-9.3.51h-.17c-.85 0-7.54-.03-9.29-.5A3.02 3.02 0 0 1 .5 17.84c-.42-1.61-.49-4.7-.5-5.6v-.5c.01-.9.08-3.99.5-5.6a3.02 3.02 0 0 1 2.12-2.14c1.8-.49 8.75-.51 9.34-.51zM9.54 8.4v7.18L15.82 12 9.54 8.41z"/></svg> */}
                </td>

                <td className="px-4 py-3 text-left ">
                    <label className="relative inline-flex items-center mr-5 cursor-pointer">
                        <input
                            type="checkbox"
                            onChange={e => (updateStatus(data.role_id, e.target.checked))}
                            defaultChecked={data.is_active ? true : false}
                            value=""
                            className="sr-only peer"
                            disabled={!menuCheck}
                        />
                        <div className="w-9 h-5  bg-gray-400 rounded-full peer dark:bg-gray-700  dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                    </label>
                </td>

                {/* <td className="px-4 py-3 text-left ">
                    {convertuserName(data.modified_by)}
                </td> */}
                <td className="px-6 py-3 text-left">
                    {moment(data.created_at).format("MMM Do, YYYY")}
                </td>

                <td className="z-100 px-4 py-3 text-left">
                    {menuCheck ? (
                        <ActionBtn
                            data={data}
                            menuList={menuList}
                            roleId={roleId}
                            tableReload={tableReload}
                            state={state}
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
            <tr className="ml-2 p-0 bg-gray-200" style={{ display: (open ? "" : "none") }} >
                <td colSpan="10" className="p-2">
                    <Users
                        data={data}
                        menuCheck={menuCheck}
                        roleId={data.role_id}
                        state={state}
                        roleName={data.role_name}
                    />
                </td>
            </tr>
        </>
    )
}

export default Rows