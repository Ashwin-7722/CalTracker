import { useState, useEffect } from 'react';
import { getWeekCalories, getMonthCalories } from '../api/api';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

export default function AnalyticsPage() {
  const [weekData, setWeekData] = useState(null);
  const [monthData, setMonthData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [w, m] = await Promise.all([getWeekCalories(), getMonthCalories()]);
      setWeekData(w.data);
      setMonthData(m.data);
    } catch (err) { console.error('Analytics load error:', err); }
    finally { setLoading(false); }
  };

  if (loading) return (<div><div className="page-header"><h1>Analytics</h1></div><div className="loading-spinner"></div></div>);

  const chartOpts = (title) => ({
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, title: { display: false }, tooltip: { backgroundColor: '#1f2937', padding: 12, cornerRadius: 8, titleFont: { family: 'Inter' }, bodyFont: { family: 'Inter' } } },
    scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { family: 'Inter', size: 11 } } }, x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 11 } } } }
  });

  const weeklyLine = {
    labels: weekData?.daily_breakdown?.map(d => d.day_name?.slice(0,3)) || [],
    datasets: [{
      label: 'Calories', data: weekData?.daily_breakdown?.map(d => d.total_calories) || [],
      borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)', tension: 0.4, fill: true, pointBackgroundColor: '#10b981', pointRadius: 5, pointHoverRadius: 7
    }]
  };

  const weeklyProtein = {
    labels: weekData?.daily_breakdown?.map(d => d.day_name?.slice(0,3)) || [],
    datasets: [
      { label: 'Protein', data: weekData?.daily_breakdown?.map(d => d.total_protein) || [], backgroundColor: 'rgba(59,130,246,0.7)', borderRadius: 6, barThickness: 20 },
      { label: 'Carbs', data: weekData?.daily_breakdown?.map(d => d.total_carbs) || [], backgroundColor: 'rgba(245,158,11,0.7)', borderRadius: 6, barThickness: 20 },
      { label: 'Fat', data: weekData?.daily_breakdown?.map(d => d.total_fat) || [], backgroundColor: 'rgba(239,68,68,0.7)', borderRadius: 6, barThickness: 20 },
    ]
  };

  const macroOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { font: { family: 'Inter', size: 12 }, padding: 16 } }, tooltip: { backgroundColor: '#1f2937', padding: 12, cornerRadius: 8 } },
    scales: { y: { beginAtZero: true, stacked: true, grid: { color: 'rgba(0,0,0,0.04)' } }, x: { stacked: true, grid: { display: false } } }
  };

  // Month trend
  const monthLine = {
    labels: monthData?.daily_breakdown?.map((d, i) => (i % 3 === 0) ? new Date(d.date).getDate() : '') || [],
    datasets: [{
      label: 'Daily Calories', data: monthData?.daily_breakdown?.map(d => d.total_calories) || [],
      borderColor: '#8b5cf6', backgroundColor: 'rgba(139,92,246,0.1)', tension: 0.3, fill: true, pointRadius: 2, pointHoverRadius: 5
    }]
  };

  return (
    <div>
      <div className="page-header"><h1>Analytics</h1><p>Detailed nutrition insights and trends</p></div>

      <div className="stats-grid">
        <div className="stat-card stagger-1"><div className="stat-icon calories">📊</div><div className="stat-info"><div className="stat-label">Weekly Total</div><div className="stat-value">{weekData?.total_calories || 0}<span className="stat-unit"> kcal</span></div></div></div>
        <div className="stat-card stagger-2"><div className="stat-icon protein">📈</div><div className="stat-info"><div className="stat-label">Daily Average</div><div className="stat-value">{weekData?.average_daily_calories || 0}<span className="stat-unit"> kcal</span></div></div></div>
        <div className="stat-card stagger-3"><div className="stat-icon carbs">📅</div><div className="stat-info"><div className="stat-label">Monthly Total</div><div className="stat-value">{monthData?.total_calories || 0}<span className="stat-unit"> kcal</span></div></div></div>
        <div className="stat-card stagger-4"><div className="stat-icon fat">⚡</div><div className="stat-info"><div className="stat-label">Monthly Avg</div><div className="stat-value">{monthData?.average_daily_calories || 0}<span className="stat-unit"> kcal</span></div></div></div>
      </div>

      <div className="chart-grid">
        <div className="chart-card stagger-2"><div className="card-header"><span className="card-title">📈 Weekly Calorie Trend</span></div><div style={{height:'260px'}}><Line data={weeklyLine} options={chartOpts('Weekly Calories')} /></div></div>
        <div className="chart-card stagger-3"><div className="card-header"><span className="card-title">🥗 Weekly Macronutrients</span></div><div style={{height:'260px'}}><Bar data={weeklyProtein} options={macroOpts} /></div></div>
      </div>

      <div className="chart-grid" style={{marginTop:'0'}}>
        <div className="chart-card stagger-4" style={{gridColumn:'1 / -1'}}><div className="card-header"><span className="card-title">📊 30-Day Calorie Trend</span></div><div style={{height:'280px'}}><Line data={monthLine} options={chartOpts('Monthly Trend')} /></div></div>
      </div>
    </div>
  );
}
