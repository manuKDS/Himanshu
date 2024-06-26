import ActionBtn from "@/components/dashboard/Menu/Documents/ActionBtn";
import InsertData from "@/components/dashboard/Menu/Documents/InsertData";
import GenerateDocument from "@/components/dashboard/Menu/Documents/GenerateDocument";
import Layout from "@/components/dashboard/layout/Layout";
import { supabase } from "@/lib/supabaseClient";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeVisible, menuCurrent } from "@/redux/productionSlice";
import { getCookie } from "cookies-next";
import jwt from "jsonwebtoken";
import axiosInstance from "@/auth_services/instance";
import docxtemplater from "docxtemplater"
import { saveAs } from "file-saver"
import PizZip from "pizzip";

const Documents = ({
  creditTypes,
  documentData
}) => {
  const dispatch = useDispatch()
  const search_visible = true;
  dispatch(changeVisible({ search_visible }))
  dispatch(menuCurrent({ active_menu: "documents" }))

  const redux_production_id = useSelector((state) => state.production.production_id)
  const redux_production_name = useSelector((state) => state.production.production_name)
  const redux_production = useSelector((state) => state.production.production_list)

  const current_production_details = redux_production_id && redux_production?.length > 0 ? redux_production.find(e => e.production_id === redux_production_id) : {}

  // const [assitanceList, setAssitanceList] = useState(assistances);
  const [documentList, setDocumentList] = useState([]);
  const [documentSelected, setDocumentSelected] = useState([]);
  const [isGenerateDocOpen, setIsGenerateDocOpen] = useState(false)
  const [isGenerateDocContent, setIsGenerateDocContent] = useState("")
  const [isGenerateDocVariables, setIsGenerateDocVariables] = useState({})
  // const [provinceList, setProvinceList] = useState(provinces);
  // const [orgList, setOrgList] = useState(organizations);
  // const [pageEntries, setPageEntries] = useState(10);
  // const [pageTotal, setPageTotal] = useState(1);
  // const [pageCurrent, setPageCurrent] = useState(1);
  // const [pageStart, setPageStart] = useState(0);
  // const [pageEnd, setPageEnd] = useState(5);
  // const [direction, setDirection] = useState("start");
  const [query, setQuery] = useState("");

  const [menuCheck, setmenuCheck] = useState(true)

  useEffect(() => {
    let getToken = getCookie("token")
    let decodeUser = jwt.decode(getToken)
    const menus = decodeUser.menurole
    let result = menus.find(item => item.menu_fid == 11)

    if (result !== undefined) {
      setmenuCheck(result?.is_editable)
    }
    tableReload()
  }, [])

  const handleDocumentSelect = (isChecked, documentInfo) => {
    if (isChecked) {
      setDocumentSelected([...documentSelected, documentInfo])
    } else {
      const newDocumentArray = documentSelected.filter(e => e.document_id !== documentInfo.document_id)
      setDocumentSelected(newDocumentArray)
    }
  }

  const handleGenerate = async () => {
    createDOC();
  }
  const createDOC = async () => {
    if (documentSelected.length === 1) {
      const content1 = await fetch(`../../../../../uploads/${documentSelected[0].document_path}`).then((res) => res.arrayBuffer());
      const zip1 = new PizZip(content1)
      let content = await zip1.file('word/document.xml').asText();
      const regex = /{([^{}]+)}/g;
      const variables = content.match(regex);
      let obj = {}
      console.log("current_production_details:::", current_production_details);
      variables?.forEach((variable) => {
        obj = { ...obj, [variable.slice(1, -1)]: current_production_details[variable.slice(1, -1)] || "" }
      })
      console.log("obj", obj)
      setIsGenerateDocContent(zip1)
      setIsGenerateDocVariables(obj)
      setIsGenerateDocOpen(true)
      // let doc = new docxtemplater()
      // doc.loadZip(zip1);
      // let obj = current_production_details;
      // const documentXml = doc.getZip().file('word/document.xml').asText();
      // const regex = /{([^{}]+)}/g;
      // const variables = documentXml.match(regex);
      // doc.setData(obj)
      // try {
      //   doc.render()
      // }
      // catch (error) {
      //   let e = {
      //     message: error.message,
      //     name: error.name,
      //     stack: error.stack,
      //     properties: error.properties,
      //   }
      //   console.log(JSON.stringify({ error: e }));
      //   throw error;
      // }
      // let out = doc.getZip().generate({
      //   type: "blob",
      //   mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      // })
      // saveAs(out, `document.docx`)
      setDocumentSelected([])
    } else if (documentSelected.length > 1) {
      const content1 = await fetch(`../../../../../uploads/${documentSelected[0].document_path}`).then((res) => res.arrayBuffer());
      const zip1 = new PizZip(content1)
      let contentFinal = await zip1.file('word/document.xml').asText();
      await Promise.all(
        documentSelected.map(async (doc, index) => {
          if (index > 0) {
            const contentdynamic = await fetch(`../../../../../uploads/${doc.document_path}`).then((res) => res.arrayBuffer());
            const zip1 = new PizZip(contentdynamic)
            let content = await zip1.file('word/document.xml').asText();
            const myArray = content.split("<w:body>")

            let rest = contentFinal.split('</w:body></w:document>')
            rest.pop();
            const value = rest.join('</w:body></w:document>')

            contentFinal = value + `${myArray[1]}`
          }
        })
      ).then(() => {
        zip1.file("word/document.xml", contentFinal);
        const regex = /{([^{}]+)}/g;
        const variables = contentFinal.match(regex);
        let obj = {}
        variables?.forEach((variable) => {
          obj = { ...obj, [variable.slice(1, -1)]: current_production_details[variable.slice(1, -1)] || "" }
        })
        console.log("obj", obj)
        setIsGenerateDocContent(zip1)
        setIsGenerateDocVariables(obj)
        setIsGenerateDocOpen(true)
        // let doc = new docxtemplater()
        // doc.loadZip(zip1);
        // let obj = current_production_details;
        // const documentXml = doc.getZip().file('word/document.xml').asText();
        // const regex = /{([^{}]+)}/g;
        // const variables = documentXml.match(regex);
        // doc.setData(obj)
        // try {
        //   doc.render()
        // }
        // catch (error) {
        //   let e = {
        //     message: error.message,
        //     name: error.name,
        //     stack: error.stack,
        //     properties: error.properties,
        //   }
        //   throw error;
        // }
        // let out = doc.getZip().generate({
        //   type: "blob",
        //   mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        // })
        // saveAs(out, `document.docx`)
        setDocumentSelected([])
      })

    }
    else {
      console.log("max two can select")
    }
  }

  const tableReload = async () => {
    const res = await axiosInstance.get(process.env.API_SERVER + "document");
    if (res.status === 201) {
      setDocumentList(res.data);


      // const creditTypeLst1 = res.data.filter((item) => item.production_fid == redux_production_id)
      // setDocumentList(creditTypeLst1)
      //setDocumentList(res.data);
      //if (search !== "") {
      // setPageCurrent(1);
      // setDirection("start");
      //}
      // pageHandler();
    }
  };


  useEffect(() => {
    setDocumentSelected([]);
  }, [redux_production_id])

  // convert Province id to Province
  // function convertProvinceId(province_id) {
  //   const provinceTypeName = provinceList.find(
  //     (item) => item.province_id === province_id
  //   );

  //   return provinceTypeName?.province;
  // }

  // // convert tax_assistance_id to type
  // function convertTaxAssTypeName(tax_ass_id) {
  //   const tax_ass = assitanceList.find((item) => item.tax_assitance_id === tax_ass_id);
  //   return tax_ass?.type;
  // }

  // // convert tax_assistance_id to sub_type
  // function convertTaxAssSubType(tax_ass_id) {
  //   const tax_ass = assitanceList.find((item) => item.tax_assitance_id === tax_ass_id);
  //   return tax_ass?.sub_type;
  // }

  // // convert tax_assistance_id to Application Name
  // function convertApplicationName(tax_ass_id) {
  //   const tax_ass = assitanceList.find((item) => item.tax_assitance_id === tax_ass_id);
  //   return tax_ass?.application_name;
  // }

  // // convert org_id to expense_nature
  // function convertOrgTypeName(org_id) {
  //   const org = orgList.find((item) => item.org_id === org_id);

  //   return org?.org_name;
  // }

  // convert credit application id to assistance type
  // function convertApplType(id) {
  //   const assistance = assitanceList.find(
  //     (item) => item.tax_assitance_id === id
  //   );

  //   return assistance?.type;
  // }

  // // convert credit sub application id to assistance type
  // function convertApplSubType(id) {
  //   const assistance = assitanceList.find(
  //     (item) => item.tax_assitance_id === id
  //   );

  //   return assistance?.sub_type;
  // }

  // // convert credit sub application id to assistance type
  // function convertTaxCreditApplName(id) {
  //   const assistance = assitanceList.find(
  //     (item) => item.tax_assitance_id === id
  //   );

  //   return assistance?.application_name;
  // }

  // const filteredResults =
  //   query === ""
  //     ? documentList
  //     : documentList.filter((filter) => {
  //       return convertApplType(filter.app_type)
  //         .toLowerCase()
  //         .includes(query.toLowerCase());
  //     });

  const filteredStaticResults = documentList.filter((e) => e.production_fid === redux_production_id && e.document_type === 0)
  const filteredDynamicResults = documentList.filter((e) => e.production_fid === redux_production_id && e.document_type === 1)

  // Page Previous Next First Last
  // useEffect(() => {
  //   pageHandler();
  // }, [direction, pageCurrent]);

  // Change Entries 5, 10, 15, 20 per page
  // useEffect(() => {
  //   setPageCurrent(1);
  //   setDirection("start");
  //   pageHandler();
  // }, [pageEntries]);

  // // Search input handler
  // useEffect(() => {
  //   setPageCurrent(1);
  //   setDirection("start");
  // }, [query]);

  // const pageHandler = () => {
  //   var num1 = documentList.length / pageEntries;
  //   var num2 = Math.round(documentList.length / pageEntries);
  //   if (num1 > num2) {
  //     num2 = num2 + 1;
  //   }
  //   setPageTotal(num2);

  //   switch (direction) {
  //     case "prev":
  //       if (pageCurrent > 1) setPageCurrent(pageCurrent - 1);
  //       else setPageCurrent(1);
  //       break;
  //     case "next":
  //       if (pageCurrent < pageTotal) setPageCurrent(pageCurrent + 1);
  //       else setPageCurrent(pageTotal);
  //       break;
  //     case "start":
  //       setPageCurrent(1);
  //       break;
  //     case "end":
  //       setPageCurrent(pageTotal);
  //       break;
  //     default:
  //       //setPageCurrent(1)
  //       break;
  //   }

  //   setDirection("");
  //   var pgStart = pageEntries * (pageCurrent - 1);
  //   var pgEnd = pgStart + parseInt(pageEntries);
  //   setPageStart(pgStart);
  //   setPageEnd(pgEnd);
  // };

  return (
    <>
      <div className='p-5'>
        <div className='mx-auto'>
          <div className='flex gap-2 text-lg mb-6'>
            <div className='flex gap-2 text-lg'>
              <span>{redux_production_name}</span>
              <span>{">"}</span>
              <span>Documents</span>
            </div>
          </div>

          {redux_production_id ? (

            <div className='px-3 py-5 rounded-lg border shadow bg-white'>
              <div className='flex justify-between items-center gap-2 px-4'>
                <div className='flex items-center gap-2 text-sm'>
                  <span>Templates</span>
                  {/* <div className='inline-flex items-center relative cursor-pointer min-w-[50px] text-sm'>
                    <select
                      onChange={(e) => {
                        setPageEntries(e.target.value);
                      }}
                      className='appearance-none w-full border outline-none rounded-[4px] px-1 cursor-pointer'
                    >
                      <option defaultValue='5'>5</option>
                      <option value='10'>10</option>
                      <option value='20'>20</option>
                      <option value='50'>50</option>
                      <option value='100'>100</option>
                    </select>
                    <span className='absolute right-2 pointer-events-none'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth='1.5'
                        stroke='currentColor'
                        className='w-4 h-4'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M19.5 8.25l-7.5 7.5-7.5-7.5'
                        />
                      </svg>
                    </span>
                  </div>
                  <span>entries</span> */}
                </div>
                <div className='flex items-center gap-2'>
                  {/* <div className='relative flex items-center'>
                    <input
                      type='text'
                      placeholder='Search'
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className='pl-5 pr-[45px] h-[40px] w-[400px] bg-gray-100 rounded-md outline-none'
                    />
                    <span className='absolute right-[12px] pointer-events-none'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth='1.5'
                        stroke='currentColor'
                        className='w-5 h-5'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
                        />
                      </svg>
                    </span>
                  </div> */}
                  <button className="ml-4 bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-xl" onClick={() => { handleGenerate() }}>
                    Generate
                  </button>
                  {menuCheck ? (
                    <InsertData
                      tableReload={tableReload}
                    />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-400 icon icon-tabler icon-tabler-pencil-off" width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <path d="M10 10l-6 6v4h4l6 -6m1.99 -1.99l2.504 -2.504a2.828 2.828 0 1 0 -4 -4l-2.5 2.5"></path>
                      <path d="M13.5 6.5l4 4"></path>
                      <path d="M3 3l18 18"></path>
                    </svg>
                  )}

                </div>
              </div>
              <div className='relative overflow-x-auto mt-10 rounded-lg bg-[#E9E9E9] p-3'>
                <div>Static Template</div>
                {filteredStaticResults.length === 0 && <span className="text-red-500 text-sm">No Document Found!</span>}
                <table className='w-full border-separate border-spacing-y-2'>
                  {/* <thead className='text-sm text-slate-700'>
                    <tr>
                      <th className='px-4 py-2 text-left'>
                        Static Template
                      </th>
                      <th className='px-4 py-2 text-left'>

                      </th>
                      <th className='px-4 py-2 text-left'>

                      </th>

                    </tr>
                  </thead> */}

                  <tbody className='text-xs text-slate-700'>
                    {
                      filteredStaticResults.map((document) => {
                        return <tr className='bg-white' key={document.document_id}>
                          <td className='px-4 py-2 text-left w-[20px]' >
                            <input
                              className={`h-4 w-4 cursor-pointer`}
                              type='checkbox'
                              onChange={(e) => {
                                handleDocumentSelect(e.target.checked, document);
                              }}
                              checked={documentSelected.findIndex(e => e.document_id === document.document_id) !== -1}
                            />
                          </td>
                          <td className='px-4 py-2 text-left w-[800px]'>
                            {document.document_name}
                          </td>
                          {/* <td className='px-4 py-2 text-left w-[50px]'>
                            {documentSelected.findIndex(e => e.document_id === document.document_id) === -1 ? "" : documentSelected.findIndex(e => e.document_id === document.document_id) + 1}
                          </td> */}
                          <td className='px-4 py-2 text-right flex justify-end'>
                            <ActionBtn data={document} tableReload={tableReload} menuCheck={menuCheck}> </ActionBtn>
                          </td>
                        </tr>
                      })
                    }
                  </tbody>


                </table>
              </div>

              <div className='relative overflow-x-auto mt-10 rounded-lg bg-[#E9E9E9] p-3'>
                <div>Dynamic Template</div>
                {filteredDynamicResults.length === 0 && <span className="text-red-500 text-sm">No Document Found!</span>}
                <table className='w-full border-separate border-spacing-y-2'>
                  {/* <thead className='text-sm text-slate-700'>
                    <tr>
                      <th className='px-4 py-2 text-left'>
                        Dynamic Template
                      </th>
                      <th className='px-4 py-2 text-left'>

                      </th>
                      <th className='px-4 py-2 text-left'>

                      </th>
                      <th className='px-4 py-2 text-left'>

                      </th>


                    </tr>
                  </thead> */}

                  <tbody className='text-xs text-slate-700'>
                    {
                      filteredDynamicResults.map((document) => {
                        return <tr className='bg-white' key={document.document_id}>
                          <td className='px-4 py-2 text-left w-[20px]' >
                            <input
                              className={`h-4 w-4 cursor-pointer`}
                              type='checkbox'
                              onChange={(e) => {
                                handleDocumentSelect(e.target.checked, document);
                              }}
                              checked={documentSelected.findIndex(e => e.document_id === document.document_id) !== -1}
                            />
                          </td>
                          <td className='px-4 py-2 text-left w-[800px]'>
                            {document.document_name}
                          </td>

                          <td className='px-4 py-2 text-right flex justify-end'>
                            <ActionBtn data={document} tableReload={tableReload} menuCheck={menuCheck} > </ActionBtn>
                          </td>
                        </tr>
                      })
                    }
                  </tbody>


                </table>
              </div>
              {/* <div className='flex gap-2 items-center justify-between pt-4 px-4'>
                <span className='font-semibold text-sm'>
                  Showing {pageStart + 1} to{" "}
                  {documentList.length > pageEnd
                    ? pageEnd
                    : documentList.length}{" "}
                  of {""}
                  {documentList.length} entries
                </span>
                <Pagination
                  pageCurrent={pageCurrent}
                  setDirection={setDirection}
                />
              </div> */}
            </div>

          ) : (
            <span className="text-red-400">Please choose a production</span>
          )}

        </div>
      </div>
      {isGenerateDocContent && <GenerateDocument isOpen={isGenerateDocOpen} setIsOpen={setIsGenerateDocOpen} isGenerateDocContent={isGenerateDocContent} isGenerateDocVariables={isGenerateDocVariables} tableReload={tableReload} />}
    </>
  );
};

export async function getServerSideProps() {
  const tbl_documents = await supabase
    .from("tbl_documents")
    .select()
    .order("created_at", { ascending: false });

  return {
    props: {
      documentData: tbl_documents.data,
    },
  };
}

export default Documents;

Documents.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
