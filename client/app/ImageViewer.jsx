import React, { useState, useEffect }from 'react';
import _ from 'lodash';
import axios from 'axios';

const ACCEPTED_FILE_EXTENSIONS = ['.png', '.jpg'];

export default function ImagerViewer() {

    const CURRENT_IMAGE_URL = 'http://localhost:3000/photo';
    const OLD_IMAGE_URL = 'http://localhost:3000/oldPhoto';

    const [currentFile, setCurrentFile] = useState();
    const [errorMessage, setErrorMessage] = useState('Select a .jpg or .png image to load');
    const [date, setDate] = useState(Date.now())

    const onFileLoaded = (e) => {
        if (e.target.files.length === 0) {
            setErrorMessage('Select a .jpg or .png image to load');
            return;
        }

        const file = e.target.files[0];
        const filename = file.name;

        if (!_.some(ACCEPTED_FILE_EXTENSIONS, (ext) => (ext === filename.substring(filename.length-4, filename.length).toLowerCase()))) {
            setErrorMessage('Only .png and .jpg images allowed');
        } else {
            setErrorMessage('');
        }
        
        setCurrentFile(file);
    };

    const onFormSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', currentFile);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };

        setErrorMessage('loading...');

        axios.post('http://localhost:3000/newPhoto', formData, {})
            .then((res) => { setErrorMessage('Image probably loaded'); })
            .catch((err) => { setErrorMessage('Something went wrong'); });
    };

    const [time, setTime] = useState(Date.now());

    useEffect(() => {
        const interval = setInterval(() => setTime(Date.now()), 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <div>
            <div>Friendly Image Sharing</div>
            <div>Current Image:</div>
            <div style={{
                maxHeight: '500px',
                maxWidth: '500px'
            }}>
                <img src={`${CURRENT_IMAGE_URL}?${time}`}
                    style={{
                        maxWidth: '100%'
                    }}/>
            </div>
            <div>Previous Image:</div>
            <div style={{
                maxHeight: '500px',
                maxWidth: '500px'
            }}>
                <img src={`${OLD_IMAGE_URL}?${time}`}
                    style={{
                        maxWidth: '100%'
                    }}/>
            </div>
            <form onSubmit={onFormSubmit}>
                <input type="file" name="file" onChange={onFileLoaded}/>
                <button disabled={errorMessage} type="submit">Submit</button>
            </form>
                {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        </div>
    );
};