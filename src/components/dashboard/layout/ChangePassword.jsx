import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import axios from "axios";
import { getCookie } from 'cookies-next';


export default function ChangePassword({ ischangepassopen, setischangepassopen }) {
  const [loading, setLoading] = useState(false);
  const [oldpassword, setoldpassword] = useState("");
  const [newpassword, setnewpassword] = useState("");
  const [retypepassword, setretypepassword] = useState("");

  // error handler
  const [errorOldPassword, setErrorOldPassword] = useState(false)
  const [errorNewPassword, setErrorNewPassword] = useState(false)
  const [errorRetypePassword, setErrorRetypePassword] = useState(false)

  const clearFields = () => {
    setischangepassopen(false);
    setoldpassword("");
    setnewpassword("");
    setretypepassword("");
    setErrorOldPassword(false);
    setErrorNewPassword(false);
    setErrorRetypePassword(false);
  };

  const insertData = async () => {
    try {
      setLoading(true);
      setErrorOldPassword(oldpassword == "");
      setErrorNewPassword(newpassword == "");
      setErrorRetypePassword(retypepassword == "" || newpassword !== retypepassword);

      if (oldpassword !== "" && newpassword !== "" && retypepassword !== "" && newpassword === retypepassword) {
        const data = {
          token: getCookie('token'),
          oldPassword: oldpassword,
          newPassword: newpassword
        };

        const res = await axios.post(process.env.API_SERVER + "users/change_password", data);

        if (res.status === 201) {
          setErrorOldPassword(true)
        }
        else if (res.status === 200) {
          clearFields()
        }

        setLoading(false);
      } else {
        setLoading(false);
      }

    } catch (error) {
      setLoading(false);
      console.log(error.error_description || error.message);
    }
  };

  return (
    <Transition show={ischangepassopen} as={Fragment}>
      <Dialog
        open={ischangepassopen}
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
                Change Password
              </div>
              <div className='px-5 pt-5 pb-6'>
                <div className='space-y-4 text-sm'>

                <div className='flex gap-3 h-0'>
                    <div className='flex-1'>
                      <input
                            
                        placeholder='username'
                        className={errorOldPassword ? 'px-5 h-[0px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' :
                          'px-5 h-[0px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'}
                      />
                    </div>
                  </div>

                  <div className='flex gap-3'>
                    <div className='flex-1'>
                      <input
                        type='password'
                        value={oldpassword}
                        onChange={(e) => {
                          setoldpassword(e.target.value)
                          setErrorOldPassword(false);
                        }}
                        placeholder='Old Password'
                        className={errorOldPassword ? 'px-5 h-[50px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' :
                          'px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'}
                      />
                    </div>
                  </div>
                  <div className='flex gap-3'>
                    <div className='flex-1'>
                      <input
                        type='password'
                        value={newpassword}
                        onChange={(e) => {
                          setnewpassword(e.target.value)
                          setErrorNewPassword(false)
                        }}
                        placeholder='New Password'
                        className={errorNewPassword ? 'px-5 h-[50px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' :
                          'px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'}
                      />

                    </div>
                    <div className='flex-1'>
                      <input
                        type='password'
                        value={retypepassword}
                        onChange={(e) => {
                          setretypepassword(e.target.value)
                          setErrorRetypePassword(false)
                        }}
                        placeholder='Retype New Password'
                        className={errorRetypePassword ? 'px-5 h-[50px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' :
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
                    {loading ? "Changing Password..." : " Change Password"}
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
