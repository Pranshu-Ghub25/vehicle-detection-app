import React, { useState } from 'react';

function QrCodeGenerator() {
  const [text, setText] = useState('');
  const [qrCode, setQrCode] = useState('');

  const generateQRCode = async () => {
    try {
      const response = await fetch('http://localhost:5000/generate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
      alert('Error generating QR code');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>QR Code Generator</h1>
      <input
        type="text"
        placeholder="Enter text or URL"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ padding: '10px', width: '300px' }}
      />
      <br /><br />
      <button onClick={generateQRCode} style={{ padding: '10px 20px' }}>
        Generate QR Code
      </button>
      <br /><br />
      {qrCode && (
        <div>
          <h3>Your QR Code:</h3>
          <img src={qrCode} alt="Generated QR Code" />
        </div>
      )}
    </div>
  );
}

export default QrCodeGenerator;
