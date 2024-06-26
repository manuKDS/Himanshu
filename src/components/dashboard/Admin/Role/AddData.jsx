import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/auth_services/instance";
import StatusDropDown from "./StatusDropDown";

const status_data = [
  { id: 1, status: "Active" },
  { id: 2, status: "Inactive" },
];

const incorporated_in_data = [
  { id: "Province", name: "Province" },
  { id: "Federal", name: "Federal" },
  { id: "N/A", name: "N/A" },
];

const Items = [
  { id: 101, menu: "My Production", check_status: false, isEditable: true },
  { id: 1, menu: "Production", check_status: true, isEditable: false },
  { id: 2, menu: "Feature", check_status: true, isEditable: true },
  { id: 3, menu: "Series", check_status: false, isEditable: true },

  { id: 102, menu: "Menu", check_status: false, isEditable: true },
  { id: 5, menu: "Banking Information", check_status: true, isEditable: true },
  { id: 6, menu: "Budget Information", check_status: false, isEditable: true },
  {
    id: 7,
    menu: "Location Information",
    check_status: false,
    isEditable: true,
  },
  { id: 8, menu: "Production Schedule", check_status: false, isEditable: true },
  { id: 9, menu: "Tax Credit Expense", check_status: false, isEditable: true },

  { id: 103, menu: "Admin", check_status: false, isEditable: true },
  { id: 10, menu: "Nature Of Expense", check_status: false, isEditable: true },
  { id: 11, menu: "Expense Title", check_status: false, isEditable: true },
  {
    id: 12,
    menu: "Tax Credit Application",
    check_status: false,
    isEditable: true,
  },
  { id: 13, menu: "Genre List", check_status: false, isEditable: true },
  { id: 14, menu: "Region", check_status: false, isEditable: true },
  { id: 15, menu: "Role", check_status: false, isEditable: true },
  { id: 16, menu: "User", check_status: false, isEditable: true },
  { id: 17, menu: "Vendor List", check_status: false, isEditable: true },
  { id: 18, menu: "Vendor Type", check_status: false, isEditable: true },
  { id: 19, menu: "Country", check_status: false, isEditable: true },
  { id: 20, menu: "Province", check_status: false, isEditable: true },
  { id: 21, menu: "City", check_status: false, isEditable: true },
];

export default function AddData({ isOpen, setIsOpen, menuList, state, tableReload }) {
  const { distributorLst, genreLst, provinceLst, countryLst } = state;

  const [org_fid, setorg_fid] = useState(1);
  const [modified_by, setmodified_by] = useState(1);
  const [role, setrole] = useState("");
  const [menuItems, setMenuItems] = useState([]);

  // foreign key fields
  const [status_fid, setstatus_fid] = useState("");
  const router = useRouter();

  // error handler
  const [errorrole, seterrorrole] = useState("");
  const [errorstatus, seterrorstatus] = useState("");
  const [errorMenu, seterrorMenu] = useState("");

  // Loder state
  const [insertLoading, setInsertLoading] = useState(false);

  useEffect(() => {
    fetchMenuData()
  }, [])

  const fetchMenuData = async () => {
    try {
      const menuArray = menuList.map((record) => {
        return { ...record, check_status: false, isEditable: false, menu_name: record.menu_name.trim() }
      })
      setMenuItems(menuArray);
    } catch (error) {
      console.error(error.message);
    }
  }

  const handleMenuAccessChange = (value, menuId) => {
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
    const dataIndex = menuItems.findIndex((menu) => menu.menu_id === menuId);
    const dataArray = JSON.parse(
      JSON.stringify(menuItems)
    );
    dataArray[dataIndex].isEditable = value
    setMenuItems(dataArray);
  }

  const insertData = async () => {
    seterrorrole(role == "" ? "Role name required!" : "");
    seterrorstatus(status_fid == "" ? "Status required!" : "");

    const accessedMenus = menuItems.filter(menu => menu.check_status);
    seterrorMenu(accessedMenus.length > 0 ? "" : "(At least One Menu)")

    if (role != "" && status_fid !== "" && accessedMenus.length > 0) {
      setInsertLoading(true)
      const role_changecase = role.charAt(0).toUpperCase() + role.slice(1);
      const data = {
        modified_by,
        organization_fid: org_fid,
        role_name: role_changecase,
        is_active: status_fid,
      };


      try {
        const roleRes = await axiosInstance.post(process.env.API_SERVER + "role", data);
        const menuRoleBody = {
          role_fid: roleRes.data[0].role_id,
          accessedMenus: accessedMenus,
          isMenuAccessEdited: false
        }
        const res = await axiosInstance.post(process.env.API_SERVER + "menu_role", menuRoleBody);
        setIsOpen(false);
        setorg_fid(1);
        setmodified_by(1);
        setrole("");
        setstatus_fid("");
        setInsertLoading(false);
        fetchMenuData();
      } catch (error) {
        setInsertLoading(false);
        console.log(error);
      }
      tableReload();
      //router.refresh();
    }
  };

  const handleDiscard = () => {
    setIsOpen(false)
    setorg_fid(1);
    setmodified_by(1);
    setrole("");
    setstatus_fid("");
    setInsertLoading(false);
    fetchMenuData();
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        open={isOpen}
        onClose={() => handleDiscard()}
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
                Add Role{" "}
              </div>

              <div className='p-5'>
                <div className='space-y-3 text-sm'>
                  <div className='grid grid-cols-2 gap-2 '>
                    <div>
                      <label  className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Role Name</label>
                      <input
                        type='text'
                        value={role}
                        onChange={(e) => {
                          setrole(e.target.value);
                          seterrorrole("");
                        }}
                        placeholder='Role Name'
                        className={
                          errorrole != ""
                            ? "px-5 h-[45px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500 mb-4"
                            : "px-5 h-[45px] w-full bg-gray-200 rounded-md outline-none placeholder:text-gray-500 mb-4"
                        }
                      />
                      <br />
                      <label  className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Status</label>
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
                            <p className='px-4 py-0.5'>No Menu Found...</p>
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
                    disabled={insertLoading}
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => {
                      handleDiscard()
                    }}
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
