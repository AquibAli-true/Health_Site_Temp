import { useState, useEffect, useRef } from "react";
import NutritionProgress from "../../components/dashboard/nutritionProgress";
import WeightTrend from "../../components/dashboard/WeightTrend";
import FoodEntry from "../../components/dashboard/foodEntry";
import TargetModal from "./targetModal";


const Dashboard = () => {
  
  const [currentDate, setCurrentDate] = useState("");
  const [isTargetOpen, setIsTargetOpen] = useState(false);
  const [dailyUserData, setDailyUserData] = useState({});
  const [foodEntries,setFoodEntries] = useState([]);
  const [changedBarData, setChangedBarData] = useState(0);
  const [weightHistory, setWeightHistory] = useState([]);

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
          }),
          credentials:'include',
      });
      if(response.ok){
        const data = await response.json();
        console.log(data);
        setFoodEntries(data);
      }

  }
  catch(e){
      console.log(e);
    }

 
}
 if (currentDate) {
    initializeUserItemSubmissions();
  }



}, [currentDate, changedBarData]);


useEffect(() => {

    const initializeDailyBars = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER}/dashboard/initialize-daily-bars`,
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
        console.log(data)
      setDailyUserData(data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  if(currentDate){
    initializeDailyBars();
  }
  
}, [currentDate,foodEntries]);


  // Weight history is not scoped to currentDate — it's a rolling trend,
  // not a per-day lookup like foodEntries/dailyUserData — so it fetches
  // once on mount rather than joining the currentDate-dependent effects above.
  useEffect(() => {
    const initializeWeightHistory = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER}/dashboard/weight-history`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setWeightHistory(data);
        }
      } catch (e) {
        console.log(e);
      }
    };

    initializeWeightHistory();
  }, []);

  const handleLogWeight = async (entry) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER}/dashboard/log-weight`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(entry),
          credentials: "include",
        }
      );

      if (response.ok) {
        const saved = await response.json();
        // upsert semantics on the backend: same-day log overwrites the
        // existing entry instead of appending a duplicate point
        setWeightHistory((prev) => {
          const withoutToday = prev.filter((e) => e.date !== saved.date);
          return [...withoutToday, saved];
        });
      }
    } catch (e) {
      console.log(e);
    }
  };


  return (
    <div className="flex h-screen bg-(--bg-main) relative">
      <TargetModal isOpen={isTargetOpen} setChangedBarData={setChangedBarData} setIsOpen={setIsTargetOpen} currentDate={currentDate} />
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 flex flex-col overflow-y-auto p-4 pt-16 lg:p-8 lg:pt-8 lg:border-r border-gray-200">
          <div className="flex mb-8 justify-between">
            <input
              type="date"
              onChange={(e)=>(setCurrentDate(e.target.value))}
              value={currentDate}
              className=" bg-[#f0f5f2] focus:outline-none focus:ring-0 shadow-[0_0_15px_rgba(0,0,0,0.1)] shadow-[#A0BFAC] rounded-xl p-2 cursor-pointer border border-[#10b981]  "
            />
            <button onClick={()=>setIsTargetOpen(true)}  className="cursor-pointer p-2 font-medium font-poppins bg-(--accent-coral) rounded-xl text-white ">
              Set Target
            </button>
          </div>
       

          <div className="mb-8"><NutritionProgress  userData={dailyUserData} /></div>

          <div className="mb-8">
            <FoodEntry userEntries={foodEntries} currentDate={currentDate} setUserEntries={setFoodEntries} />
          </div>

          <div className="h-64 shrink-0 mb-8 lg:mb-0">
            <WeightTrend data={weightHistory} onLogWeight={handleLogWeight} />
          </div>
        </div>

        
        <div className="w-full hidden xl:block xl:w-96 bg-gray-50 flex flex-col shrink-0 min-h-75 lg:min-h-0 border-t lg:border-t-0 lg:border-l border-gray-200">
          <div className="p-8 h-full flex flex-col justify-start items-stretch">
            <div className="my-auto text-gray-400 text-center">
           
              <p className="font-medium text-gray-700">
            
              </p>
              <p className="text-sm mt-1 max-w-xs mx-auto">
             
              </p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;