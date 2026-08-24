import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Home'
import AnalysisPage from './AnalysisPage'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/analysis' element={<AnalysisPage/>} />
      </Routes>
    </Router>
  )
}

export default App