import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import menuIcon from '../assets/svg/menu_icon_sidebar.svg';
import crossIcon from '../assets/svg/cross_sidebar.svg';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const logOut = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_SERVER + '/log-out', {
        method: 'POST',
        credentials: 'include'
      });
      if (response.ok && response.status === 200) {
        navigate('/');
      } else {
        console.error('Failed to log out');
      }

    } catch (error) {
      console.error('Error occurred while logging out:', error);
    }
  };

  const navItems = [
    { 
      name: 'Profile', 
      path: '/home/profile', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    { 
      name: 'Scan', 
      path: '/home/scanner', 
      icon: (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7V5a2 2 0 012-2h2m10 0h2a2 2 0 012 2v2m0 10v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2m1-7h16" />
  </svg>
)
    },
    { 
      name: 'Dashboard', 
      path: '/home', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      name: 'Ask AI', 
      path: '/home/ai', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    { 
      name: 'Log Out', 
      path: '/home/log-out', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      )
    },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`md:hidden fixed top-3 cursor-pointer z-50 p-1 text-(--off-white) transition-all duration-300 ease-in-out ${
          isOpen ? 'left-52' : 'left-3  rounded-md'
        }`}
      >
        <img className={`w-8 h-8 ${isOpen? 'bg-white': 'bg-none'} `} src={isOpen? crossIcon:menuIcon} alt={isOpen? 'close menu':'open menu'} />
      </button>

      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-(--bg-sidebar) flex flex-col transition-transform duration-300 ease-in-out 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0`}
      >
        <div className="flex items-center h-24 px-8">
          <span className="text-2xl font-semibold text-(--text-sidebar) font-arizonia tracking-widest">
            Nutrition Nerd
          </span>
        </div>

        <nav className="flex-1 mt-2 flex flex-col gap-2 pl-4">
          {navItems.map((item) => {
            if (item.name === 'Log Out') {
              return (
                <button
                  key={item.name}
                  onClick={logOut}
                  className="flex items-center w-full gap-4 py-4 px-6 transition-all duration-200 rounded-l-full font-medium 
                  text-gray-300 bg-transparent cursor-pointer text-left
                  hover:bg-(--bg-sidebar-hover) hover:text-(--bg-sidebar)"
                >
                  {item.icon}
                  <span className="text-sm uppercase font-poppins tracking-wider">{item.name}</span>
                </button>
              );
            }

            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-4 py-4 px-6 transition-all duration-200 rounded-l-full font-medium 
                  text-gray-300 bg-transparent
                  hover:bg-(--bg-sidebar-hover) hover:text-(--bg-sidebar) 
                  ${isActive ? 'text-(--bg-sidebar)' : ''}`
                }
              >
                {item.icon}
                <span className="text-sm uppercase font-poppins tracking-wider">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </>
  );
}