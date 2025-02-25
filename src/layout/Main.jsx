import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/landingPage/Navbar';
import Footer from '../components/landingPage/Footer';
import LandingPage from '../pages/LandingPage';

const Main = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1 }}>
        <LandingPage/>
      </div>
      <Footer />
    </div>
  );
};

export default Main;