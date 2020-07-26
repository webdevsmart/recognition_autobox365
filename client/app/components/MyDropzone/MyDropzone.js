import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import "./MyDropzone.scss";

export default function MyDropzone(props) {
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
    props.onDrop(acceptedFiles);
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div className="dropzone shadow p-3 mb-5 bg-white rounded" {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
  )
}