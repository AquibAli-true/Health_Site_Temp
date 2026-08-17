import { useState, useEffect, createContext } from "react";
import NutritionProgress from "../../components/dashboard/nutritionProgress";
import WeightTrend from "../../components/dashboard/WeightTrend";
import FoodEntry from "../../components/dashboard/foodEntry";


const Dashboard = () => {
  
  const [currentDate, setCurrentDate] = useState("");
  const [isTargetOpen, setIsTargetOpen] = useState(false);
  const [dailyUserData, setDailyUserData] = useState({});

  useEffect(() => {
    const today = new Date();
    const dateString =
      today.getFullYear() +
      "-" +
      String(today.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(today.getDate()).padStart(2, "0");
      setCurrentDate(dateString);
  },[]);

 useEffect(() => {
  const initialize = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER}/dashboard/initialize-page`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentDate,
          }),
          credentials: "include",
        },
      );

      if(response.ok){
        const data = await response.json();
      setDailyUserData(data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const initializeUserItemSubmissions = async ()=>{
    try{
      const response= await fetch(`${import.meta.env.VITE_SERVER}/dashboard/get_item_submissions`,{
        method: 'POST',
        headers: {
          'Content-Type':'application/json',
        },
        body:
          JSON.stringify({
            currentDate,
          })
        
      });

      if(response.ok){
        const data = await response.json();
      }

  }
  catch(e){
      console.log(e);
    }

 
}
 if (currentDate) {
    initialize();
    initializeUserItemSubmissions();
  }



}, [currentDate]);

  return (
    <div className="flex h-screen bg-(--bg-main) relative">
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 flex flex-col overflow-y-auto p-4 pt-16 lg:p-8 lg:pt-8 lg:border-r border-gray-200">
          <div className="flex mb-8 justify-between">
            <input
              type="date"
              onChange={(e)=>(setCurrentDate(e.target.value))}
              value={currentDate}
              className=" bg-[#f0f5f2] focus:outline-none focus:ring-0 shadow-[0_0_15px_rgba(0,0,0,0.1)] shadow-[#A0BFAC] rounded-xl p-2 cursor-pointer border border-[#10b981]  "
            />
            <button className="cursor-pointer p-2 font-medium font-poppins bg-(--accent-coral) rounded-xl text-white ">
              Set Target
            </button>
          </div>
       

          <div className="mb-8"><NutritionProgress  userData={dailyUserData} /></div>

          <div className="mb-8">
            <FoodEntry />
          </div>

          <div className="h-64 shrink-0 mb-8 lg:mb-0">
            <WeightTrend />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-full hidden xl:block xl:w-96 bg-gray-50 flex flex-col shrink-0 min-h-75 lg:min-h-0 border-t lg:border-t-0 lg:border-l border-gray-200">
          <div className="p-8 h-full flex flex-col justify-start items-stretch">
            (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-full">
                  Inspector
                </span>
                <h3 className="text-2xl font-bold text-gray-900 mt-2 wrap-break-words"></h3>
              </div>

              <div className="grid grid-cols-2 gap-3"></div>
              <button className="w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium text-xs transition">
                Clear Selection
              </button>
            </div>
            ) : (
            <div className="my-auto text-gray-400 text-center">
              <svg
                className="w-12 h-12 mx-auto mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <p className="font-medium text-gray-700">
                [ Nutrition Inspector]
              </p>
              <p className="text-sm mt-1 max-w-xs mx-auto">
                Detailed overview here.
              </p>
            </div>
            )
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
