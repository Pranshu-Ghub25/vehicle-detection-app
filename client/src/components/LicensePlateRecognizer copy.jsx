import React, { useState } from "react";

function LicensePlateRecognizer() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

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
        setResult(json); // Save the result to state to display in UI
      } else {
        console.error("Failed to process image.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
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

      {result && (
        <div>
          <h3>Results:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default LicensePlateRecognizer;
