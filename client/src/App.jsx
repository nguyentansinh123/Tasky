import { useState } from 'react'
import './App.css'
import QuickLog from './pages/AuthPage/QuickLog'
import LogIn from './pages/AuthPage/LogIn'
import Register from './pages/AuthPage/Register'
import HomePage from './pages/HomePage/HomePage'
import CreateTask from './pages/CreateTask/CreateTask'
import CreateTaskStep2 from './pages/CreateTask/CreateTaskStep2'
import DetailsStep from './pages/CreateTask/DetailsStep'
import BudgetStep from './pages/CreateTask/BudgetTask'
import MultiStepForm from './pages/CreateTask/MultiStepForm'
import AllTask from './pages/AllTask/AllTask'
import SingleTask from './pages/singleTask/SingleTask'
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar'
import MyTask from './pages/myTask/MyTask'

function App() {
  const location = useLocation();
  const showNavbar = !['/login', '/register'].includes(location.pathname);

  return (
    <>
    {showNavbar && <Navbar />}
    <Routes>
      <Route path='/login' element={<LogIn/>} />
      <Route path='/register' element={<Register/>} />
      <Route path='/' element={<HomePage/>} />
      <Route path='/createTask' element={<MultiStepForm/>} />
      <Route path='/allTask' element={<AllTask/>} />
      <Route path='/singleTask' element={<SingleTask/>} />
      <Route path='/myTask' element={<MyTask/>} />
    </Routes>
    </>
  )
}

export default App
