import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import FloatingMenu from './components/FloatingMenu';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import WorkshopDetails from './pages/WorkshopDetails';
import Dashboard from './pages/Dashboard';
import Media from './pages/Media';
import Success from './pages/Success';
import Failure from './pages/Failure';
import Profile from './pages/Profile';
import SmoothScroll from './components/SmoothScroll';
import CustomCursor from './components/CustomCursor';

function LayoutWrapper({ children }) {
  const { pathname } = useLocation();
  const isSpecial = pathname === '/' || pathname === '/media';
  
  return (
    <main className={isSpecial ? '' : 'pt-32'}>
      {children}
    </main>
  );
}

function App() {
  return (
    <AuthProvider>
      <SmoothScroll>
        <Router>
          <div className="min-h-screen bg-[#F8F8F8] text-[#111111] cursor-none">
            <CustomCursor />
            <Navbar />
            <LayoutWrapper>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/workshops/:id" element={<WorkshopDetails />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/media" element={<Media />} />
                <Route path="/success" element={<Success />} />
                <Route path="/failure" element={<Failure />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </LayoutWrapper>
            <Toaster position="bottom-right" />
            <FloatingMenu />
          </div>
        </Router>
      </SmoothScroll>
    </AuthProvider>
  );
}

export default App;
