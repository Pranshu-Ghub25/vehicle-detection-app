import React, { useState } from "react";
import QrScanner from "react-qr-scanner";

function QRReader() {
  const [scannedData, setScannedData] = useState("");

  const handleScan = (data) => {
    if (data) {
      setScannedData(data.text);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const previewStyle = {
    height: 240,
    width: 320,
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>QR Code Reader</h1>
      <QrScanner
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={previewStyle}
        facingMode="rear" // Use back camera
      />
      {scannedData && (
        <div>
          <h3>Scanned Data:</h3>
          <p>{scannedData}</p>
        </div>
      )}
    </div>
  );
}

export default QRReader;
