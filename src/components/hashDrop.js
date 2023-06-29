import React, { useCallback, useMemo, useState } from 'react'
import { useDropzone } from 'react-dropzone'

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};

const focusedStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};


function MyDropzone() {

    const [hash, setHash] = useState();

    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader()

            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = () => {
                console.log('reading', reader.result)
                crypto.subtle.digest("SHA-256", reader.result)
                    .then((buffer) => {
                        console.log('buffer', buffer)
                        const hexCodes = [];
                        const view = new DataView(buffer);
                        for (let i = 0; i < view.byteLength; i++) {
                            const stringValue = view.getUint8(i).toString(16);
                            const paddedValue = ('0' + stringValue).slice(-2);
                            hexCodes.push(paddedValue);
                        }
                        console.log(hexCodes.join(''))
                        setHash(hexCodes.join(''));
                    })
                    .catch(console.error)
            }
            reader.readAsArrayBuffer(file)
        })

    }, [])

    const { getRootProps, getInputProps, isDragAccept, isFocused, isDragReject } = useDropzone({
        onDrop, accept:
        {
            'application/pdf': []
        }
    })

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isFocused,
        isDragAccept,
        isDragReject
    ]);


    return (
        <>
            <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
            </div>

            <div>
                {hash}
            </div>
        </>
    )
}

export default MyDropzone;