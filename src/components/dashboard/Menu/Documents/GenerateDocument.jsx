import React from "react"
import { Dialog, Transition } from "@headlessui/react";
import { supabase } from "@/lib/supabaseClient";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DocumentTypeDropDown from "./DocumentTypeDropDown";
import axiosInstance from "@/auth_services/instance";
import UiFileInputButton from "./UiFileInputButton";
import axios from "axios";
import docxtemplater from "docxtemplater"
import { saveAs } from "file-saver"
import JSZip from "jszip";

export default function GenerateDocument({ isOpen, setIsOpen, isGenerateDocVariables, isGenerateDocContent, tableReload }) {

  const [variables, setVariables] = useState(isGenerateDocVariables)
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [apiErrorMessage, setApiErrorMessage] = useState("");

  console.log("isGenerateDocVariables:::", variables);
  useEffect(() => {
    setVariables(isGenerateDocVariables)
  }, [isGenerateDocVariables])

  // ------ Insert data to database ---------------------------------
  const generateDocument = async () => {
    try {
      setLoading(true);
      if (Object.keys(variables).find((key) => variables[key] === "")) {
        setErrorMessage("Field can't be empty!")
        setLoading(false);
      } else {
        let doc = new docxtemplater()
        doc.loadZip(isGenerateDocContent);
        let obj = variables;
        doc.setData(obj)
        try {
          doc.render()
        }
        catch (error) {
          setLoading(false);
          setErrorMessage("")
          let e = {
            message: error.message,
            name: error.name,
            stack: error.stack,
            properties: error.properties,
          }
          throw error;
        }
        let out = doc.getZip().generate({
          type: "blob",
          mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        })
        saveAs(out, `document.docx`)
        setIsOpen(false)
        setErrorMessage("")
        setLoading(falsw);
      }
    } catch (error) {
      setLoading(false);
      console.log(error.error_description || error.message);
    }
  };

  const handleChangeValue = (key, value) => {
    setVariables({ ...variables, [key]: value })
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        open={isOpen}
        onClose={() => {
          setIsOpen(false)
          setVariables({})
          setErrorMessage("")
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
                Document Content
              </div>
              <div className='p-5'>
                {
                  Object.keys(variables).length === 0 ? (<span>All data is static you can proceed for generate</span>) : <>
                    {
                      Object.keys(variables).map((key) => {
                        return (
                          <div className='space-y-3 text-sm'>
                            <div className='flex-1'>
                              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">{key}</label>
                              <input
                                type='text'
                                value={variables[key]}
                                onChange={(e) => handleChangeValue(key, e.target.value)}
                                placeholder={key}
                                className={(errorMessage && variables[key] == "") ? 'px-5 h-[50px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500' : 'px-5 h-[50px] w-full bg-[#E9E9E9] rounded-md outline-none placeholder:text-gray-500'}
                              />
                            </div>
                          </div>
                        )
                      })
                    }
                  </>
                }
                <div className='mt-4 flex gap-x-4 justify-end'>
                  {apiErrorMessage && <span className="text-red-500">{apiErrorMessage}</span>}
                  <button
                    className='px-6 py-2.5 min-w-[140px] bg-[#0CA8F8] text-white font-semibold rounded-md'
                    disabled={loading ? true : false}
                    onClick={generateDocument}
                  >
                    {loading ? "Generating..." : "Generate"}
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      setVariables({})
                      setErrorMessage("")
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
