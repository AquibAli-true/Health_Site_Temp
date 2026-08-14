import { useState, useEffect } from 'react';
import DailyOverview from '../../components/dashboard/dailyOverview';
import FoodLogger from '../../components/dashboard/FoodLogger'; 
import WeightTrend from '../../components/dashboard/WeightTrend';
import FoodEntry from '../../components/dashboard/foodEntry';

const Dashboard = () => {
    const getTodayString = () => new Date().toISOString().split('T')[0];

    const [currentDate, setCurrentDate] = useState(getTodayString());
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFood, setSelectedFood] = useState(null);

    const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
    const [targetForm, setTargetForm] = useState({ calories: 0, protein: 0 });
    const [isSavingTargets, setIsSavingTargets] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch(import.meta.env.VITE_SERVER +  `/dashboard?date=${currentDate}`, {
                    method: 'GET',
                    credentials: 'include', 
                });

                if (!response.ok) {
                    if (response.status === 401) throw new Error('Unauthorized. Please log in.');
                    throw new Error('Failed to fetch dashboard data');
                }

                const data = await response.json();
                setDashboardData(data);
                
                setTargetForm({
                    calories: data.targetCalories || 2000,
                    protein: data.targetProtein || 150
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
        setSelectedFood(null); 
    }, [currentDate]);

    const changeDate = (daysToAdd) => {
        const dateObj = new Date(currentDate);
        dateObj.setDate(dateObj.getDate() + daysToAdd);
        setCurrentDate(dateObj.toISOString().split('T')[0]);
    };

    const handleSaveTargets = async (e) => {
        e.preventDefault();
        setIsSavingTargets(true);
        try {
            const response = await fetch(import.meta.env.VITE_SERVER + '/dashboard/targets', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    date: currentDate,
                    targetCalories: targetForm.calories,
                    targetProtein: targetForm.protein
                })
            });

            if (!response.ok) throw new Error('Failed to update targets');
            const updatedData = await response.json();
            
            setDashboardData(prev => ({
                ...prev,
                targetCalories: updatedData.targetCalories,
                targetProtein: updatedData.targetProtein
            }));
            setIsTargetModalOpen(false);
        } catch (err) {
            alert(err.message);
        } finally {
            setIsSavingTargets(false);
        }
    };
    
