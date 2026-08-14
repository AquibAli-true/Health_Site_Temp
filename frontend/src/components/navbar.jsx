
import { NavLink} from 'react-router-dom';


const Navbar = () => {
  return (
    <div className='flex items-center sm:px-8 py-5 px-5 justify-between w-full  text-(--off-white) bg-[#141417]'>
        <NavLink to='/' className='text-3xl tracking-[4px] font-arizonia text-white font-bold '>Diet+</NavLink>
        <div className='flex md:gap-8 gap-5 items-center font-lato text-(--off-white)'>
          <NavLink to='/about'  className='hidden sm:block'>About Us</NavLink>
          <NavLink to='/log-in'>Log In</NavLink>
          <NavLink to='/sign-up' className='border py-2 px-4 font-semibold hover:bg-(--off-white) hover:text-(--global-dark-theme) rounded-3xl' >Sign Up</NavLink>
        </div>
    </div>
  )
}

export default Navbar