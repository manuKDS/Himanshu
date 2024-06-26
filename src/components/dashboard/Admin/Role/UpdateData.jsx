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

  { id: 101, menu: 'Production' },
  { id: 1, menu: 'Production' },
  { id: 2, menu: 'Feature' },
  { id: 3, menu: 'Series' },

  { id: 102, menu: 'Menu' },
  { id: 5, menu: 'Banking Information' },
  { id: 6, menu: 'Budget Information' },
  { id: 7, menu: 'Location Information' },
  { id: 8, menu: 'Production Schedule' },
  { id: 9, menu: 'Tax Credit Expense' },

  { id: 103, menu: 'Admin' },
  { id: 10, menu: 'Nature Od Expense' },
  { id: 11, menu: 'Expense Title' },
  { id: 12, menu: 'Tax Credit Application' },
  { id: 13, menu: 'Genre List' },
  { id: 14, menu: 'Region' },
  { id: 15, menu: 'Role' },
  { id: 16, menu: 'User' },

  { id: 104, menu: 'Settings' },
  { id: 17, menu: 'Vendor List' },
  { id: 18, menu: 'Vendor Type' },
  { id: 19, menu: 'Country' },
  { id: 20, menu: 'Province' },
  { id: 21, menu: 'City' },

]

export default function UpdateData({ isOpen, setIsOpen, roleId, data, menuList, tableReload, state }) {
  // const { distributorLst, genreLst, provinceLst, countryLst } = state;

  const [organization_fid, setorganization_fid] = useState(data.organization_fid);
  const [modified_by, setmodified_by] = useState(data.modified_by);
  const [role, setrole] = useState(data.role_name);
  const [status_fid, setstatus_fid] = useState(data.is_active ? 1 : 2);
  const [menuItems, setMenuItems] = useState([]);
  const [isMenuAccessChange, setIsMenuAccessChange] = useState(false);
  //console.log(data.role_name)
  // error handler
  const [errorrole, seterrorrole] = useState("")
  const [errorstatus, seterrorstatus] = useState("")
  const [errorMenu, seterrorMenu] = useState("");

  // Loder state
  const [insertLoading, setInsertLoading] = useState(false);

  const router = useRouter();

  // useEffect(() => {
  //   setrole(data.role);
  //   setstatus_fid(data.status ? 1 : 2);
  // }, [data]);
  useEffect(() => {
    fetchMenuData()
  }, [data])

  const fetchMenuData = async () => {
    try {
      const menuArray = menuList.map((record) => {
        const isAccessMenu = data.accessedMenu.find((menuRole) => menuRole.menu_fid === record.menu_id)
        return { ...record, check_status: isAccessMenu ? true : false, isEditable: isAccessMenu ? isAccessMenu.is_editable : false, menu_name: record.menu_name.trim() }
      })
      setMenuItems(menuArray);
    } catch (error) {
      console.error(error.message);
    }
  }
  const handleMenuAccessChange = (value, menuId) => {
    !isMenuAccessChange && setIsMenuAccessChange(true)
    const dataIndex = menuItems.findIndex((menu) => menu.menu_id === menuId);
    const dataArray = JSON.parse(
      JSON.stringify(menuItems)
    );
    if (value && errorMenu !== "") {
      seterrorMenu("")
    }
    dataArray[dataIndex].check_status = value
    setMenuItems(dataArray);
  }

  const handleMenuIsEditableChange = (menuId, value) => {
    !isMenuAccessChange && setIsMenuAccessChange(true)
    const dataIndex = menuItems.findIndex((menu) => menu.menu_id === menuId);
    const dataArray = JSON.parse(
      JSON.stringify(menuItems)
    );
    dataArray[dataIndex].isEditable = value
    setMenuItems(dataArray);
  }

  const updateData = async () => {
    // Validation code 
    seterrorrole(role == "" ? "Role name required!" : "");
    seterrorstatus(status_fid == "" ? "Status required!" : "");

    const accessedMenus = menuItems.filter(menu => menu.check_status);
    seterrorMenu(accessedMenus.length > 0 ? "" : "(At least One Menu)")

    if (role != "" && status_fid !== "" && accessedMenus.length > 0) {

      const role_changecase = role.charAt(0).toUpperCase() + role.slice(1)
      const data = {
        modified_by,
        organization_fid,
        role_name: role_changecase,
        is_active: (status_fid == 1 ? true : false),
      };

      try {
        const res = await axiosInstance.put(process.env.API_SERVER + "role/" + roleId, data);
        if (isMenuAccessChange) {
          const menuRoleBody = {
            role_fid: roleId,
            accessedMenus: accessedMenus,
            isMenuAccessEdited: true
          }
          await axiosInstance.post(process.env.API_SERVER + "menu_role", menuRoleBody);
        }

      } catch (error) {
        console.log(error);
      }
      tableReload();
      setIsOpen(false);
      //router.refresh();
    }
  }

  const handleDiscard = () => {
    setrole(data.role_name);
    setstatus_fid(data.is_active ? 1 : 2);
    fetchMenuData()
    setIsOpen(false);
  }


  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        open={isOpen}
        onClose={() => { handleDiscard() }}
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
            <Dialog.Panel className='mx-auto w-[800px] rounded-[15px] bg-white overflow-hidden'>
              <div className='p-6 bg-blue-500 text-white text-xl font-semibold'>
                Update Role
                {/* - {data.role_name} */}
              </div>
              <div className='p-5'>


                <div className='space-y-3 text-sm'>

                  <div className="grid grid-cols-2 gap-2 ">
                    <div>
                      <label  className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Role Name</label>
                      <input
                        type='text'
                        value={role}
                        onChange={(e) => { setrole(e.target.value); seterrorrole("") }}
                        placeholder='Role Name'
                        className={errorrole != "" ? 'px-5 h-[45px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500 mb-4' :
                          'px-5 h-[45px] w-full bg-gray-200 rounded-md outline-none placeholder:text-gray-500 mb-4'}
                      />
                      <br />
                      <label  className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Status</label>
                      <StatusDropDown
                        state={{ status_fid, setstatus_fid, errorstatus }}
                        list={status_data}
                      />
                      <br />

                    </div>
                    <div>

                      <div className='flex-1'>
                        <h2 className='mb-2 font-medium text-lg text-[#0CA8F8] px-2'>
                          Authorize to access: <span className="text-[red]">{errorMenu}</span>
                        </h2>
                        <div className='border h-[200px] overflow-y-auto rounded-lg'>
                          {menuItems.length > 0 ? (
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
                              {menuItems.filter((record) => record.menu_id === record.menu).map((data, index) => {
                                return (
                                  <div key={data.menu_id}>
                                    <div
                                      className='flex items-center gap-1.5 py-[6px] px-2.5'
                                    >
                                      <input
                                        className={`h-4 w-4 cursor-pointer ${data.menu_link === null && "hidden"
                                          }`}
                                        type='checkbox'
                                        onChange={(e) => {
                                          handleMenuAccessChange(e.target.checked, data.menu_id);
                                        }}
                                        checked={data.check_status}
                                      />
                                      <span
                                        className={`text-gray-600 font-bold text-stone-500`}
                                      >
                                        {data.menu_name}
                                      </span>
                                      <div
                                        className={`flex items-center gap-0.5 ${!data.check_status && "hidden"
                                          }`}
                                      >
                                        <span className={`text-gray-600`}>-</span>
                                        <label className="relative inline-flex items-center mr-1 cursor-pointer">
                                          <input
                                            type="checkbox"
                                            onChange={e => (handleMenuIsEditableChange(data.menu_id, e.target.checked))}
                                            checked={data.isEditable}
                                            value=""
                                            className="sr-only peer"
                                          />
                                          <div className="w-9 h-5  bg-gray-400 rounded-full peer dark:bg-gray-700  dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                                        </label>
                                        <span className={`text-gray-600`}>
                                          isEditable
                                        </span>
                                      </div>
                                    </div>
                                    {menuItems.filter((record) => data.menu_id === record.menu && record.menu_id !== record.menu).map((subMenu) => {
                                      return (
                                        <div
                                          className='flex items-center gap-1.5 py-[6px] px-2.5'
                                          key={subMenu.menu_id}
                                        >
                                          <input
                                            className={`h-4 w-4 cursor-pointer`}
                                            type='checkbox'
                                            onChange={(e) => {
                                              handleMenuAccessChange(e.target.checked, subMenu.menu_id);
                                            }}
                                            checked={subMenu.check_status}
                                          />
                                          <span
                                            className={`text-gray-600`}
                                          >
                                            {subMenu.menu_name}
                                          </span>
                                          <div
                                            className={`flex items-center gap-0.5 ${!subMenu.check_status && "hidden"
                                              }`}
                                          >
                                            <span className={`text-gray-600`}>-</span>
                                            <label className="relative inline-flex items-center mr-1 cursor-pointer">
                                              <input
                                                type="checkbox"
                                                onChange={e => (handleMenuIsEditableChange(subMenu.menu_id, e.target.checked))}
                                                checked={subMenu.isEditable}
                                                value=""
                                                className="sr-only peer"
                                              />
                                              <div className="w-9 h-5  bg-gray-400 rounded-full peer dark:bg-gray-700  dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                                            </label>
                                            <span className={`text-gray-600`}>
                                              isEditable
                                            </span>
                                          </div>
                                          {/* </div> */}
                                        </div>
                                      )
                                    })}
                                    {/* </div> */}
                                  </div>
                                );
                              })}
                            </>
                          ) : (
                            <p className='px-4 py-0.5'>Loading...</p>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>




                </div>

                <div className='mt-4 flex gap-x-4 justify-end'>
                  <button
                    className='px-6 py-2.5 bg-blue-500 text-white rounded-md'
                    onClick={updateData}
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => { handleDiscard() }}
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