const handleFoodLogged = async () => {
    try {
        const response = await fetch(import.meta.env.VITE_SERVER  + `/dashboard?date=${currentDate}`, {
            credentials: 'include',
        });
        if (response.ok) {
            const data = await response.json();
            setDashboardData(data);
        }
    } catch (err) {
        console.error('Failed to refresh dashboard:', err);
    }
};

    if (loading && !dashboardData) {
        return (
            <div className="flex h-screen items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

const allLoggedFoods = dashboardData?.meals
    ? [
        ...(dashboardData.meals.breakfast || []),
        ...(dashboardData.meals.lunch || []),
        ...(dashboardData.meals.dinner || []),
        ...(dashboardData.meals.snacks || []),
      ]
    : [];

    const isToday = currentDate === getTodayString();
    const displayDate = new Date(currentDate).toLocaleDateString(undefined, { 
        weekday: 'long', month: 'short', day: 'numeric' 
    });

    return (
        <div className="flex h-screen bg-(--bg-main) relative">
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">

                <div className="flex-1 flex flex-col overflow-y-auto p-4 pt-16 lg:p-8 lg:pt-8 lg:border-r border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                {isToday ? "Today's Dashboard" : "Dashboard"}
                            </h1>
                            <div className="flex items-center space-x-2 sm:space-x-4 mt-2">
                                <button onClick={() => changeDate(-1)} className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-900 transition">◀</button>
                                <p className="text-gray-700 font-medium min-w-[110px] sm:min-w-[120px] text-center text-sm sm:text-base">{displayDate}</p>
                                <button onClick={() => changeDate(1)} className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-900 transition">▶</button>
                                {!isToday && (
                                    <button onClick={() => setCurrentDate(getTodayString())} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium ml-1 sm:ml-2">Back to Today</button>
                                )}
                            </div>
                        </div>

                        <button 
                            onClick={() => setIsTargetModalOpen(true)}
                            className="w-full sm:w-auto bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition shadow-sm"
                        >
                            Set Target Macros
                        </button>
                    </div>

                    <div className="mb-8">
                        <DailyOverview 
                            consumedCalories={dashboardData?.consumedCalories || 0}
                            targetCalories={dashboardData?.targetCalories || 2000}
                            consumedProtein={dashboardData?.consumedProtein || 0}
                            targetProtein={dashboardData?.targetProtein || 150}
                        />
                    </div>

                    <div className="mb-8">
                        <FoodEntry/>
                    </div>

                    <div className="h-64 shrink-0 mb-8 lg:mb-0">
                        
                            <WeightTrend currentDate={currentDate} />
                        
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="w-full lg:w-96 bg-gray-50 flex flex-col shrink-0 min-h-75 lg:min-h-0 border-t lg:border-t-0 lg:border-l border-gray-200">
                    <div className="p-8 h-full flex flex-col justify-start items-stretch">
                        {selectedFood ? (
                            <div className="space-y-6">
                                <div>
                                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-full">Inspector</span>
                                    <h3 className="text-2xl font-bold text-gray-900 mt-2 wrap-break-words">{selectedFood.name}</h3>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                        <p className="text-xs text-gray-400 font-medium">Calories</p>
                                        <p className="text-xl font-bold text-gray-800 mt-1">{selectedFood.calories} <span className="text-xs font-normal text-gray-500">kcal</span></p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                        <p className="text-xs text-gray-400 font-medium">Protein</p>
                                        <p className="text-xl font-bold text-indigo-600 mt-1">{selectedFood.protein} <span className="text-xs font-normal text-gray-500">g</span></p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                        <p className="text-xs text-gray-400 font-medium">Carbohydrates</p>
                                        <p className="text-xl font-bold text-gray-800 mt-1">{selectedFood.carbs || 0} <span className="text-xs font-normal text-gray-500">g</span></p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                        <p className="text-xs text-gray-400 font-medium">Total Fats</p>
                                        <p className="text-xl font-bold text-gray-800 mt-1">{selectedFood.fat || 0} <span className="text-xs font-normal text-gray-500">g</span></p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setSelectedFood(null)}
                                    className="w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium text-xs transition"
                                >
                                    Clear Selection
                                </button>
                            </div>
                        ) : (
                            <div className="my-auto text-gray-400 text-center">
                                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <p className="font-medium text-gray-700">[ Nutrition Inspector]</p>
                                <p className="text-sm mt-1 max-w-xs mx-auto">Detailed overview here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isTargetModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 overflow-hidden">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Set Daily Targets</h2>
                        <form onSubmit={handleSaveTargets}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Calories</label>
                                    <div className="relative">
                                        <input type="number" required className="w-full border border-gray-300 rounded-lg p-2.5 pr-12 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none" value={targetForm.calories} onChange={(e) => setTargetForm({...targetForm, calories: e.target.value})}/>
                                        <span className="absolute right-3 top-2.5 text-gray-400">kcal</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Protein</label>
                                    <div className="relative">
                                        <input type="number" required className="w-full border border-gray-300 rounded-lg p-2.5 pr-12 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none" value={targetForm.protein} onChange={(e) => setTargetForm({...targetForm, protein: e.target.value})}/>
                                        <span className="absolute right-3 top-2.5 text-gray-400">g</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 flex space-x-3">
                                <button type="button" onClick={() => setIsTargetModalOpen(false)} className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition">Cancel</button>
                                <button type="submit" disabled={isSavingTargets} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition disabled:opacity-70">{isSavingTargets ? 'Saving...' : 'Save Targets'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;