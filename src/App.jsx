import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Movies from './pages/Movies'
import MovieDetails from './pages/MovieDetails'
import Favourite from './pages/Favourite'
import SeatLayout from './pages/SeatLayout'
import MyBookings from './pages/MyBookings'
import {Toaster} from 'react-hot-toast'
import Footer from './components/Footer'


const App = () => {
  const isAdminRoute = useLocation().pathname.startsWith('/admin') 

  return (
    <>
      <Toaster/>
      {!isAdminRoute && <Navbar/>}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/movies' element={<Movies />} />
        <Route path='/movies/:id' element={<MovieDetails />} />
        <Route path='/movies/:id/:date' element={<SeatLayout />} />
        <Route path='/my-bookings' element={<MyBookings/>} />
        <Route path="/favourite" element={<Favourite />} />
      </Routes>
      {!isAdminRoute && <Footer/>}
    </>
  )
}

export default App