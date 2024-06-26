import axiosInstance from '@/auth_services/instance';
import React, { useState, useEffect } from 'react'
import ActionBtnUser from './ActionBtnUser'
import AddUserRole from './AddUserRole';


const Users = ({ data, menuCheck, state, roleId, roleName }) => {
    const { roles, userLst, setuserLst, role_userLst } = state;
    const [role_user, setrole_user] = useState([])
    const [userlist, setuserlist] = useState([])
    const [isBoxOpen, setIsBoxOpen] = useState(false)

    useEffect(() => {
        const getList = () => {
            const list = role_userLst.filter(item => item.role_fid === roleId)
            setrole_user(list)
            //console.log(list)
            //const users = list.filter(user=> user.user_id === )
        }
        getList()
    }, [])

    const [open, setOpen] = useState(true)

    const handleChild = () => {
        setOpen(!open)
    }

    const userReload = async () => {
        try {
            const { data, error } = await axiosInstance.get(process.env.API_SERVER + "role_user");
            //console.log(data)        
            const list = data.filter(item => item.role_fid === roleId)
           // console.log(list)
            setrole_user(list)            
        }
        catch (err) {
            console.log(err)
        }
    }

    const tableReload = () => {
        userReload()
    }

    //   CONVERT user_fid to Name
    function convertUserToName(user_fid) {
        const user = userLst.find((item) => item.user_id == user_fid);
        return user?.name;
    }

    //   CONVERT user_fid to Email
    function convertUserToEmail(user_fid) {
        const user = userLst.find((item) => item.user_id == user_fid);
        return user?.email;
    }

    //   CONVERT user_fid to Username
    function convertUserToUserName(user_fid) {
        const user = userLst.find((item) => item.user_id == user_fid);
        return user?.user_name;
    }

    return (

        <table className="w-full text-sm text-left text-gray-900 dark:text-gray-400 border-3 border-solid ml-2"
            style={{ display: (open ? "all" : "none") }}>
            <thead className="text-xs text-gray-900 bg-gray-100 dark:bg-gray-700 dark:text-gray-700">
                {userLst.length > 0 && (
                    <tr>
                        <th scope="col" className="px-6 py-2">
                            Name
                        </th>
                        <th scope="col" className="px-6 py-2">
                            Email
                        </th>
                        <th scope="col" className="px-6 py-2">
                            Username
                        </th>

                        <th scope="col" className="px-6 py-2">
                            Action
                        </th>
                    </tr>
                )}
            </thead>
            <tbody>

                {role_user.map((user, index) => (
                    <tr key={user.role_user_id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 text-xs" >
                        <th scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {convertUserToName(user.user_fid)}
                        </th>
                        <td>
                            {convertUserToEmail(user.user_fid)}
                        </td>
                        <td className="px-6 py-2">
                            {convertUserToUserName(user.user_fid)}
                        </td>

                        <td className="px-6 py-2">
                            {menuCheck ? (
                                <ActionBtnUser
                                    roleId={user.role_user_id}
                                    data={user}
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
                ))}

                <tr className="">
                    <th scope="row" className="px-6 pt-2">

                        {menuCheck ? (
                            <button onClick={() => setIsBoxOpen(true)}>
                                <svg xmlns="http://www.w3.org/2000/svg"

                                    fill='none'
                                    viewBox='0 0 24 24'
                                    strokeWidth='1.5'
                                    stroke='currentColor'
                                    className='w-[18px] h-[18px] text-blue-500'
                                >
                                    <g fill="none" fillRule="evenodd" stroke="#200E32" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" transform="translate(2 2)"><line x1="10" x2="10" y1="6.327" y2="13.654" /><line x1="13.667" x2="6.333" y1="9.99" y2="9.99" /><path d="M14.6857143,0 L5.31428571,0 C2.04761905,0 0,2.31208373 0,5.58515699 L0,14.414843 C0,17.6879163 2.03809524,20 5.31428571,20 L14.6857143,20 C17.9619048,20 20,17.6879163 20,14.414843 L20,5.58515699 C20,2.31208373 17.9619048,0 14.6857143,0 Z" /></g></svg>
                            </button>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-400 icon icon-tabler icon-tabler-square-letter-x" width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z"></path>
                                <path d="M10 8l4 8"></path>
                                <path d="M10 16l4 -8"></path>
                            </svg>
                        )}
                        <AddUserRole
                            isBoxOpen={isBoxOpen}
                            setIsBoxOpen={setIsBoxOpen}
                            data={data}
                            role_user={role_user}
                            roleId={roleId}
                            state={state}
                            tableReload={tableReload}
                            roleName={roleName}
                        />

                    </th>
                </tr>
            </tbody>
        </table>

    )
}


export default Users