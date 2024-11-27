import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LicensePlateRecognition from './components/LicensePlateRecognition'
// import PlateRecognizerComponent from './components/PlateRecognizerComponent'
import LicensePlateRecognizer from './components/LicensePlateRecognizer'

function App() {
  const [count, setCount] = useState(0)

  return (
  //  <LicensePlateRecognition/>
  // <PlateRecognizerComponent/>
  <LicensePlateRecognizer/>
  // <LicensePlateRecognition/>
  )
}

export default App
