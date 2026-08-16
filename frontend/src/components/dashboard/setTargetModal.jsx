

const SetTargetModal = () => {
  return (
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
  )
}

export default SetTargetModal