import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import LoginModal from './components/LoginModal';
function App() {
  return (
    <>
      <Navbar />
      <Landing />
      <LoginModal />
    </>
  );
}

export default App;
