import {useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom';

const OTP = () => {
  const [value,setValue] = useState(["","","","","",""]);
  const [isWrong,setIsWrong]= useState(false);
  const domRef= useRef([]);
  const Navigate= useNavigate();
  const [canResend, setCanResend]= useState(true);
  const disableResend=()=>{
    setTimeout(()=>{
      setCanResend(true);
    },(2*60*1000))
  }

  const handleResend= async ()=>{
    if(!canResend) return;
    try{
      const response= await fetch(import.meta.env.VITE_SERVER + '/resend-otp',{
        method:'POST',
        credentials:'include'
      })
      if(response.ok){ 
        setCanResend(false);
        disableResend();
      }
      
    }
    catch(err){
      console.log(err);
    }
  }

  const handleSubmit= async ()=>{
    try{
    const response = await fetch(import.meta.env.VITE_SERVER + '/verify-otp',{
      method:'POST',
      headers:{
        'Content-Type': 'text/plain'
      },
      credentials:'include',
      body:value.join('')
    })
    if(response.status==409) setIsWrong(true);
    if(response.ok){
      console.log(response.message)
      Navigate('/home');
    }
    } catch(e){
      console.log(e);
    }
  }

  const handleInput=(digit,index)=>{
    if (!/^\d?$/.test(digit)) return;

    const otp= [...value];
    otp[index]=digit;
    setValue(otp);

    if(index<otp.length-1 && digit){
      domRef.current[index+1].focus();
    }
  };

  const handleKeyDown=(e,index)=>{
    if(e.key!=='Backspace') return;
    if(!value[index] && index>0){
      domRef.current[index-1].focus();
    }
  };
  return (
    <div className="w-full h-full flex justify-center bg-(--off-white) lg:py-25 md:py-20 py-15">
      <div className="flex flex-col lg:p-7 p-3 md:px-3 md:py-7 items-center justify-center bg-white shadow-(--global-dark-theme) shadow-2xl w-[clamp(320px,35vw,800px)] h-[clamp(200px,50vh,600px)] rounded-lg  ">
        <div className="flex flex-col justify-center items-center gap-3">
        <h1 className="md:text-2xl text-xl text-(--global-dark-theme) font-bold  ">Verify OTP</h1>
        <p className="text-(--global-dark-theme)/80  ">Enter the six digit code sent to your email</p>
        </div>
        <div className="flex lg:gap-5 mx-5 md:mx-0 gap-3 my-5 justify-center items-center w-full ">
          {
            value.map((digit,index)=>(
            <input  
              className=" p-3 border outline-none rounded-md border-blue-400 focus:shadow-blue-400 focus:shadow-sm w-9 h-11  " 
              maxLength={1}
              key={index}
              value={digit} 
              type="text"
              ref={(e)=>(domRef.current[index]=e)}
              onChange={(e)=>(handleInput(e.target.value,index))}
              onKeyDown={(e)=>(handleKeyDown(e,index))} />
          ))
         }

        </div>
        <div className=' flex flex-col pt-4 lg:p-2 justify-center items-center gap-2  '>
        <button onClick={handleSubmit} className='py-2 px-1 w-[35%] bg-blue-400 cursor-pointer font-medium font-poppins rounded-2xl hover:border hover:border-(--global-dark-theme) ' >Submit</button>
        <button disabled={!canResend} onClick={handleResend} className=' cursor-pointer font-nunito text-(--global-dark-theme)/80 text-md  ' > {canResend? "Didn't receive it? Resend OTP.":"Wait 2 mins to try again" } </button>
        <p className='ont-nunito text-red-500 text-md' > {isWrong? 'Wrong OTP entered':''} </p>
        </div>
      </div>
    </div>
  )
}

export default OTP