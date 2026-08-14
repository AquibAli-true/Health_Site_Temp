import Navbar from "../components/navbar"
import {Outlet} from 'react-router-dom'
import {useNavigate} from 'react-router-dom'
import { useEffect, useState } from "react"

const LandLayout = () => {
    const navigate = useNavigate();
    const [checking, setChecking] = useState(true); 

  // useEffect(() => {
  //   console.log("checking auth");
  //   const checkAuth = async () => {
  //     try {
  //       const response = await fetch(import.meta.env.VITE_SERVER + '/verify', {
  //         method: 'GET',
  //         credentials: 'include' 
  //       });
  //       console.log("response", response);
  //       const result = await response.json();
  //       if (response.ok && result.authenticated) {
  //         navigate('/home');
  //       } else {
  //         setChecking(false); 
  //       }
  //     } catch (error) {
  //       console.log(error);
  //       setChecking(false);
  //     }
  //   };
  //   checkAuth();
  // }, [navigate]); 
  // if (checking) {
  //   return null;}

  return (
    <div >
    <Navbar/>
    <main className="w-full bg-[#FFFCF6]">
        <Outlet/>
    </main>
    
    </div>
  )
}

export default LandLayout