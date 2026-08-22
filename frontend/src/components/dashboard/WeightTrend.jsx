import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const MAX_VISIBLE_ENTRIES = 30;
const PIXELS_PER_ENTRY = 36;
const MIN_CHART_WIDTH = 500;

/**
 * Controlled weight trend chart.
 *
 * Props:
 *  - data: array of { date, weight } (weight in kg). Owned by the parent —
 *    this component never mutates it directly.
 *  - onLogWeight: (newEntry: { date, weight }) => void, called when the
 *    user logs a new weight. The parent decides whether that appends to
 *    local state, hits an API, or both.
 */
const WeightTrend = ({ data = [], onLogWeight }) => {
  const [weightInput, setWeightInput] = useState('');

  const chartData = useMemo(() => {
    return data
      .slice(-MAX_VISIBLE_ENTRIES)
      .map((entry) => ({
        ...entry,
        displayDate: new Date(entry.date).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
        }),
      }));
  }, [data]);

  const handleLogWeight = (e) => {
    e.preventDefault();
    const parsed = parseFloat(weightInput);
    if (!weightInput || Number.isNaN(parsed) || parsed <= 0) return;

    onLogWeight?.({
      date: new Date().toISOString(),
      weight: parsed,
    });
    setWeightInput('');
  };

  const weights = chartData.map((d) => d.weight);
  const minWeight = weights.length ? Math.min(...weights) : 0;
  const maxWeight = weights.length ? Math.max(...weights) : 0;
  const padding = Math.max((maxWeight - minWeight) * 0.15, 1);

  // Width scales with entry count so the chart stays readable and scrolls
  // horizontally once it outgrows its container — even within the 30-entry cap.
  const chartWidth = Math.max(MIN_CHART_WIDTH, chartData.length * PIXELS_PER_ENTRY);

  return (
    <div className="bg-[#f0f5f2] border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <h3 className="text-lg font-bold text-gray-900">Weight Trend</h3>

        <form onSubmit={handleLogWeight} className="flex gap-2">
          <input
            type="number"
            step="0.1"
            min="0"
            placeholder="Weight (kg)"
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
            className="font-nunito px-2 border focus:border-[#10b981] w-32 border-[#d3dfd9] text-gray-900 py-2 bg-[#DDE8E2]  focus:outline-none focus:ring-0 rounded-lg"
          />
          <button
            type="submit"
            disabled={!weightInput}
            className="bg-(--accent-coral) text-white px-4 py-1.5 rounded-lg text-md font-medium hover:bg-orange-400 cursor-pointer hover:text-black transition disabled:opacity-50"
          >
            Log
          </button>
        </form>
      </div>

      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-400 text-sm text-center px-4">
          No weight entries logged yet. Log your weight above to start the trend.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <LineChart
            width={chartWidth}
            height={280}
            data={chartData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis
              dataKey="displayDate"
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[minWeight - padding, maxWeight + padding]}
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              width={40}
            />
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '13px' }}
              formatter={(value) => [`${value} kg`, 'Weight']}
            />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#0f231e"
              strokeWidth={2}
              dot={{ r: 3, fill: '#4F46E5' }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </div>
      )}
    </div>
  );
};

export default WeightTrend;