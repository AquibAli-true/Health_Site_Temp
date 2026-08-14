import { NavLink } from 'react-router-dom';
import heroImg from '../assets/image/notSure.jpg';

const Hero = () => {
  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row items-center justify-center gap-10 bg-(--global-dark-theme) lg:p-20 md:p-12 p-6">
      
      <div className="flex flex-col items-center lg:items-start gap-6 lg:gap-8 w-full lg:w-1/2 text-center lg:text-left">
        <div className="flex flex-col gap-4 lg:gap-5">
          <h1 className="text-(--off-white) font-bold lg:font-extrabold tracking-tight font-poppins text-4xl md:text-5xl lg:text-6xl leading-tight">
            Science Based Nutrition tracking at your fingertips
          </h1>
          <p className="font-lato text-(--off-white)/70 text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
            From macros to micros, Diet+ gives you personalized insights about your diet, food products, and health. 
            We help you take care of your health, organize your diet, and track your progress.
          </p>
        </div>
        
        <NavLink 
          to='/sign-up' 
          className='inline-flex items-center justify-center bg-[#2DD4BF] hover:bg-(--off-white) hover:text-(--global-dark-theme) text-white font-semibold py-3 px-8 rounded-full transition-all duration-200 min-w-40'
        >
          Sign Up
        </NavLink>
      </div>

      <div className="w-full sm:w-[80%] md:w-[60%] lg:w-1/2 flex justify-center items-center">
        <img 
          src={heroImg} 
          alt="Nutrition tracking preview" 
          className="w-full h-auto object-cover rounded-4xl shadow-2xl"
        />
      </div>

    </div>
  );
};

export default Hero;