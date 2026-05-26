import { useState, useEffect } from 'react';
import { getTodayCalories, getWeekCalories } from '../api/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, ArcElement,
  PointElement, LineElement, Title, Tooltip, Legend, Filler
);

export default function DashboardPage() {
  const [todayData, setTodayData] = useState(null);
  const [weekData, setWeekData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [todayRes, weekRes] = await Promise.all([
        getTodayCalories(),
        getWeekCalories(),
      ]);
      setTodayData(todayRes.data);
      setWeekData(weekRes.data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <h1>Dashboard</h1>
          <p>Your nutrition overview</p>
        </div>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const today = todayData || { total_calories: 0, total_protein: 0, total_carbs: 0, total_fat: 0, meal_count: 0 };

  // Weekly bar chart data
  const weeklyChartData = {
    labels: weekData?.daily_breakdown?.map((d) => d.day_name?.slice(0, 3)) || [],
    datasets: [
      {
        label: 'Calories',
        data: weekData?.daily_breakdown?.map((d) => d.total_calories) || [],
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: '#10b981',
        borderWidth: 2,
        borderRadius: 8,
        barThickness: 32,
      },
    ],
  };

  const weeklyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1f2937',
        titleFont: { family: 'Inter', weight: '600' },
        bodyFont: { family: 'Inter' },
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.04)' },
        ticks: { font: { family: 'Inter', size: 12 } },
      },
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Inter', size: 12, weight: '500' } },
      },
    },
  };

  // Macro doughnut chart
  const totalMacro = today.total_protein + today.total_carbs + today.total_fat;
  const macroChartData = {
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [
      {
        data: totalMacro > 0
          ? [today.total_protein, today.total_carbs, today.total_fat]
          : [1, 1, 1],
        backgroundColor: ['#3b82f6', '#f59e0b', '#ef4444'],
        borderWidth: 0,
        cutout: '70%',
      },
    ],
  };

  const macroChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { font: { family: 'Inter', size: 12, weight: '500' }, padding: 16 },
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleFont: { family: 'Inter', weight: '600' },
        bodyFont: { family: 'Inter' },
        padding: 12,
        cornerRadius: 8,
      },
    },
  };

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Your nutrition overview for today</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card stagger-1">
          <div className="stat-icon calories">🔥</div>
          <div className="stat-info">
            <div className="stat-label">Today's Calories</div>
            <div className="stat-value">
              {today.total_calories}
              <span className="stat-unit"> kcal</span>
            </div>
          </div>
        </div>

        <div className="stat-card stagger-2">
          <div className="stat-icon protein">💪</div>
          <div className="stat-info">
            <div className="stat-label">Protein</div>
            <div className="stat-value">
              {today.total_protein}
              <span className="stat-unit"> g</span>
            </div>
          </div>
        </div>

        <div className="stat-card stagger-3">
          <div className="stat-icon carbs">🌾</div>
          <div className="stat-info">
            <div className="stat-label">Carbs</div>
            <div className="stat-value">
              {today.total_carbs}
              <span className="stat-unit"> g</span>
            </div>
          </div>
        </div>

        <div className="stat-card stagger-4">
          <div className="stat-icon fat">🥑</div>
          <div className="stat-info">
            <div className="stat-label">Fat</div>
            <div className="stat-value">
              {today.total_fat}
              <span className="stat-unit"> g</span>
            </div>
          </div>
        </div>

        <div className="stat-card stagger-5">
          <div className="stat-icon meals">🍽️</div>
          <div className="stat-info">
            <div className="stat-label">Meals Today</div>
            <div className="stat-value">{today.meal_count}</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="chart-grid">
        <div className="chart-card stagger-3" style={{ animationDelay: '0.2s' }}>
          <div className="card-header">
            <span className="card-title">📊 Weekly Calorie Intake</span>
          </div>
          <div style={{ height: '260px' }}>
            <Bar data={weeklyChartData} options={weeklyChartOptions} />
          </div>
        </div>

        <div className="chart-card stagger-4" style={{ animationDelay: '0.3s' }}>
          <div className="card-header">
            <span className="card-title">🥗 Today's Macros</span>
          </div>
          <div style={{ height: '260px' }}>
            <Doughnut data={macroChartData} options={macroChartOptions} />
          </div>
        </div>
      </div>

      {/* Today's Meals */}
      {todayData?.meals && todayData.meals.length > 0 && (
        <div className="card animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="card-header">
            <span className="card-title">🍴 Today's Meals</span>
            <span className="badge badge-green">{todayData.meals.length} meals</span>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Food</th>
                  <th>Calories</th>
                  <th>Protein</th>
                  <th>Carbs</th>
                  <th>Fat</th>
                </tr>
              </thead>
              <tbody>
                {todayData.meals.map((meal) => (
                  <tr key={meal.id}>
                    <td style={{ fontWeight: 600 }}>{meal.food_name}</td>
                    <td>
                      <span className="badge badge-green">{meal.calories} kcal</span>
                    </td>
                    <td>{meal.protein}g</td>
                    <td>{meal.carbs}g</td>
                    <td>{meal.fat}g</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
