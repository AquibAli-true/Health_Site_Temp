import { useState, useEffect } from "react";
import Loader from "../loader";

const FoodEntry = () => {
  const [inputItemName, setInputItemName] = useState("");
  const [inputWeight, setInputWeight] = useState();
  const [entryType, setEntryType] = useState("generic");
  const [searchResult, setSearchResult] = useState([]);
  const [error, setError] = useState();
  const [meal, setMeal] = useState("");
  const [activeId, setActiveId]= useState('');
  const [block, setBlock] = useState('none');
  const [displayEntries, setDisplayEntries]= useState([]);

  const handleEntrySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER}/dashboard/food-entry/search?q=${inputItemName}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            entryType,
            meal,
          }),
          credentials: "include",
        },
      );
      const data = await response.json();
      if (!response.ok) {
        alert(data.message);
        throw new Error(" Failed to fetch results");
      }
      else{
        setBlock('display-search-results');
      }
      setSearchResult(data);
    } catch (e) {
      setError(e);
    } 
  };

  const handleFoodEntry= async (field)=>{
    try{
      const response = await fetch(
        `${import.meta.env.VITE_SERVER}/dashboard/food-entry/save-item`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            field,
            weight: inputWeight,
          }),
        },
      );
      const data= await response.json();
      if(!response.ok){
        throw new Error('Failed to fetch resources');
      }
      else{
        setBlock('display-entries');
      }
      setDisplayEntries(prev => [...prev, data]);
    }
    catch(e){
      console.log(e);
    }
    finally{
      
      setInputWeight();
    }
  }

  return (
    <div className="w-full h-150 sm:140 md:h-130 lg:h-140 rounded-lg gap-5 bg-[#f0f5f2] shadow-[0_0_15px_rgba(0,0,0,0.10)] shadow-[#A0BFAC] flex flex-col p-3 sm:p-5  ">
      <div className="flex justify-between  ">
        <div className="flex gap-1 sm:gap-4">
          <button
            onClick={() => setEntryType("generic")}
            className={`sm:p-2 p-1 ${entryType === "generic" ? "bg-(--accent-emerald) text-(--off-white)" : "text-[#717a8e] "} cursor-pointer  font-poppins font-medium  rounded-xl`}
          >
            Generics
          </button>
          <button
            onClick={() => setEntryType("packaged")}
            className={`sm:p-2 p-1 ${entryType === "packaged" ? "bg-(--accent-emerald) text-(--off-white)" : "text-gray-500"} cursor-pointer  font-poppins font-medium rounded-xl`}
          >
            Packaged
          </button>
        </div>

        <button className="sm:p-2 p-1 bg-(--accent-coral) font-poppins font-medium cursor-pointer text-white rounded-xl">
          <span className="hidden sm:inline">Custom Entry</span>{" "}
          <span className=" sm:hidden ">Custom</span>
        </button>
      </div>
      <form
        className="flex flex-col sm:flex-row gap-2 "
        onSubmit={(e) => {
          handleEntrySubmit(e);
          setBlock('loading-results');
        }}
      >
        <div className="sm:flex-row gap-2 flex-col flex">
          <select
            className="font-nunito px-2 border focus:border-[#10b981] border-[#d3dfd9] text-gray-900 py-2 bg-[#DDE8E2] rounded-lg"
            onChange={(e) => setMeal(e.target.value)}
          >
            <option value="" disabled selected hidden>
              Meal
            </option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="snacks">Snacks</option>
            <option value="dinner">Dinner</option>
          </select>
          <input
            type="text"
            placeholder="Enter food name"
            value={inputItemName}
            onChange={(e) => setInputItemName(e.target.value)}
            className=" font-nunito px-2 border focus:border-[#10b981] border-[#d3dfd9] text-gray-900 py-2 bg-[#DDE8E2]  focus:outline-none focus:ring-0 rounded-lg"
          />
        </div>
        <button
          disabled={block==='loading-results'}
          className="p-2 bg-(--accent-emerald) font-medium text-(--off-white) font-poppins cursor-pointer rounded-xl"
          type="submit"
        >
          Search
        </button>
      </form>
      <div className='flex flex-col gap-2 overflow-x-scroll bg-white shadow-[0_0_15px_rgba(0,0,0,0.15)] shadow-[#DDE8E2] p-5 rounded-lg w-full h-[90%]'>
        { block==='loading-results'? (<Loader/>) : (block==='display-search-results')?  searchResult.map((field, id) => (
          <div
            key={id}
            className='relative hover:border text-gray-900 font-nunito hover:border-[#10b981] bg-[#f0f5f2] rounded-lg p-2 flex items-center justify-between gap-2'
          >
            <div className="flex flex-col flex-1 min-w-0 pr-2">
              <div className="font-medium truncate text-sm sm:text-base">
                {field.itemName}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">
                {Math.trunc(field.itemCalories)} kcal
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <input
                type="text"
                id={`itemWeight-${id}`}
                placeholder="g/ml"
                inputMode="numeric"
                pattern="[0-9]*"
                value={activeId===field.itemId? inputWeight:''}
                onFocus={()=>{
                    setActiveId(field.itemId);
                    setInputWeight('');
                }}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  setInputWeight(value);
                }}
                className="bg-[#DDE8E2] font-nunito w-12 py-1.5 px-1 text-center text-sm border focus:border-[#10b981] border-[#d3dfd9] text-[#0e1e19] focus:outline-none focus:ring-0 rounded-lg"
              />

              <button
                type="button"
                onClick={()=>{
                  if(inputWeight!==''){
                    setBlock('loading-results')
                  handleFoodEntry(field)
                  }
                }}
                className="p-1.5 cursor-pointer rounded-md bg-[#DDE8E2] hover:bg-[#c3d8cd] transition-colors flex items-center justify-center"
              >
                ➕
              </button>
            </div>
          </div>
        )) :displayEntries.map((field,id)=>(
            <div key={id}
            className='relative hover:border text-gray-900 font-nunito hover:border-[#10b981] bg-[#f0f5f2] rounded-lg p-2 flex items-center justify-between gap-2'
           >
            <div className="flex flex-col flex-1 min-w-0 pr-2">
              <div className="font-medium truncate text-sm sm:text-base">
                {field.itemName}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">
                {Math.trunc(field.nutrition.itemCalories)} kcal
              </div>
            </div>

            </div>
          ))  }
      </div>
    </div>
  );
};

export default FoodEntry;
