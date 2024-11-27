import React, { useState } from 'react';

// This component will render the details in a table format
function LicensePlateDetails({ data }) {
  const { processing_time, results, filename, timestamp, image_width, image_height } = data;
  const result = results[0]; // Assuming we only have one result

  return (
    <div>
      <h2>License Plate Recognition Details</h2>

      <table border="1">
        <thead>
          <tr>
            <th>Category</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Processing Time</td><td>{processing_time} seconds</td></tr>
          <tr><td>Filename</td><td>{filename}</td></tr>
          <tr><td>Version</td><td>{data.version}</td></tr>
          <tr><td>Timestamp</td><td>{timestamp}</td></tr>
          <tr><td>Image Width</td><td>{image_width}</td></tr>
          <tr><td>Image Height</td><td>{image_height}</td></tr>
        </tbody>
      </table>

      <h3>Plate Recognition</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Plate</th>
            <th>Region</th>
            <th>Score</th>
            <th>Bounding Box</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{result.plate}</td>
            <td>{result.region.code}</td>
            <td>{result.score}</td>
            <td>{`(${result.box.xmin}, ${result.box.ymin}, ${result.box.xmax}, ${result.box.ymax})`}</td>
          </tr>
        </tbody>
      </table>

      <h3>Vehicle Information</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Vehicle Type</th>
            <th>Vehicle Score</th>
            <th>Bounding Box</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{result.vehicle.type}</td>
            <td>{result.vehicle.score}</td>
            <td>{`(${result.vehicle.box.xmin}, ${result.vehicle.box.ymin}, ${result.vehicle.box.xmax}, ${result.vehicle.box.ymax})`}</td>
          </tr>
        </tbody>
      </table>

      <h3>Candidates</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Candidate Plate</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {result.candidates.map((candidate, index) => (
            <tr key={index}>
              <td>{candidate.plate}</td>
              <td>{candidate.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Main component where you upload the image and get response from the server
function LicensePlateRecognition() {
  const [imageData, setImageData] = useState(null);
  const [response, setResponse] = useState(null);

  // Function to handle file upload and send it to the server
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      // Replace with your actual API endpoint
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setResponse(data);  // Store the response in the state
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div>
      <h1>License Plate Recognition</h1>
      <input type="file" onChange={handleFileUpload} />
      
      {/* Conditionally render LicensePlateDetails if response is available */}
      {response && <LicensePlateDetails data={response} />}
    </div>
  );
}

export default LicensePlateRecognition;
