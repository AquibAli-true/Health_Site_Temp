const DailyOverview = ({ 
    consumedCalories = 0, 
    targetCalories, 
    consumedProtein = 0, 
    targetProtein 
}) => {
    const hasTargets = targetCalories > 0 && targetProtein > 0;

    const calPercentage = hasTargets ? Math.min((consumedCalories / targetCalories) * 100, 100) : 0;
    const macroPercentage = hasTargets ? Math.min((consumedProtein / targetProtein) * 100, 100) : 0;

    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    
    const calDashOffset = circumference - (calPercentage / 100) * circumference;
    const macroDashOffset = circumference - (macroPercentage / 100) * circumference;

    if (!hasTargets) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
                <div className="bg-gray-50 h-32 rounded-xl border border-gray-200"></div>
                <div className="bg-gray-50 h-32 rounded-xl border border-gray-200"></div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white border border-gray-200 p-6 rounded-xl flex items-center justify-between shadow-sm">
                <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Calorie Budget</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                        {targetCalories - consumedCalories} <span className="text-sm font-normal text-gray-500">kcal left</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-2">Consumed: {consumedCalories} / {targetCalories} kcal</p>
                </div>
                
                <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r={radius} stroke="#F3F4F6" strokeWidth="10" fill="transparent" />
                        <circle 
                            cx="60" cy="60" r={radius} 
                            stroke="#4F46E5" strokeWidth="10" fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={calDashOffset}
                            strokeLinecap="round"
                            className="transition-all duration-500 ease-out"
                        />
                    </svg>
                    <div className="absolute text-center">
                        <span className="text-lg font-bold text-gray-800">{Math.round(calPercentage)}%</span>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-xl flex items-center justify-between shadow-sm">
                <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Protein Progress</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                        {targetProtein - consumedProtein}g <span className="text-sm font-normal text-gray-500">remaining</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-2">Logged: {consumedProtein} / {targetProtein}g</p>
                </div>
                
                <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r={radius} stroke="#F3F4F6" strokeWidth="10" fill="transparent" />
                        <circle 
                            cx="60" cy="60" r={radius} 
                            stroke="#10B981" strokeWidth="10" fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={macroDashOffset}
                            strokeLinecap="round"
                            className="transition-all duration-500 ease-out"
                        />
                    </svg>
                    <div className="absolute text-center">
                        <span className="text-lg font-bold text-gray-800">{Math.round(macroPercentage)}%</span>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default DailyOverview;