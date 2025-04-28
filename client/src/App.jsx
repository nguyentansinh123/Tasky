import React, { useEffect } from 'react';
import { useState } from 'react';
import './App.css';
import LogIn from './pages/AuthPage/LogIn';
import Register from './pages/AuthPage/Register';
import HomePage from './pages/HomePage/HomePage';
import MultiStepForm from './pages/CreateTask/MultiStepForm';
import AllTask from './pages/AllTask/AllTask';
import SingleTask from './pages/singleTask/SingleTask';
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import MyTask from './pages/myTask/MyTask';
import NotificationPage from './pages/notificationPage/NotificationPage';
import ContactPage from './pages/contactPage/ContactPage';
import TaskDetails from './pages/taskDetails/TaskDetails';
import ChatApp from './pages/ChatApp/ChatApp';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/useAuthStore';
import ProtectedRoute from './pages/lib/ProtectedRoute';
import UserProfile from './pages/profile/UserProfile';
import TaskUserProfile from './pages/profile/TaskUserProfile';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  const location = useLocation();
  const showNavbar = !['/login', '/register'].includes(location.pathname);
  const { checkAuth, isChekingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isChekingAuth) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <>
      <Toaster position="top-center" />
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />

        <Route path="/createTask" element={
          <ProtectedRoute>
            <MultiStepForm />
          </ProtectedRoute>
        } />
        <Route path="/allTask" element={
          <ProtectedRoute>
            <AllTask />
          </ProtectedRoute>
        } />
        <Route path="/singleTask" element={
          <ProtectedRoute>
            <SingleTask />
          </ProtectedRoute>
        } />
        <Route path="/myTask" element={
          <ProtectedRoute>
            <MyTask />
          </ProtectedRoute>
        } />
        <Route path="/notification" element={
          <ProtectedRoute>
            <NotificationPage />
          </ProtectedRoute>
        } />
        <Route path="/task/:id" element={
          <ProtectedRoute>
            <TaskDetails />
          </ProtectedRoute>
        } />
        <Route path="/chat" element={
          <ProtectedRoute>
            <ChatApp />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } />
        <Route path="/profile/:userId" element={
          <UserProfile />
        } />
        <Route path="/task-user/:userId" element={
          <ProtectedRoute>
            <TaskUserProfile />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>


        

    </>
  );
}

export default App;
