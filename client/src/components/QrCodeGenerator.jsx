import React, { useState } from "react";
import QrScanner from "react-qr-scanner"; // Import QR Scanner component

function QrCodeGenerator() {
  const [text, setText] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [scannedData, setScannedData] = useState("");

  // Generate QR Code
  const generateQRCode = async () => {
    try {
      const response = await fetch("https://vehicle-detection-app-3j4y.onrender.com/generate-qr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      if (response.ok) {
        setQrCode(data.qrCodeData); // Set QR code data URL
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("Error generating QR code");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>QR Code Generator and Reader</h1>

      {/* QR Code Generator */}
      <div>
        <input
          type="text"
          placeholder="Enter text or URL"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ padding: "10px", width: "300px" }}
        />
        <br />
        <br />
        <button onClick={generateQRCode} style={{ padding: "10px 20px" }}>
          Generate QR Code
        </button>
        <br />
        <br />
        {qrCode && (
          <div>
            <h3>Your QR Code:</h3>
            <img src={qrCode} alt="Generated QR Code" />
            <br />
            <button
              onClick={() => {
                const a = document.createElement("a");
                a.href = qrCode;
                a.download = "qrcode.png";
                a.click();
              }}
              style={{ padding: "10px 20px", marginTop: "10px" }}
            >
              Download QR Code
            </button>
          </div>
        )}
      </div>

      <hr style={{ margin: "40px 0" }} />

      {/* QR Code Reader */}
      {/* <div>
        <h2>QR Code Reader</h2>
        <QrScanner
          delay={300}
          onError={(err) => alert(`Error reading QR code: ${err.message}`)}
          onScan={(data) => data && setScannedData(data.text)}
          style={{ width: "300px", margin: "auto" }}
        />
        <br />
        {scannedData && (
          <div>
            <h3>Scanned Data:</h3>
            <p>{scannedData}</p>
          </div>
        )}
      </div> */}
    </div>
  );
}

export default QrCodeGenerator;
