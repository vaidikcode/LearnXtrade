import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Home from './pages/Home'

function App() {
  // This would usually come from an authentication context or API
  const [user, setUser] = useState(null)

  return (
    <Router>
      <div className='min-h-screen flex flex-col'>
        <Navbar user={user} />
        <main className='flex-1'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/login' element={<Login />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
