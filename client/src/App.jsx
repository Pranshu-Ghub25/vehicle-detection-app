import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter, Routes, Route } from 'react-router-dom';import './App.css'
// import LicensePlateRecognition from './components/LicensePlateRecognition'
// import PlateRecognizerComponent from './components/PlateRecognizerComponent'
import LicensePlateRecognizer from './components/LicensePlateRecognizer'
import OtpAuth from './components/OtpAuth'

function App() {

  return (
    <>
 
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LicensePlateRecognizer />} />
      <Route path="otp-auth" element={<OtpAuth />}>
        
      </Route>
    </Routes>
  </BrowserRouter>

  </>
  )
}

export default App
