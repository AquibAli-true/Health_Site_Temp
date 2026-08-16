import { useState } from "react";
import Loader from "../loader";

const FoodEntry = () => {
  const [inputItemName, setInputItemName] = useState("");
  const [inputWeight, setInputWeight] = useState("");
  const [entryType, setEntryType] = useState("generic");
  const [searchResult, setSearchResult] = useState([]);
  const [meal, setMeal] = useState("");
  const [activeId, setActiveId] = useState("");
  const [displayEntries, setDisplayEntries] = useState([]);


  const [status, setStatus] = useState("idle");
  const [view, setView] = useState("search");
  const [errorMessage, setErrorMessage] = useState("");

  const handleEntrySubmit = async (e) => {
    e.preventDefault();
    if (!meal) {
      setErrorMessage("Pick a meal first.");
      setStatus("error");
      return;
    }
    setStatus("searching");
    setErrorMessage("");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER}/dashboard/food-entry/search?q=${encodeURIComponent(inputItemName)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entryType, meal }),
          credentials: "include",
        },
      );
      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data.message || "Failed to fetch results.");
        setStatus("error");
        return;
      }
      setSearchResult(data);
      setView("search");
      setStatus("idle");
    } catch (err) {
      console.log(err);
      setErrorMessage("Couldn't reach the server. Try again.");
      setStatus("error");
    }
  };

  const handleFoodEntry = async (field, weightAtClick) => {
    setStatus("saving");
    setErrorMessage("");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER}/dashboard/food-entry/save-item`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ field, weight: weightAtClick }),
          credentials: "include",
        },
      );
      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data.message || "Failed to save entry.");
        setStatus("error");
        return;
      }
      setDisplayEntries((prev) => [...prev, data]);
      setView("entries");
      setStatus("idle");
    } catch (err) {
      console.log(err);
      setErrorMessage("Couldn't save that item. Try again.");
      setStatus("error");
    } finally {
      setInputWeight("");
      setActiveId("");
    }
  };

  return (
    <div className="w-full h-150 sm:140 md:h-130 lg:h-140 rounded-lg gap-5 bg-[#f0f5f2] shadow-[0_0_15px_rgba(0,0,0,0.10)] shadow-[#A0BFAC] flex flex-col p-3 sm:p-5  ">
      <div className="flex justify-between  ">
        <div className="flex gap-1 sm:gap-4">
          <button
            type="button"
            onClick={() => setEntryType("generic")}
            className={`sm:p-2 p-1 ${entryType === "generic" ? "bg-(--accent-emerald) text-(--off-white)" : "text-[#717a8e] "} cursor-pointer  font-poppins font-medium  rounded-xl`}
          >
            Generics
          </button>
          <button
            type="button"
            onClick={() => setEntryType("packaged")}
            className={`sm:p-2 p-1 ${entryType === "packaged" ? "bg-(--accent-emerald) text-(--off-white)" : "text-gray-500"} cursor-pointer  font-poppins font-medium rounded-xl`}
          >
            Packaged
          </button>
        </div>

        <button
          type="button"
          className="sm:p-2 p-1 bg-(--accent-coral) font-poppins font-medium cursor-pointer text-white rounded-xl"
        >
          <span className="hidden sm:inline">Custom Entry</span>{" "}
          <span className=" sm:hidden ">Custom</span>
        </button>
      </div>

      <form className="flex flex-col sm:flex-row gap-2 " onSubmit={handleEntrySubmit}>
        <div className="sm:flex-row gap-2 flex-col flex">
          <select
            className="font-nunito px-2 border focus:border-[#10b981] border-[#d3dfd9] text-gray-900 py-2 bg-[#DDE8E2] rounded-lg"
            value={meal}
            onChange={(e) => setMeal(e.target.value)}
          >
            <option value="" disabled hidden>
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
          disabled={status === "searching"}
          className="p-2 bg-(--accent-emerald) font-medium text-(--off-white) font-poppins cursor-pointer rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
          type="submit"
        >
          Search
        </button>
      </form>

      {status === "error" && (
        <div className="text-sm font-nunito text-(--accent-coral) px-1">{errorMessage}</div>
      )}

      <div className="flex gap-2 text-xs font-poppins font-medium">
        <button
          type="button"
          onClick={() => setView("search")}
          className={`px-2 py-1 rounded-lg cursor-pointer ${view === "search" ? "bg-(--accent-emerald) text-(--off-white)" : "text-[#717a8e]"}`}
        >
          Results
        </button>
        <button
          type="button"
          onClick={() => setView("entries")}
          className={`px-2 py-1 rounded-lg cursor-pointer ${view === "entries" ? "bg-(--accent-emerald) text-(--off-white)" : "text-[#717a8e]"}`}
        >
          Added ({displayEntries.length})
        </button>
      </div>

      <div className="flex flex-col gap-2 overflow-x-scroll bg-white shadow-[0_0_15px_rgba(0,0,0,0.15)] shadow-[#DDE8E2] p-5 rounded-lg w-full h-[90%]">
        {status === "searching" || status === "saving" ? (
          <Loader />
        ) : view === "search" ? (
          searchResult.length === 0 ? (
            <div className="text-sm text-gray-400 font-nunito m-auto">No results yet — search for something above.</div>
          ) : (
            searchResult.map((field) => (
              <div
                key={field.itemId}
                className="relative hover:border text-gray-900 font-nunito hover:border-[#10b981] bg-[#f0f5f2] rounded-lg p-2 flex items-center justify-between gap-2"
              >
                <div className="flex flex-col flex-1 min-w-0 pr-2">
                  <div className="font-medium truncate text-sm sm:text-base">{field.itemName}</div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    {Number.isFinite(field.itemCalories) ? Math.trunc(field.itemCalories) : "—"} kcal
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="text"
                    id={`itemWeight-${field.itemId}`}
                    placeholder="g/ml"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={activeId === field.itemId ? inputWeight : ""}
                    onFocus={() => {
                      setActiveId(field.itemId);
                      setInputWeight("");
                    }}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      setInputWeight(value);
                    }}
                    className="bg-[#DDE8E2] font-nunito w-12 py-1.5 px-1 text-center text-sm border focus:border-[#10b981] border-[#d3dfd9] text-[#0e1e19] focus:outline-none focus:ring-0 rounded-lg"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      if (activeId === field.itemId && inputWeight !== "") {
                        handleFoodEntry(field, inputWeight);
                      }
                    }}
                    disabled={!(activeId === field.itemId && inputWeight !== "")}
                    className="p-1.5 cursor-pointer rounded-md bg-[#DDE8E2] hover:bg-[#c3d8cd] transition-colors flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    ➕
                  </button>
                </div>
              </div>
            ))
          )
        ) : displayEntries.length === 0 ? (
          <div className="text-sm text-gray-400 font-nunito m-auto">Nothing added yet today.</div>
        ) : (
          displayEntries.map((field, id) => (
            <div
              key={field._id ?? id}
              className="relative hover:border text-gray-900 font-nunito hover:border-[#10b981] bg-[#f0f5f2] rounded-lg p-2 flex items-center justify-between gap-2"
            >
              <div className="flex flex-col flex-1 min-w-0 pr-2">
                <div className="font-medium truncate text-sm sm:text-base">{field.itemName}</div>
                <div className="text-xs sm:text-sm text-gray-600">
                  {Number.isFinite(field.nutrition?.itemCalories) ? Math.trunc(field.nutrition.itemCalories) : "—"} kcal
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FoodEntry;