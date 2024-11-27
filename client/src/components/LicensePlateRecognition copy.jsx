import React, { useState } from 'react';
import axios from 'axios';

const LicensePlateRecognition = () => {
    const [inputMode, setInputMode] = useState('url'); // 'url' or 'upload'
    const [imageUrl, setImageUrl] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        try {
            setError('');
            setResult(null);

            let payload;
            if (inputMode === 'url') {
                payload = { imageUrl };
            } else if (imageFile) {
                const formData = new FormData();
                formData.append('file', imageFile);

                const { data: uploadResponse } = await axios.post('http://localhost:5000/api/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                payload = { imageUrl: uploadResponse.imageUrl };

            } else {
                setError('No valid input provided');
                return;
            }

            const { data } = await axios.post('http://localhost:5000/api/recognize', payload);
            setResult(data);
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred');
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded">
            <h1 className="text-xl font-bold text-center mb-4">License Plate Recognition</h1>

            <div className="flex justify-center mb-4">
                <button
                    className={`px-4 py-2 rounded-l ${inputMode === 'url' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setInputMode('url')}
                >
                    URL Input
                </button>
                <button
                    className={`px-4 py-2 rounded-r ${inputMode === 'upload' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setInputMode('upload')}
                >
                    Upload Image
                </button>
            </div>

            {inputMode === 'url' ? (
                <input
                    type="text"
                    placeholder="Enter image URL"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                />
            ) : (
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="w-full mb-4"
                />
            )}

            <button
                onClick={handleSubmit}
                className="w-full bg-blue-500 text-white p-2 rounded"
            >
                Submit
            </button>

            {error && <p className="text-red-500 mt-4">{error}</p>}
            {result && (
                <div className="mt-4 p-4 bg-gray-100 rounded">
                    <h2 className="text-lg font-bold">Result:</h2>
                    <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default LicensePlateRecognition;
