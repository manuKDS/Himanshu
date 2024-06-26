import React from "react"
import { Dialog, Transition } from "@headlessui/react";
import { supabase } from "@/lib/supabaseClient";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DocumentTypeDropDown from "./DocumentTypeDropDown";
import axiosInstance from "@/auth_services/instance";
import UiFileInputButton from "./UiFileInputButton";
import axios from "axios";

export default function AddDocument({ isOpen, setIsOpen, tableReload }) {

  const fileInputRef = React.useRef(null);
  const redux_production_id = useSelector((state) => state.production.production_id)
  console.log("redux_production_id:::", redux_production_id);

  const [loading, setLoading] = useState(false);
  const [documentType, setDocumentType] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [documentFile, setDocumentFile] = useState("..");
  const [documentFileData, setDocumentFileData] = useState("")


  const [documentTypeList] = useState(["Static Template", "Dynamic Template"]); //0 static, 1- Dynamic
  const [errorMessage, setErrorMessage] = useState("");
  const [apiErrorMessage, setApiErrorMessage] = useState("");


  const clearFields = () => {
    setDocumentType("");
    setDocumentName("");
    setDocumentFile("");
    setErrorMessage("");
  };
  // ------ Insert data to database ---------------------------------
  const insertData = async (fileName) => {
    try {
      setLoading(true);
      if (documentType === "" || documentName === "" || documentFile === "") {
        setErrorMessage("Field can't be empty!")
        setLoading(false);
      } else {
        setErrorMessage("")
        const data = {
          document_type: documentType === "Static Template" ? 0 : 1, //0 static, 1- Dynamic
          document_name: documentName,
          document_path: fileName,
          production_fid: redux_production_id,
        };
        const res = await axiosInstance.post(process.env.API_SERVER + "document", data)

        if (res.status !== 200) {
          setApiErrorMessage("Something Wrong.please try again")
          setLoading(false);
          clearFields();
        } else {
          // 1. Add data in state
          tableReload()

          // 2. clear fields after adding data
          setIsOpen(false);
          setLoading(false);
          clearFields();
        }

      }
    } catch (error) {
      setLoading(false);
      console.log(222)
      console.log(error.error_description || error.message);
    }
  };
  //------------ File upload code --------------------------------
  const onChange = async (formData) => {
    console.log(formData)
    const config = {
      headers: { "content-type": "multipart/form-data" },
      onUploadProgress: (event) => {
        console.log(
          `Current progress:`,
          Math.round((event.loaded * 100) / event.total)
        );
      },
    };

    const response = await axios.post("/api/document/fileuploads", formData, config);
    insertData(response.data.data)
    setDocumentFile(response.data.data)
    //console.log("response", response.data);
  };

  const insertDataWithFile = () => {
    const formData = new FormData();

    Array.from(documentFileData).forEach((file) => {
      formData.append("theFiles", file);
    });

    onChange(formData);
  }

  const onChangeHandler = (event) => {
    if (!event.target.files?.length) {
      return;
    }
    setDocumentFileData(event.target.files)

    //formRef.current?.reset();
  };
  //------------ File upload code end --------------------------------

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        open={isOpen}
        onClose={() => {
          setIsOpen(false)
          clearFields();
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
                Add Document
              </div>
              <div className='p-5'>
                <div className='space-y-3 text-sm'>
                  <div className='flex-1'>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Document Type</label>
                    <DocumentTypeDropDown
                      state={{ documentType, setDocumentType }}
                      list={documentTypeList}
                      error={errorMessage && documentType === ""}
                    />
                  </div>
                  <div className='flex-1'>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Document Name</label>
                    <input
                      type='text'
                      value={documentName}
                      onChange={(e) => setDocumentName(e.target.value)}
                      placeholder='Document Name'
                      className={(errorMessage && documentName == "") ? 'px-5 h-[50px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' : 'px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'}
                    />
                  </div>
                  <div className='flex-1'>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Document File</label>

                    <input
                      //accept={props.acceptedFileTypes}
                      //multiple={props.allowMultipleFiles}
                      name="theFiles"
                      onChange={onChangeHandler}
                      ref={fileInputRef}
                      //style={{ display: 'none' }}
                      type="file"
                      accept=".docx"
                    />

                  </div>
                  {/* <div className='flex-1'>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">{documentFile}</label>
                    
                  </div> */}
                </div>
                <div className='mt-4 flex gap-x-4 justify-end'>
                  {apiErrorMessage && <span className="text-red-500">{apiErrorMessage}</span>}
                  <button
                    className='px-6 py-2.5 min-w-[140px] bg-[#0CA8F8] text-white font-semibold rounded-md'
                    disabled={loading ? true : false}
                    onClick={insertDataWithFile}
                  >
                    {loading ? "Adding..." : " Submit"}
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      clearFields();
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
