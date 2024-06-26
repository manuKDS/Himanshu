import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/auth_services/instance";
import AddUserDropDown from "./AddUserDropDown";
import StatusDropdown from "./StatusDropDown";


const status_data = [
  { id: 1, status: 'Active' },
  { id: 2, status: 'Inactive' },
]


export default function AddUserRole({ isBoxOpen, setIsBoxOpen, state, role_user, tableReload, roleName, roleId }) {
  const { roles, userLst, setuserLst, role_userLst } = state;

  const usersTmp = []
  // console.log("Role Id ",roleId)
  // console.log(userLst)
  // console.log("role_user ", role_user)
  const users = userLst.map((item) => {
    let obj = role_user.find(o => (o.user_fid === item.user_id && o.role_fid === roleId))
    // console.log("Obj ",obj)
    if (obj == undefined || obj == null) {
      usersTmp.push(item)
    }
  })
  // console.log("usersTmp ",usersTmp)

  const [userlist, setuserlist] = useState(usersTmp)

  //  console.log("Userlist ",userlist)
  // console.log("role_user ", role_user)

  const [org_fid, setorg_fid] = useState(1);
  const [modified_by, setmodified_by] = useState(1);
  const [role, setrole] = useState("");

  // foreign key fields
  const [user_fid, setuser_fid] = useState("");
  const [status_fid, setstatus_fid] = useState("");
  const router = useRouter();

  // error handler
  const [errorrole, seterrorrole] = useState("")
  const [erroruser, seterroruser] = useState("")
  const [errorstatus, seterrorstatus] = useState("")

  const [button_status, setbutton_status] = useState(true)

  const insertData = async () => {
    setbutton_status(false)
    // Validation code 
    if (user_fid == "") {
      seterroruser("User required!")
    } else {
      seterroruser("")
    }

    if (status_fid == "") {
      seterrorstatus("Status required!")
    } else {
      seterrorstatus("")
    }
    // console.log("data - ", roleId, user_fid)
    if (erroruser == "" && errorstatus == "") {    // && errorgenre =="" && errordistributor=="") {

      const data = {
        modified_by,
        role_fid: roleId,
        user_fid: user_fid,
        is_active: true,
      };

      var exist = 0;
      try {
        const res = await axiosInstance.post(process.env.API_SERVER + "role_user", data);
        setorg_fid(1);
        setmodified_by(1);
        setrole("");
        setuser_fid("");
      } catch (error) {
        console.log(error);
      }

      tableReload();
      setIsBoxOpen(false);

      //router.refresh();
    }
    setbutton_status(true)
  }

  return (
    <Transition show={isBoxOpen} as={Fragment}>
      <Dialog
        open={isBoxOpen}
        onClose={() => setIsBoxOpen(false)}
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
              <div className='p-6 bg-blue-500 text-white text-xl font-semibold'>
                Assign Role
              </div>

              <div className='p-5'>
                <div className='space-y-3 text-sm'>

                  <div className="grid grid-cols-1 gap-2 ">
                    <div>

                      <AddUserDropDown
                        state={{ user_fid, setuser_fid, erroruser }}
                        list={usersTmp}
                      />
                      <br />
                      <input
                        type='text'
                        value={roleName}
                        // onChange={(e) => { setrole(e.target.value); seterrorrole("") }}
                        placeholder='Role Name'
                        className={errorrole != "" ? 'px-5 h-[45px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500 mb-4' :
                          'px-5 h-[45px] w-full bg-gray-200 rounded-md outline-none placeholder:text-gray-500 mb-4'}
                      />
                      <br />

                      <StatusDropdown
                        state={{ status_fid, setstatus_fid, errorstatus }}
                        list={status_data}
                      />                  
                    </div>                
                  </div>



                </div>
                <div className='mt-4 flex gap-x-4 justify-end'>
                  {button_status ? (
                    <button className='px-6 py-2.5 bg-blue-500 text-white rounded-md'
                      onClick={insertData}
                    >
                      Submit
                    </button>
                  ) : (
                    <button className='px-6 py-2.5 bg-blue-500 text-white rounded-md'                     >
                      Submit..
                    </button>
                  )
                  }
                  <button
                    onClick={() => setIsBoxOpen(false)}
                    className='px-6 py-2.5 bg-gray-400 text-white rounded-md'
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
