import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import axiosInstance from "@/auth_services/instance";
import IsActiveDropdown from "./IsActiveDropdown";
// import IsDeletedDropdown from "./IsDeleteDropdown";

export default function AddData({ isOpen, setIsOpen, fn }) {
  const { tableReload } = fn;

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [isActive, setIsActive] = useState(true);
  // const [isDeleted, setIsDeleted] = useState("");
  // const [meta, setMeta] = useState("");
  // const [updatedBy, setUpdatedBy] = useState(1);

  const [errorlogin, seterrorlogin] = useState("");
  const [errorMessage, setErrorMessage] = useState("")

  const clearFields = () => {
    setIsOpen(false);
    setLoading(false);
    setUsername("");
    setName("");
    setEmail("");
    setPassword("");
    seterrorlogin("");
    setErrorMessage("");
    // setIsActive(true);
    // setIsDeleted("");
    // setMeta("");
    // setUpdatedBy("");
  };

  const isActiveList = [
    { name: "Active", status: true },
    { name: "Inactive", status: false },
  ];

  // // Convert isActive to status
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

  const insertData = async () => {
    try {
      setLoading(true);
      if (username == "" || email == "" || name == "" || password == "" || !isValidEmail(email)) {
        setErrorMessage("all fields required");
        setLoading(false);
      } else {
        const data = {
          user_name: username,
          name: name,
          email: email,
          password: password,
          // is_active: isActive,
          // is_deleted: isDeleted,
          // updated_by: updatedBy,
          // metadata: meta,
        };

        const res1 = await axiosInstance.post(process.env.API_SERVER + "users/signup/checkuser", { email: email });
        console.log(res1.status)
        if (res1.status === 201) {

          const res = await axiosInstance.post(process.env.API_SERVER + "users", data);
          if (res.status !== 200) throw error;
          tableReload();
          clearFields();

        } else {
          seterrorlogin("User already exists!")
          setLoading(false);
        }
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
        onClose={() => setIsOpen(false)}
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
                Add User
              </div>
              <div className='px-5 pt-5 pb-6'>
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
                    </div >
                    <div className='flex-1'>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Password</label>

                      <input
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='Password'
                        className={(errorMessage && password === "") ? 'px-5 h-[50px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' : 'px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'}
                        autoComplete="new-password"
                      />
                    </div >
                  </div >
                  {/* <div className='flex gap-3'>
                    <div className='flex-1'>
                    <label  className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Is Active</label>
                  
                      <IsActiveDropdown
                        list={isActiveList}
                        state={{ isActive, setIsActive }}
                        convertIsActive={convertIsActive}
                      />
                    </div>
                    <div className='flex-1'>
                    <label  className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Description</label>
                  
                      <input
                        type='text'
                        value={meta}
                        onChange={(e) => setMeta(e.target.value)}
                        placeholder='Meta Desc (optional)'
                        className='px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'
                      />
                    </div>


                  </div> */}




                </div >
                <div className='mt-5 flex gap-x-4 justify-end'>
                  <span className="text-red-500">{errorlogin}</span>
                  <button
                    className='px-6 py-2.5 min-w-[140px] bg-[#0CA8F8] text-white font-semibold rounded-md'
                    disabled={loading ? true : false}
                    onClick={insertData}
                  >
                    {loading ? "Adding..." : " Add"}
                  </button>
                  <button
                    onClick={clearFields}
                    className='px-6 py-2.5 bg-[#DDE0E2] min-w-[140px] text-gray-500 font-semibold rounded-md'
                  >
                    Discard
                  </button>
                </div>
              </div >
            </Dialog.Panel >
          </Transition.Child >
        </div >
      </Dialog >
    </Transition >
  );
}
