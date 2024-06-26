import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/auth_services/instance";
import StatusDropDown from "./StatusDropDown";

const status_data = [
  { id: 1, status: 'Active' },
  { id: 2, status: 'Inactive' },
]

const incorporated_in_data = [
  { id: 'Province', name: 'Province' },
  { id: 'Federal', name: 'Federal' },
  { id: 'N/A', name: 'N/A' },
]

const menuItems = [

  { id: 101, menu: 'My Production', check_status: false },
  { id: 1, menu: 'Production', check_status: false },
  { id: 2, menu: 'Feature', check_status: false },
  { id: 3, menu: 'Series', check_status: false },

  { id: 102, menu: 'Menu', check_status: false },
  { id: 5, menu: 'Banking Information', check_status: false },
  { id: 6, menu: 'Budget Information', check_status: false },
  { id: 7, menu: 'Location Information', check_status: false },
  { id: 8, menu: 'Production Schedule', check_status: false },
  { id: 9, menu: 'Tax Credit Expense', check_status: false },

  { id: 103, menu: 'Admin', check_status: false },
  { id: 10, menu: 'Nature Of Expense', check_status: false },
  { id: 11, menu: 'Expense Title', check_status: false },
  { id: 12, menu: 'Tax Credit Application', check_status: false },
  { id: 13, menu: 'Genre List', check_status: false },
  { id: 14, menu: 'Region', check_status: false },
  { id: 15, menu: 'Role', check_status: false },
  { id: 16, menu: 'User', check_status: false },
  { id: 17, menu: 'Vendor List', check_status: false },
  { id: 18, menu: 'Vendor Type', check_status: false },
  { id: 19, menu: 'Country', check_status: false },
  { id: 20, menu: 'Province', check_status: false },
  { id: 21, menu: 'City', check_status: false },

]

export default function AddData({ isOpen, setIsOpen, state, tableReload }) {
  const { distributorLst, genreLst, provinceLst, countryLst } = state;

  const [org_fid, setorg_fid] = useState(1);
  const [modified_by, setmodified_by] = useState(1);
  const [role, setrole] = useState("");

  // foreign key fields
  const [status_fid, setstatus_fid] = useState("");



  const router = useRouter();

  // error handler
  const [errorrole, seterrorrole] = useState("")
  const [errorstatus, seterrorstatus] = useState("")


  const insertData = async () => {

    // Validation code 
    if (role == "") {
      seterrorrole("Role name required!")
    } else {
      seterrorrole("")
    }

    if (status_fid == "") {
      seterrorstatus("Status required!")
    } else {
      seterrorstatus("")
    }



    if (role != "") {    // && errorgenre =="" && errordistributor=="") {

      const role_changecase = role.charAt(0).toUpperCase() + role.slice(1)
      const data = {
        modified_by,
        organization_fid: org_fid,
        role_name: role_changecase,
        is_active: status_fid,
      };


      try {
        const res = await axiosInstance.post(process.env.API_SERVER + "role", data);
        setIsOpen(false);
        setorg_fid(1);
        setmodified_by(1);
        setrole("");
        setstatus_fid("");


      } catch (error) {
        console.log(error);
      }
      tableReload();
      //router.refresh();
    }
  }

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
              <div className='p-6 bg-blue-500 text-white text-xl font-semibold'>
                Add Role
              </div>



              <div className='p-5'>
                <div className='space-y-3 text-sm'>

                  <div className="grid grid-cols-2 gap-2 ">
                    <div>


                      <input
                        type='text'
                        value={role}
                        onChange={(e) => { setrole(e.target.value); seterrorrole("") }}
                        placeholder='Role Name'
                        className={errorrole != "" ? 'px-5 h-[45px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500 mb-4' :
                          'px-5 h-[45px] w-full bg-gray-200 rounded-md outline-none placeholder:text-gray-500 mb-4'}
                      />
                      <br />
                      <StatusDropDown
                        state={{ status_fid, setstatus_fid, errorstatus }}
                        list={status_data}
                      />
                      <br />
                      {/* <h2 className='mb-2 font-medium text-lg text-[#0CA8F8] px-2'>
                        Allow access to selected menu &gt;
                      </h2> */}
                      {/* <p className="w-full text-right text-gray-500 pt-10">Assign Menus -&gt;</p> */}
                    </div>
                    <div>

                      <div className='flex-1'>
                        <h2 className='mb-2 font-medium text-lg text-[#0CA8F8] px-2'>
                          Authorize to access:
                        </h2>
                        <div className='border h-[200px] overflow-y-auto rounded-lg'>
                          {menuItems.length ? (
                            <>
                              {/* <div className='flex items-center gap-2.5 py-1 px-2.5 border-b border-gray-200/75'>
                              <input
                                className='h-4 w-4 cursor-pointer'
                                type='checkbox'
                                onClick={() => handleSelectAll("left")}
                              />
                              <span className='py-1 text-gray-500'>
                                Total:{" "}
                                <span className='font-semibold text-gray-700'>
                                  {menuItems.length}
                                </span>
                              </span>
                            </div> */}
                              {menuItems.map((data, index) => {
                                return (
                                  <div
                                    className='flex items-center gap-2.5 py-[6px] px-2.5'
                                    key={data.id}
                                  >
                                    <input
                                      className={`h-4 w-4 cursor-pointer ${data.id > 100 && 'hidden'}`}
                                      // disabled={fields(data.city_id)}
                                      type='checkbox'
                                      onChange={(e) => {
                                        e.target.checked ? menuItems[data.id].check_status = true : menuItems[data.id].check_status = false
                                        //menuItems[data.id].check_status ? menuItems[data.id].check_status = false : menuItems[data.id].check_status = true
                                        console.log(menuItems)
                                        //handelClick("left", e, data)    
                                      }
                                      }
                                    //checked={isLeftCheck.includes(data)}
                                    />
                                    <span className={`text-gray-600 ${data.id > 100 && 'font-bold text-stone-500'}`}>
                                      {data.menu}
                                    </span>
                                  </div>
                                );
                              })}
                            </>
                          ) : (
                            <p className='px-4 py-0.5'>No Cities Found...</p>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>




                </div>
                <div className='mt-4 flex gap-x-4 justify-end'>
                  <button
                    className='px-6 py-2.5 bg-blue-500 text-white rounded-md'
                    onClick={insertData}
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
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
