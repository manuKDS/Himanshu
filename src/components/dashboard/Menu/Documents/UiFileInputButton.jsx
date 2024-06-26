import React, { useState } from 'react'

export const UiFileInputButton = (props) => {
    const fileInputRef = React.useRef (null);
    const [filename, setfilename] = useState("")
    // const formRef = React.useRef (null);

    // const onClickHandler = () => {
    //     fileInputRef.current?.click();
    // };

    const onChangeHandler = (event) => {
        if (!event.target.files?.length) {
            return;
        }

        const formData = new FormData();

        Array.from(event.target.files).forEach((file) => {
            setfilename(file.filename)
            formData.append(event.target.name, file);
        });

        props.onChange(formData);

        //formRef.current?.reset();
    };

    return (
        <div >
            {/* <button type="button" onClick={onClickHandler}>
                {props.label}
            </button> */}
            <input 
                //accept={props.acceptedFileTypes}
                //multiple={props.allowMultipleFiles}
                name={props.uploadFileName}
                onChange={onChangeHandler}
                ref={fileInputRef}
                //style={{ display: 'none' }}
                type="file"
            />
            <label >{filename}</label>
        </div>
    );
};

UiFileInputButton.defaultProps = {
    acceptedFileTypes: '',
    allowMultipleFiles: false,
};

export default UiFileInputButton