import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";


export default function Settings({ issettingopen, setissettingopen, fn }) {
 // const { tableReload } = fn;

  const [loading, setLoading] = useState(false);
  const [filename, setfilename] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState("");
  const [isDeleted, setIsDeleted] = useState("");
  const [meta, setMeta] = useState("");
  const [updatedBy, setUpdatedBy] = useState("");

  const clearFields = () => {
     setissettingopen(false);
    // setLoading(false);
    // setUsername("");
    // setName("");
    // setEmail("");

    // setPassword("");
    // setIsActive("");
    // setIsDeleted("");
    // setMeta("");
    // setUpdatedBy("");
  };

  const isActiveList = [
    { name: "Active", status: "true" },
    { name: "Inactive", status: "false" },
  ];

  // Convert isActive to status
  function convertIsActive() {
    const status = isActiveList.find((item) => item.status == isActive);
    return status?.name;
  }
  // Convert isDeleted to status
  function convertIsDeleted() {
    const status = isActiveList.find((item) => item.status == isDeleted);
    return status?.name;
  }

  const insertData = async () => {
    // try {
    //   setLoading(true);

    //   const data = {
    //     user_name: username,
    //     name: name,
    //     email: email,
    //     password: password,
    //     is_Active: isActive,
    //     is_deleted: isDeleted,
    //     updated_by: updatedBy,
    //     metadata: meta,
    //   };

    //   const res = await axiosInstance.post(process.env.API_SERVER + "users", data);

    //   if (res.status !== 200) throw error;

    //   tableReload();

    //   clearFields();
    // } catch (error) {
    //   setLoading(false);
    //   console.log(error.error_description || error.message);
    // }
  };

  return (
    <Transition show={issettingopen} as={Fragment}>
      <Dialog
        open={issettingopen}
        onClose={() => setissettingopen(false)}
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
                Settings
              </div>
              <div className='px-5 pt-5 pb-6'>
                <div className='space-y-4 text-sm'>
                
                
                  <div className='flex gap-3'>
                    <div className='flex-1'>
                    <input
                        type='text'
                        value={firstname}
                        onChange={(e) => setfirstname(e.target.value)}
                        placeholder='Is Active'
                        className='px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'
                      />
                     
                    </div>
                    <div className='flex-1'>
                    <input
                        type='text'
                        value={lastname}
                        onChange={(e) => setlastname(e.target.value)}
                        placeholder='Is Deleted'
                        className='px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'
                      />
                    </div>
                  </div>
                  <div className='flex gap-3'>
                  
                    <div className='flex-1'>
                    <input
                        type='text'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='Verified By'
                        className='px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'
                      />
                    </div>
                    <div className='flex-1'>
                      <input
                        type='text'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder='Mobile'
                        className='px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'
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
                    {loading ? "Updating..." : " Update Setting"}
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
