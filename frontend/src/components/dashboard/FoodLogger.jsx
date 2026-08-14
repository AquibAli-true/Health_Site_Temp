import { useState } from 'react';

const FoodLogger = ({ currentDate, onFoodLogged, loggedFoods, setSelectedFood }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [mealType, setMealType] = useState('breakfast');
    const [isCustomFoodModalOpen, setIsCustomFoodModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [customFoodForm, setCustomFoodForm] = useState({ name: '', calories: '', protein: '', fat: '', carbs: '' });

    const handleFoodSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const res = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${import.meta.env.VITE_USDA_KEY}&query=${encodeURIComponent(searchQuery)}&pageSize=15`);
            if (!res.ok) throw new Error('USDA API request failed');
            const data = await res.json();

            const formattedResults = (data.foods || []).map(food => {
                const findNutrient = (nameSnippet) => {
                    const nutrient = food.foodNutrients.find(n => n.nutrientName.toLowerCase().includes(nameSnippet.toLowerCase()));
                    return nutrient ? Math.round(nutrient.value) : 0;
                };

                return {
                    fdcId: String(food.fdcId),
                    name: food.description.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()),
                    calories: findNutrient('Energy'),
                    protein: findNutrient('Protein'),
                    fat: findNutrient('lipid') || findNutrient('fat'),
                    carbs: findNutrient('carbohydrate'),
                    servingAmount: 100, // USDA data is per-100g
                    servingUnit: 'g',
                };
            });

            setSearchResults(formattedResults);
        } catch (err) {
            alert('Error fetching from food database: ' + err.message);
        } finally {
            setIsSearching(false);
        }
    };

    const logFoodItem = async (foodData) => {
        try {
            const response = await fetch( import.meta.env.VITE_SERVER + '/dashboard/food', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    date: currentDate,
                    mealType,
                    ...foodData,
                }),
            });

            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.message || 'Failed to log food item');
            }
            onFoodLogged();
            setSearchResults([]);
            setSearchQuery('');
        } catch (err) {
            alert(err.message);
        }
    };

    const handleCustomFoodSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await logFoodItem({
                name: customFoodForm.name,
                fdcId: 'custom',
                servingAmount: 1,
                servingUnit: 'serving',
                calories: Number(customFoodForm.calories) || 0,
                protein: Number(customFoodForm.protein) || 0,
                carbs: Number(customFoodForm.carbs) || 0,
                fat: Number(customFoodForm.fat) || 0,
            });
            setCustomFoodForm({ name: '', calories: '', protein: '', fat: '', carbs: '' });
            setIsCustomFoodModalOpen(false);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col min-h-[400px]">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Food Logger</h3>
                <button
                    onClick={() => setIsCustomFoodModalOpen(true)}
                    className="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition"
                >
                    + Custom Entry
                </button>
            </div>
            <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 mb-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snacks">Snacks</option>
            </select>

            <form onSubmit={handleFoodSearch} className="flex space-x-2 mb-4">
                <input
                    type="text"
                    placeholder="Search generic foods (e.g., banana, milk, chocolate)..."
                    className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                    type="submit"
                    disabled={isSearching}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                >
                    {isSearching ? 'Searching...' : 'Search'}
                </button>
            </form>

            {searchResults.length > 0 && (
                <div className="mb-6 bg-gray-50 border border-gray-200 rounded-xl max-h-[400px] overflow-y-auto divide-y divide-gray-100 shadow-inner">
                    <div className="flex justify-between items-center bg-gray-100 sticky top-0 px-3 py-2 z-10 border-b border-gray-200">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Database Results</p>
                        <button onClick={() => setSearchResults([])} className="text-xs text-gray-500 hover:text-gray-800">Clear</button>
                    </div>
                    {searchResults.map((food, idx) => (
                        <div key={`${food.fdcId}-${idx}`} className="p-3 flex justify-between items-center hover:bg-gray-100 transition bg-white">
                            <div>
                                <p className="font-semibold text-gray-800 text-sm">{food.name}</p>
                                <p className="text-xs text-gray-500">{food.calories} kcal · P: {food.protein}g · F: {food.fat}g · C: {food.carbs}g</p>
                            </div>
                            <button
                                onClick={() => logFoodItem(food)}
                                className="h-8 w-8 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-600 hover:text-white transition font-bold shadow-sm"
                            >
                                +
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex-1">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Logged Food Items</h4>
                {(!loggedFoods || loggedFoods.length === 0) ? (
                    <div className="h-32 flex flex-col items-center justify-center text-gray-400 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                        <p className="text-sm">No food logged for this day yet.</p>
                    </div>
                ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                        {loggedFoods.map((food, index) => (
                            <div
                                key={food._id || index}
                                onClick={() => setSelectedFood(food)}
                                className="p-3 border rounded-xl flex justify-between items-center cursor-pointer transition border-gray-100 hover:border-indigo-300 bg-white shadow-sm hover:shadow"
                            >
                                <div>
                                    <p className="font-medium text-gray-800 text-sm">{food.name}</p>
                                    <p className="text-xs text-indigo-600 font-medium">{food.calories} kcal</p>
                                </div>
                                <span className="text-xs text-gray-400">P: {food.protein}g</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {isCustomFoodModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 overflow-hidden">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Log Custom Food</h2>
                        <form onSubmit={handleCustomFoodSubmit} className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Food Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g., Homemade Protein Shake"
                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-indigo-500 focus:outline-none"
                                    value={customFoodForm.name}
                                    onChange={(e) => setCustomFoodForm({ ...customFoodForm, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Calories (kcal)</label>
                                    <input
                                        type="number"
                                        required
                                        placeholder="0"
                                        className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-indigo-500 focus:outline-none"
                                        value={customFoodForm.calories}
                                        onChange={(e) => setCustomFoodForm({ ...customFoodForm, calories: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Protein (g)</label>
                                    <input
                                        type="number"
                                        required
                                        placeholder="0"
                                        className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-indigo-500 focus:outline-none"
                                        value={customFoodForm.protein}
                                        onChange={(e) => setCustomFoodForm({ ...customFoodForm, protein: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Carbs (g)</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-indigo-500 focus:outline-none"
                                        value={customFoodForm.carbs}
                                        onChange={(e) => setCustomFoodForm({ ...customFoodForm, carbs: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Fat (g)</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-indigo-500 focus:outline-none"
                                        value={customFoodForm.fat}
                                        onChange={(e) => setCustomFoodForm({ ...customFoodForm, fat: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex space-x-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsCustomFoodModalOpen(false)}
                                    className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm transition disabled:opacity-70"
                                >
                                    {isSaving ? 'Logging...' : 'Log Item'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FoodLogger;