import { Dialog, Transition } from "@headlessui/react";
import axiosInstance from "@/auth_services/instance";
import { Fragment, useEffect, useState } from "react";
import IsActiveDropdown from "./IsActiveDropdown";
import IsDeletedDropdown from "./IsDeleteDropdown";
var CryptoJS = require("crypto-js");

export default function UpdateData({ isOpen, setIsOpen, data, state, fn }) {
  // Decrypt password
  const convertPassword = (pass) => {
    var bytes = CryptoJS.AES.decrypt(pass, process.env.NEXT_PUBLIC_SECRET_KEY);
    var convertedPass = bytes.toString(CryptoJS.enc.Utf8);
    return convertedPass;
  };

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(data.user_name);
  const [name, setName] = useState(data.name);
  const [email, setEmail] = useState(data.email);
  const [password, setPassword] = useState(convertPassword(data.password));
  const [errorMessage, setErrorMessage] = useState("")
  // const [isActive, setIsActive] = useState(data.is_active);
  // const [isDeleted, setIsDeleted] = useState(data.is_deleted);
  // const [meta, setMeta] = useState(data.metadata);
  // const [updatedBy, setUpdatedBy] = useState(data.updated_by);

  useEffect(() => {
    setUsername(data.user_name);
    setName(data.name);
    setEmail(data.email);
    setPassword(convertPassword(data.password));
    // setIsActive(data.is_active ? "true" : "false");
    // setIsDeleted(data.is_deleted ? "true" : "false");
    // setMeta(data.metadata);
    // setUpdatedBy(data.updated_by);
  }, [isOpen, data]);

  const { tableReload } = fn;

  // const isActiveList = [
  //   { name: "Active", status: "true" },
  //   { name: "Inactive", status: "false" },
  // ];

  // Convert isActive to status
  // function convertIsActive() {
  //   const status = isActiveList.find((item) => item.status == isActive);
  //   return status?.name;
  // }
  // // Convert isDeleted to status
  // function convertIsDeleted() {
  //   const status = isActiveList.find((item) => item.status == isDeleted);
  //   return status?.name;
  // }

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  const updateData = async (id) => {
    try {
      setLoading(true);

      if (username == "" || email == "" || name == "" || password == "" || !isValidEmail(email)) {
        setErrorMessage("all fields required");
        setLoading(false);
      } else {
        const res = await axiosInstance.put(process.env.API_SERVER + "users/" + id, {
          user_name: username,
          name,
          email,
          password,
          // is_active: isActive,
          // is_deleted: isDeleted,
          // updated_by: updatedBy,
          // metadata: meta,
        });

        if (res.status !== 200) throw error;

        tableReload();

        setIsOpen(false);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error.error_description || error.message);
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        open={isOpen}
        onClose={() => {
          setIsOpen(false)
          setErrorMessage("")
        }}
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
            <Dialog.Panel className='mx-auto w-[600px] rounded-[15px] bg-white overflow-hidden'>
              <div className='p-6 bg-[#0CA8F8] text-white text-xl font-semibold'>
                Update User
              </div>
              <div className='p-5'>
                <div className='space-y-4 text-sm'>
                  <div className='flex gap-3'>
                    <div className='flex-1'>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Username</label>

                      <input
                        type='text'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder='Username'
                        className={(errorMessage && username === "") ? 'px-5 h-[50px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' : 'px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'}
                      />
                    </div>
                    <div className='flex-1'>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Name</label>

                      <input
                        type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='Name'
                        className={(errorMessage && name === "") ? 'px-5 h-[50px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' : 'px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'}
                      />
                    </div>
                  </div>
                  <div className='flex gap-3'>
                    <div className='flex-1'>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Email</label>

                      <input
                        type='text'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='Email'
                        className={(errorMessage && !isValidEmail(email)) ? 'px-5 h-[50px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' : 'px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'}
                      />
                    </div>
                    <div className='flex-1'>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Password</label>

                      <input
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='Password'
                        className={(errorMessage && password === "") ? 'px-5 h-[50px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' : 'px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'}
                      />
                    </div>
                  </div>
                  {/* <div className='flex gap-3'>

                    <div className='flex-1'>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Is Active</label>
                      <IsActiveDropdown
                        list={isActiveList}
                        state={{ isActive, setIsActive }}
                        convertIsActive={convertIsActive}
                      />
                    </div>
                    <div className='flex-1'>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Description</label>

                      <input
                        type='text'
                        value={meta}
                        onChange={(e) => setMeta(e.target.value)}
                        placeholder='Meta Data'
                        className='px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'
                      />
                    </div>
                  </div> */}
                  {/* <div className='flex gap-3'>
                    <div className='flex-1'>
                      <label  className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Is Deleted</label>
                      <IsDeletedDropdown
                        list={isActiveList}
                        state={{ isDeleted, setIsDeleted }}
                        convertIsDeleted={convertIsDeleted}
                      />
                    </div>
                    <div className='flex-1'>
                      <label  className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Updated By</label>

                      <input
                        type='text'
                        value={updatedBy}
                        onChange={(e) => setUpdatedBy(e.target.value)}
                        placeholder='Updated By'
                        className='px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'
                      />
                    </div>

                  </div> */}
                </div>
                <div className='mt-5 flex gap-x-4 justify-end'>
                  <button
                    className='px-6 py-2.5 min-w-[140px] bg-[#0CA8F8] text-white font-semibold rounded-md'
                    onClick={() => updateData(data.user_id)}
                  >
                    {loading ? "Updating..." : "Update"}
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      setErrorMessage("")
                    }}
                    className='px-6 py-2.5 bg-[#DDE0E2] min-w-[140px] text-gray-500 font-semibold rounded-md'
                  >
                    Discard
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
