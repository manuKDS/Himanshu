import { supabase } from "@/lib/supabaseBucket";
import { useEffect, useState } from "react";


const index = () => {


  const [files, setFiles] = useState([]);
  const [documentFileData, setDocumentFileData] = useState("")
  const [linkfile, setLinkFile] = useState("");



  const uploadDoc = async (event) => {
    const avatarFile = event.target.files[0]
    console.log(avatarFile)
    const { data, error } = await supabase
      .storage
      .from('avatars')
      .upload('public/' + avatarFile.name, avatarFile, {
        cacheControl: '3600',
        upsert: false
      })

    data && console.log("file uploaded")
    error && console.log("upload  error --" + error.message)

  }

  const downloadDoc = async (fname) => {


    const { data } = supabase
      .storage
      .from('avatars')
      .getPublicUrl('public/' + fname)

    setLinkFile(data.publicUrl)
    console.log(data)
  }

  const onChangeHandler = (event) => {
    if (!event.target.files?.length) {
      return;
    }
    setDocumentFileData(event.target.files)

    //formRef.current?.reset();
  };
  useEffect(() => {
    const loadData = async () => {
      const { data, error } = await supabase
        .storage
        .from('avatars')
        .list('public', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' },
        })
      console.log(data)
      setFiles(data)
    }
    loadData()
  }, [])

  useEffect(() => {
    console.log(files)
  }, [files])

  return (
    <div>

      <div className='flex-1'>
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">Document File</label>

        <input
          //accept={props.acceptedFileTypes}
          //multiple={props.allowMultipleFiles}
          name="theFiles"
          onChange={uploadDoc}

          //style={{ display: 'none' }}
          type="file"
          accept=".docx"
        />

      </div>

      <hr />
      List: {files.length}
      <div>
        {files.length > 0 &&
          files?.map((file, index) => {
            <li>{file}</li>
          })
        }
      </div>
      <p>
        {linkfile &&
          <a href={linkfile} target="_blank">Download File</a>
        }
        {!linkfile &&
          <button onClick={() => downloadDoc('document.docx')}>Prepare File1</button>
        }
        {/* <button onClick={() => downloadDoc('Ashish 2.jpg')}>File2</button> <br /> */}
      </p>

    </div>
  )
}

export default index