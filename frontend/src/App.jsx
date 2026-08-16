
import './App.css'
import { Routes, Route } from 'react-router-dom'
import About from './landing_page/about'
import LandLayout from './Layout/landLayout'
import Landing from './landing_page/landing'
import SignUp from './user/signUp'
import LogIn from './user/logIn'
import Home from './dashboard_pages/home'
import Dashboard from './dashboard_pages/dashboard_comp/dashboard'
import Profile from './dashboard_pages/dashboard_comp/profile'
import OTP from './user/otp'
import Chatbot from './dashboard_pages/dashboard_comp/chatbot'
import Scanner from './scanner'


function App() {


  return (
    <>
    <Routes>
      <Route path='/' element={<LandLayout/>}>
        <Route index element={<Landing/>} />
        <Route path='/about' element={<About/>}/>
        <Route path='/sign-up' element={<SignUp/>}/>
        <Route path='/log-in' element={<LogIn/>}/>
        <Route path='/auth-otp' element={<OTP/>}/>
      </Route>
      <Route path='/home' element={<Home/>}>
      <Route index element={<Dashboard/>}/>
      <Route path='profile' element={<Profile/>}/>
      <Route path='scanner' element={<Scanner/>}/>
      <Route path='ai' element={<Chatbot/>}/>
      </Route>
    </Routes>
    </>
  )
}

export default App
