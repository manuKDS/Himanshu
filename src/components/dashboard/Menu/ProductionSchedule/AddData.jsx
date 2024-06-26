import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import ExpTypeDropdown from "./ExpTypeDropdown";
import OrgDropdown from "./OrgDropdown";
import axiosInstance from "@/auth_services/instance";
import { useSelector } from "react-redux";

export default function AddData({ isOpen, setIsOpen, fn, state }) {
  const { convetExpTypeName, convertOrgTypeName, tableReload } = fn;
  const { prodScheduleLists, setProdScheduleLists } = state;
  const redux_production_id = useSelector((state) => state.production.production_id)

  const [loading, setLoading] = useState(false);
  const [prodCmpIncDate, setProdCmpIncDate] = useState("");
  const [preProdStartDate, setPreProdStartDate] = useState("");
  const [preProdEndDate, setPreProdEndDate] = useState("");
  const [prodStartDate, setProdStartDate] = useState("");
  const [prodEndDate, setProdEndDate] = useState("");
  const [postProdStartDate, setPostProdStartDate] = useState("");
  const [postProdEndDate, setPostProdEndDate] = useState("");
  const [modifiedBy, setModifiedBy] = useState(1);
  const [productionId, setProductionId] = useState(55);
  const [orgId, setOrgId] = useState(1);

  const [errorMessage, setErrorMessage] = useState("")

  const prodScheduleId = prodScheduleLists[0]?.tbl_production_schedule_id;

  const clearFields = () => {
    setIsOpen(false);
    setLoading(false);
    setProdCmpIncDate("");
    setPreProdStartDate("");
    setPreProdEndDate("");
    setProdStartDate("");
    setProdEndDate("");
    setPostProdStartDate("");
    setPostProdEndDate("");
    setErrorMessage("")
  };

  const handleDateChange = (type, newDate) => {
    const currentDateTimeStamp = new Date(new Date().toISOString().split('T')[0]).getTime()
    const newTimeStamp = new Date(newDate).getTime()
    console.log("type:::", type, "::newDate:::", newDate);
    if (type === "preProdStart") {
      preProdEndDate && newTimeStamp > new Date(preProdEndDate).getTime() && setPreProdEndDate("");
      prodStartDate && newTimeStamp > new Date(prodStartDate).getTime() && setProdStartDate("");
      prodEndDate && newTimeStamp > new Date(prodEndDate).getTime() && setProdEndDate("");
      postProdStartDate && newTimeStamp > new Date(postProdStartDate).getTime() && setPostProdStartDate("");
      postProdEndDate && newTimeStamp > new Date(postProdEndDate).getTime() && setPostProdEndDate("");
    }
    if (type === "preProdEnd") {
      if (newTimeStamp < new Date(preProdStartDate).getTime()) {
        setPreProdEndDate("")
      } else {
        prodStartDate && newTimeStamp > new Date(prodStartDate).getTime() && setProdStartDate("");
        prodEndDate && newTimeStamp > new Date(prodEndDate).getTime() && setProdEndDate("");
        postProdStartDate && newTimeStamp > new Date(postProdStartDate).getTime() && setPostProdStartDate("");
        postProdEndDate && newTimeStamp > new Date(postProdEndDate).getTime() && setPostProdEndDate("");
      }
    }
    if (type === "prodStart") {
      if (newTimeStamp < new Date(preProdEndDate).getTime()) {
        setProdStartDate("")
      } else {
        prodEndDate && newTimeStamp > new Date(prodEndDate).getTime() && setProdEndDate("");
        postProdStartDate && newTimeStamp > new Date(postProdStartDate).getTime() && setPostProdStartDate("");
        postProdEndDate && newTimeStamp > new Date(postProdEndDate).getTime() && setPostProdEndDate("");
      }
    }
    if (type === "prodEnd") {
      if (newTimeStamp < new Date(prodStartDate).getTime()) {
        setProdEndDate("")
      } else {
        postProdStartDate && newTimeStamp > new Date(postProdStartDate).getTime() && setPostProdStartDate("");
        postProdEndDate && newTimeStamp > new Date(postProdEndDate).getTime() && setPostProdEndDate("");
      }
    }
    if (type === "postProdStart") {
      if (newTimeStamp < new Date(prodEndDate).getTime()) {
        setPostProdStartDate("")
      } else {
        postProdEndDate && newTimeStamp > new Date(postProdEndDate).getTime() && setPostProdEndDate("");
      }
    }
    if (type === "postProdEnd") {
      if (newTimeStamp < new Date(postProdStartDate).getTime()) {
        setPostProdEndDate("")
      }
    }
  }

  const insertData = async () => {
    // const selectedData = {
    //   tbl_production_schedule_id: prodScheduleId + 1,
    //   incorp_date: prodCmpIncDate,
    //   pre_prod_start_date: preProdStartDate,
    //   pre_prod_end_date: preProdEndDate,
    //   prod_start_date: prodStartDate,
    //   prod_end_date: prodEndDate,
    //   modified_by: modifiedBy,
    //   post_prod_start_date: postProdStartDate,
    //   post_prod_end_date: postProdEndDate,
    //   production_fid: productionId,
    //   organization_fid: orgId,
    // };

    try {
      setLoading(true);
      if (prodCmpIncDate === "" || preProdStartDate === "" || preProdEndDate === "" || prodStartDate === "" || prodEndDate === "" || postProdStartDate === "" || postProdEndDate === "") {
        setErrorMessage("All feilds are required")
        setLoading(false);
      } else {
        const data = {
          incorp_date: prodCmpIncDate,
          pre_prod_start_date: preProdStartDate,
          pre_prod_end_date: preProdEndDate,
          prod_start_date: prodStartDate,
          prod_end_date: prodEndDate,
          modified_by: modifiedBy,
          post_prod_start_date: postProdStartDate,
          post_prod_end_date: postProdEndDate,
          production_fid: redux_production_id,
          organization_fid: orgId,
        };

        const res = await axiosInstance.post(
          process.env.API_SERVER + "production_schedule",
          data
        );

        if (res.status !== 200) throw error;

        tableReload();
        // 1. Add data in state
        // setProdScheduleLists([selectedData, ...prodScheduleLists]);

        // 2. clear fields after adding data
        clearFields();
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
        onClose={() => clearFields()}
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
                Add Production Schedule
              </div>
              <div className='px-5 pt-5 pb-6'>
                <div className='space-y-4 text-sm'>
                  <div className='flex-1'>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Production Company Incorporated Date</label>
                    <input
                      onFocus={(e) => (e.currentTarget.type = "date")}
                      type="date"
                      value={prodCmpIncDate}
                      onChange={(e) => setProdCmpIncDate(e.target.value)}
                      placeholder='Production Company Incorporated Date'
                      className={(errorMessage && prodCmpIncDate == "") ? 'px-5 h-[50px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' : 'px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'}
                    />
                  </div>

                  <div className='flex gap-3'>
                    <div className='w-full'>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Pre - Production Start Date</label>
                      <input
                        // onFocus={(e) => (e.currentTarget.type = "date")}
                        type="date"
                        value={preProdStartDate}
                        onChange={(e) => {
                          setPreProdStartDate(e.target.value)
                        }}
                        // onkeydown="event.preventDefault()"
                        onBlur={() => { handleDateChange("preProdStart", preProdStartDate) }}
                        placeholder='Pre - Production Start Date'
                        className={(errorMessage && preProdStartDate == "") ? 'px-5 h-[50px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' : 'px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'}
                      />
                    </div>
                    <div className='w-full'>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Pre - Production End Date</label>
                      <input
                        // onFocus={(e) => (e.currentTarget.type = "date")}
                        type="date"
                        value={preProdEndDate}
                        onChange={(e) => setPreProdEndDate(e.target.value)}
                        placeholder='Pre - Production End Date'
                        className={(errorMessage && preProdEndDate == "") ? 'px-5 h-[50px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' : 'px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'}
                        onBlur={() => { handleDateChange("preProdEnd", preProdEndDate) }}
                        min={preProdStartDate}
                      />
                    </div>
                  </div>

                  <div className='flex gap-3'>
                    <div className='w-full'>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Production Start Date</label>
                      <input
                        // onFocus={(e) => (e.currentTarget.type = "date")}
                        type="date"
                        value={prodStartDate}
                        onChange={(e) => setProdStartDate(e.target.value)}
                        placeholder='Production Start Date'
                        className={(errorMessage && prodStartDate == "") ? 'px-5 h-[50px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' : 'px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'}
                        onBlur={() => { handleDateChange("prodStart", prodStartDate) }}
                        min={preProdEndDate}
                      />
                    </div>
                    <div className='w-full'>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Production End Date</label>
                      <input
                        // onFocus={(e) => (e.currentTarget.type = "date")}
                        type="date"
                        value={prodEndDate}
                        onChange={(e) => setProdEndDate(e.target.value)}
                        placeholder='Production End Date'
                        className={(errorMessage && prodEndDate == "") ? 'px-5 h-[50px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' : 'px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'}
                        onBlur={() => { handleDateChange("prodEnd", prodEndDate) }}
                        min={prodStartDate}
                      />
                    </div>
                  </div>
                  <div className='flex gap-3'>
                    <div className='w-full'>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Post Production Start Date</label>
                      <input
                        // onFocus={(e) => (e.currentTarget.type = "date")}
                        type="date"
                        value={postProdStartDate}
                        onChange={(e) => setPostProdStartDate(e.target.value)}
                        placeholder='Post Production Start Date'
                        className={(errorMessage && postProdStartDate == "") ? 'px-5 h-[50px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' : 'px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'}
                        onBlur={() => { handleDateChange("postProdStart", postProdStartDate) }}
                        min={prodEndDate}
                      />
                    </div>
                    <div className='w-full'>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Post Production End Date</label>
                      <input
                        // onFocus={(e) => (e.currentTarget.type = "date")}
                        type="date"
                        value={postProdEndDate}
                        onChange={(e) => setPostProdEndDate(e.target.value)}
                        placeholder='Post Production End Date'
                        className={(errorMessage && postProdEndDate == "") ? 'px-5 h-[50px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' : 'px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'}
                        onBlur={() => { handleDateChange("postProdEnd", postProdEndDate) }}
                        min={postProdStartDate}
                      />
                    </div>
                  </div>
                  {/* <input
                    type='date'
                    value={orgId}
                    onChange={(e) => setOrgId(e.target.value)}
                    placeholder='Org ID'
                    className='px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'
                  /> */}
                  {/* <OrgDropdown
                    state={{ orgId, setOrgId }}
                    list={orgList}
                    convertOrgTypeName={convertOrgTypeName}
                  /> */}
                </div>
                <div className='mt-5 flex gap-x-4 justify-end'>
                  <button
                    className='px-6 py-2.5 min-w-[140px] bg-[#0CA8F8] text-white font-semibold rounded-md'
                    disabled={loading ? true : false}
                    onClick={insertData}
                  >
                    {loading ? "Adding..." : " Add"}
                  </button>
                  <button
                    onClick={() => clearFields()}
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
