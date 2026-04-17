import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import FindEv from '../ComponentCore/FindEv';
import Hero from '../ComponentCore/Hero'
import Core from '../ComponentCore/Core'
import Testimonials from '../ComponentCore/Testimonial'
import EvMap from '../ComponentCore/EvMap';
import About from '../ComponentCore/About.jsx';



const Home = () => {
  const [showLogin, setShowLogin] = useState(false);
  const toggleLogin = () => {
    setShowLogin(prev => !prev);
  }


  return (
    <div>

      <Navbar onLoginClick={toggleLogin} />

      {showLogin && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">

          <LoginModal onClose={toggleLogin} />
        </div>
      )}

      <Hero />
      <EvMap />
      <FindEv />
      <br />
      <br />

      {/* <About /> */}

      <Core />
      <Testimonials />
      <Footer />
    </div>
  )
}

export default Home;