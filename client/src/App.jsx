import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter, Routes, Route } from 'react-router-dom';import './App.css'
// import LicensePlateRecognition from './components/LicensePlateRecognition'
// import PlateRecognizerComponent from './components/PlateRecognizerComponent'
import LicensePlateRecognizer from './components/LicensePlateRecognizer'
import OtpAuth from './components/OtpAuth'
import QrCodeGenerator from './components/QrCodeGenerator';

function App() {
  const [activeComponent, setActiveComponent] = useState('LicensePlateRecognizer');

  return (
    <div>
      {/* Navigation Buttons */}
      <div className="button-group">
        <button
          onClick={() => setActiveComponent('LicensePlateRecognizer')}
          className="btn"
        >
          License Plate Recognizer
        </button>
        <button
          onClick={() => setActiveComponent('OtpAuth')}
          className="btn"
        >
          OTP Authentication
        </button>
        <button
          onClick={() => setActiveComponent('QrCode')}
          className="btn"
        >
         Qr Code Generator
        </button>
      </div>

      {/* Render Components Based on Active State */}
      <div className="component-container">
        {activeComponent === 'LicensePlateRecognizer' && <LicensePlateRecognizer />}
        {activeComponent === 'OtpAuth' && <OtpAuth />}
        {activeComponent === 'QrCode' && <QrCodeGenerator/>}
      </div>
    </div>
  );
}
export default App
