import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster, ToastBar, ToastIcon } from 'react-hot-toast';
import { AuthProvider } from './Context/AuthContext';

import Home from './Component/Home';
import Login from './Pages/Auth/Login';
import AdminLogin from './Pages/Auth/AdminLogin';
import Register from './Pages/Auth/Register';
import FilterStationsPage from './ComponentCore/FilterStation';
import StationDetailsPage from './ComponentCore/StationDetails';
import GoogleMapp from './MINIAPI/GoogleMap';
import Map from './Charging/Map';
import Upload from './UploadStation/Upload';
import Booking from './Pages/Booking/Booking.jsx';
import Dashboard from './Pages/Dashboard/Dashboard';
import Features from './ComponentCore/Features.jsx';
import Chatbot from './Component/Chatbot';
import AdminPanel from './Pages/AdminPanel';

const App = () => {
  // Login Control 
  // const [isLoading, setIsLoading] = useState(false);

  // console.log("Hello"); 

  return (

    <div className='App'>
      <AuthProvider>
        <Toaster position="top-center" reverseOrder={false} />
        <Chatbot />

        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/admin-login' element={<AdminLogin />}></Route>
          <Route path='/register' element={<Register />}></Route>

          <Route path='/dashboard' element={<Dashboard />}></Route>
          <Route path='/upload' element={<Upload />}></Route>
          <Route path='/features' element={<Features />}></Route>
          <Route path='/admin' element={<AdminPanel />}></Route>

          <Route path='/filter/Stations' element={<FilterStationsPage />}></Route>
          <Route path='/map/GoogleMapp' element={<Map />}></Route>

          <Route path='/map/googlemap/evstation/booking' element={<Booking />}></Route>

          <Route path='/station/:stationId' element={<StationDetailsPage />}></Route>
        </Routes>
      </AuthProvider>
    </div>

  )
}

export default App;