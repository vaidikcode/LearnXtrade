import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Dashboard from './pages/Dashboard'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Home from './pages/Home'
import TeacherDashboard from './pages/TeacherDashboard'
import CourseDetail from './pages/CourseDetail'

function App() {
  // This would usually come from an authentication context or API
  const [user, setUser] = useState(null)

  return (
    <Router>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/login' element={<Login />} />
            <Route path='/teacher-dashboard' element={<TeacherDashboard/>} />
            <Route path='/course/:courseId' element={<CourseDetail />} />
          </Routes>
    </Router>
  )
}

export default App
