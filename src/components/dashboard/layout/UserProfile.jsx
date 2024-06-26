import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from 'cookies-next';
import axiosInstance from "@/auth_services/instance";

export default function UserProfile({ isprofileopen, setisprofileopen, user, fetchUserData }) {

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(user?.profile_image)
  const [username, setUsername] = useState(user?.user_name);
  const [email, setEmail] = useState(user?.email);
  const [name, setname] = useState(user?.name);

  // error handler
  const [errorName, setErrorName] = useState(false)
  const [errorUserName, setErrorUserName] = useState(false)


  const clearFields = () => {
    setisprofileopen(false);
    setUsername(user?.user_name);
    setEmail(user?.email);
    setname(user?.name);
    setFile(user?.profile_image)
    setErrorName(false);
    setErrorUserName(false);
  };

  const insertData = async () => {
    try {
      setLoading(true);
      setErrorName(name == "");
      setErrorUserName(username == "");

      if (name !== "" && username !== "") {
        const data = {
          user_name: username,
          name: name,
          profile_image: file || user?.profile_image
        }
        const res = await axiosInstance.put(process.env.API_SERVER + "users/fetch_user_data/" + getCookie('token'), data);
        if (res.status === 201) {
          setisprofileopen(false);
          fetchUserData()
        } else {
          clearFields()
        }
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error.error_description || error.message);
    }
  };

  function handleChange(e) {
    let reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = function () {
      setFile(reader.result);
    };
    reader.onerror = function (error) {
      setFile("")
    };
  }

  return (
    <Transition show={isprofileopen} as={Fragment}>
      <Dialog
        open={isprofileopen}
        onClose={() => { clearFields() }}
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
                Profile
              </div>
              <div className='px-5 pt-5 pb-6'>
                <div className='space-y-4 text-sm'>
                  <div className='flex gap-3'>
                    <div className='flex-1'>
                      <span>
                        {file == null ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-12 h-12"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                              clipRule="evenodd"
                            />
                          </svg>

                        ) : (
                          <img src={file} className="w-16 h-16 rounded-full object-contain border-[#0ca8f8] border bg-white" />
                        )}
                      </span>
                    </div>
                    <div className='flex-1'>

                    </div>
                  </div>
                  <div className='flex gap-3'>
                    <div className='flex-1'>
                      <input
                        type='file'
                        // value={file}
                        onChange={handleChange}
                        placeholder='File'
                        className='px-5 py-3 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'
                      />

                    </div>
                    <div className='flex-1'>
                      <input
                        type='text'
                        disabled={true}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='Email'
                        className='px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'
                      />
                    </div>
                  </div>
                  <div className='flex gap-3'>
                    <div className='flex-1'>
                      <input
                        type='text'
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value)
                          setErrorUserName(false)
                        }}
                        placeholder='Username'
                        className={errorUserName ? 'px-5 h-[50px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' :
                          'px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'}
                      />


                    </div>
                    <div className='flex-1'>
                      <input
                        type='text'
                        value={name}
                        onChange={(e) => {
                          setname(e.target.value)
                          setErrorName(false)
                        }}
                        placeholder='Full Name'
                        className={errorName ? 'px-5 h-[50px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' :
                          'px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'}
                      />
                    </div>
                  </div>

                </div>
                <div className='mt-5 flex gap-x-4 justify-end'>
                  <button
                    className='px-6 py-2.5 min-w-[140px] bg-[#0CA8F8] text-white font-semibold rounded-md'
                    disabled={loading ? true : false}
                    onClick={insertData}
                  >
                    {loading ? "Updating..." : " Update Profile"}
                  </button>
                  <button
                    onClick={clearFields}
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
