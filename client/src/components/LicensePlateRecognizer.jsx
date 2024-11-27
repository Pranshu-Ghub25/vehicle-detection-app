import React, { useState } from "react";

function LicensePlateRecognizer() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const[error,setError]=useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("upload", image); // Append image to form data

    try {
      const response = await fetch("http://localhost:5000/upload-image", { // Backend endpoint
        method: "POST",
        headers: {
          "Authorization": "Token a0cfbcf793ba3d11ae5eeb008c7f75f92bb0d813", // Use your actual API Token here
        },
        body: formData,
      });

      if (response.ok) {
        const json = await response.json();
        setError(false);
        setResult(json); // Save the result to state to display in UI
      } else {
        setError(true);
        console.error("Failed to process image.");
      }
    } catch (error) {
      setError(true);
      console.error("Error:", error);
    }
  };

  // Render table for the result data
  const renderLicensePlateDetails = () => {
    if (!result) return null;

    const { processing_time, results, filename, timestamp, image_width, image_height } = result;
    const resultData = results[0]; // Assuming one result

    return (
      
      <div style={{display:'flex',alignItems:'center',flexDirection:'column'}}>
        <h3>License Plate Recognition Details</h3>
       
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>Category</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Processing Time</td><td>{processing_time} seconds</td></tr>
            <tr><td>Filename</td><td>{filename}</td></tr>
            <tr><td>Timestamp</td><td>{timestamp}</td></tr>
            <tr><td>Image Width</td><td>{image_width}</td></tr>
            <tr><td>Image Height</td><td>{image_height}</td></tr>
          </tbody>
        </table>

        <h4>Plate Recognition</h4>
        {resultData.plate &&
        <table border="1" cellPadding="5">
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
              <td>{resultData.plate}</td>
              <td>{resultData.region.code}</td>
              <td>{resultData.score}</td>
              <td>{`(${resultData.box.xmin}, ${resultData.box.ymin}, ${resultData.box.xmax}, ${resultData.box.ymax})`}</td>
            </tr>
          </tbody>
        </table>}

        <h4>Vehicle Information</h4>
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>Vehicle Type</th>
              <th>Vehicle Score</th>
              <th>Bounding Box</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{resultData.vehicle.type}</td>
              <td>{resultData.vehicle.score}</td>
              <td>{`(${resultData.vehicle.box.xmin}, ${resultData.vehicle.box.ymin}, ${resultData.vehicle.box.xmax}, ${resultData.vehicle.box.ymax})`}</td>
            </tr>
          </tbody>
        </table>

        <h4>Candidates</h4>
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>Candidate Plate</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {resultData.candidates.map((candidate, index) => (
              <tr key={index}>
                <td>{candidate.plate}</td>
                <td>{candidate.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <h1>License Plate Recognizer</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        <button type="submit">Submit</button>
      </form>

      {result && !error && renderLicensePlateDetails()}
      
    </div>
  );
}

export default LicensePlateRecognizer;
