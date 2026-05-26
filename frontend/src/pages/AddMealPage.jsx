import { useState } from 'react';
import { createMeal } from '../api/api';

export default function AddMealPage({ onNavigate }) {
  const [formData, setFormData] = useState({
    food_name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await createMeal({
        food_name: formData.food_name,
        calories: parseInt(formData.calories) || 0,
        protein: parseInt(formData.protein) || 0,
        carbs: parseInt(formData.carbs) || 0,
        fat: parseInt(formData.fat) || 0,
      });

      setSuccess('Meal added successfully!');
      setFormData({ food_name: '', calories: '', protein: '', carbs: '', fat: '' });

      // Auto-navigate to meals after 1.5s
      setTimeout(() => {
        if (onNavigate) onNavigate('meals');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add meal');
    } finally {
      setLoading(false);
    }
  };

  // Common foods for quick add
  const quickFoods = [
    { name: 'Chicken Breast', cal: 165, p: 31, c: 0, f: 3.6 },
    { name: 'Brown Rice (1 cup)', cal: 216, p: 5, c: 45, f: 1.8 },
    { name: 'Banana', cal: 105, p: 1.3, c: 27, f: 0.3 },
    { name: 'Egg (Boiled)', cal: 78, p: 6, c: 0.6, f: 5.3 },
    { name: 'Greek Yogurt', cal: 100, p: 17, c: 6, f: 0.7 },
    { name: 'Oatmeal (1 cup)', cal: 154, p: 5, c: 27, f: 2.6 },
    { name: 'Apple', cal: 95, p: 0.5, c: 25, f: 0.3 },
    { name: 'Salmon Fillet', cal: 208, p: 20, c: 0, f: 13 },
  ];

  const handleQuickAdd = (food) => {
    setFormData({
      food_name: food.name,
      calories: String(food.cal),
      protein: String(Math.round(food.p)),
      carbs: String(Math.round(food.c)),
      fat: String(Math.round(food.f)),
    });
  };

  return (
    <div>
      <div className="page-header">
        <h1>Add Meal</h1>
        <p>Log your food intake and track nutrition</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Add Meal Form */}
        <div className="card animate-fade-in">
          <div className="card-header">
            <span className="card-title">🍽️ Meal Details</span>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="food-name">Food Name</label>
              <input
                id="food-name"
                className="form-input"
                name="food_name"
                type="text"
                placeholder="e.g., Grilled Chicken"
                value={formData.food_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="calories">Calories (kcal)</label>
              <input
                id="calories"
                className="form-input"
                name="calories"
                type="number"
                min="0"
                placeholder="0"
                value={formData.calories}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="protein">Protein (g)</label>
                <input
                  id="protein"
                  className="form-input"
                  name="protein"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.protein}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="carbs">Carbs (g)</label>
                <input
                  id="carbs"
                  className="form-input"
                  name="carbs"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.carbs}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="fat">Fat (g)</label>
              <input
                id="fat"
                className="form-input"
                name="fat"
                type="number"
                min="0"
                placeholder="0"
                value={formData.fat}
                onChange={handleChange}
              />
            </div>

            {/* Preview */}
            {formData.food_name && (
              <div style={{
                background: 'var(--gray-50)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                marginBottom: '16px'
              }}>
                <div style={{ fontSize: '13px', color: 'var(--gray-500)', marginBottom: '8px', fontWeight: 600 }}>
                  Preview
                </div>
                <div style={{ fontWeight: 700, marginBottom: '6px' }}>{formData.food_name}</div>
                <div className="macro-bar">
                  <div
                    className="macro-bar-segment protein"
                    style={{ width: `${(parseInt(formData.protein) || 0) / ((parseInt(formData.protein) || 0) + (parseInt(formData.carbs) || 0) + (parseInt(formData.fat) || 0) || 1) * 100}%` }}
                  />
                  <div
                    className="macro-bar-segment carbs"
                    style={{ width: `${(parseInt(formData.carbs) || 0) / ((parseInt(formData.protein) || 0) + (parseInt(formData.carbs) || 0) + (parseInt(formData.fat) || 0) || 1) * 100}%` }}
                  />
                  <div
                    className="macro-bar-segment fat"
                    style={{ width: `${(parseInt(formData.fat) || 0) / ((parseInt(formData.protein) || 0) + (parseInt(formData.carbs) || 0) + (parseInt(formData.fat) || 0) || 1) * 100}%` }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '12px' }}>
                  <span style={{ color: 'var(--protein-color)' }}>● Protein {formData.protein || 0}g</span>
                  <span style={{ color: 'var(--carbs-color)' }}>● Carbs {formData.carbs || 0}g</span>
                  <span style={{ color: 'var(--fat-color)' }}>● Fat {formData.fat || 0}g</span>
                </div>
              </div>
            )}

            <button
              id="add-meal-submit"
              className="btn btn-primary btn-block btn-lg"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Adding...' : '+ Add Meal'}
            </button>
          </form>
        </div>

        {/* Quick Add */}
        <div className="card animate-slide-right">
          <div className="card-header">
            <span className="card-title">⚡ Quick Add</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--gray-500)', marginBottom: '16px' }}>
            Click a food item to auto-fill the form
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {quickFoods.map((food, index) => (
              <button
                key={index}
                className="btn btn-secondary"
                style={{
                  justifyContent: 'space-between',
                  textAlign: 'left',
                  padding: '12px 16px',
                }}
                onClick={() => handleQuickAdd(food)}
              >
                <span style={{ fontWeight: 600 }}>{food.name}</span>
                <span className="badge badge-green">{food.cal} kcal</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
