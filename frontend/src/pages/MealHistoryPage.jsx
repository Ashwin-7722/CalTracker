import { useState, useEffect } from 'react';
import { getMeals, deleteMeal, updateMeal } from '../api/api';

export default function MealHistoryPage() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMeal, setEditingMeal] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => { loadMeals(); }, []);

  const loadMeals = async () => {
    try {
      const response = await getMeals();
      setMeals(response.data);
    } catch (err) { console.error('Failed to load meals:', err); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this meal?')) return;
    try { await deleteMeal(id); setMeals(meals.filter((m) => m.id !== id)); }
    catch (err) { console.error('Delete failed:', err); }
  };

  const handleEdit = (meal) => {
    setEditingMeal(meal.id);
    setEditForm({ food_name: meal.food_name, calories: meal.calories, protein: meal.protein, carbs: meal.carbs, fat: meal.fat });
  };

  const handleUpdate = async () => {
    try { await updateMeal(editingMeal, editForm); setEditingMeal(null); loadMeals(); }
    catch (err) { console.error('Update failed:', err); }
  };

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';

  if (loading) return (<div><div className="page-header"><h1>Meal History</h1></div><div className="loading-spinner"></div></div>);

  return (
    <div>
      <div className="page-header"><h1>Meal History</h1><p>View and manage all your logged meals</p></div>
      {meals.length === 0 ? (
        <div className="card"><div className="empty-state"><div className="empty-state-icon">🍽️</div><div className="empty-state-title">No meals logged yet</div><div className="empty-state-text">Add your first meal to get started</div></div></div>
      ) : (
        <div className="card animate-fade-in">
          <div className="card-header"><span className="card-title">📋 All Meals</span><span className="badge badge-green">{meals.length} total</span></div>
          <div className="table-container">
            <table className="table">
              <thead><tr><th>Food</th><th>Calories</th><th>Protein</th><th>Carbs</th><th>Fat</th><th>Time</th><th>Actions</th></tr></thead>
              <tbody>
                {meals.map((meal) => (
                  <tr key={meal.id}>
                    {editingMeal === meal.id ? (<>
                      <td><input className="form-input" value={editForm.food_name} onChange={(e) => setEditForm({...editForm, food_name: e.target.value})} style={{padding:'6px 10px',fontSize:'13px'}}/></td>
                      <td><input className="form-input" type="number" value={editForm.calories} onChange={(e)=>setEditForm({...editForm,calories:parseInt(e.target.value)||0})} style={{width:'80px',padding:'6px 10px',fontSize:'13px'}}/></td>
                      <td><input className="form-input" type="number" value={editForm.protein} onChange={(e)=>setEditForm({...editForm,protein:parseInt(e.target.value)||0})} style={{width:'60px',padding:'6px 10px',fontSize:'13px'}}/></td>
                      <td><input className="form-input" type="number" value={editForm.carbs} onChange={(e)=>setEditForm({...editForm,carbs:parseInt(e.target.value)||0})} style={{width:'60px',padding:'6px 10px',fontSize:'13px'}}/></td>
                      <td><input className="form-input" type="number" value={editForm.fat} onChange={(e)=>setEditForm({...editForm,fat:parseInt(e.target.value)||0})} style={{width:'60px',padding:'6px 10px',fontSize:'13px'}}/></td>
                      <td className="meal-time">{fmtDate(meal.meal_time)}</td>
                      <td><div className="table-actions"><button className="btn btn-primary btn-sm" onClick={handleUpdate}>Save</button><button className="btn btn-secondary btn-sm" onClick={()=>setEditingMeal(null)}>Cancel</button></div></td>
                    </>) : (<>
                      <td style={{fontWeight:600}}>{meal.food_name}</td>
                      <td><span className="badge badge-green">{meal.calories} kcal</span></td>
                      <td>{meal.protein}g</td><td>{meal.carbs}g</td><td>{meal.fat}g</td>
                      <td className="meal-time">{fmtDate(meal.meal_time)}</td>
                      <td><div className="table-actions"><button className="btn btn-secondary btn-sm" onClick={()=>handleEdit(meal)}>✏️ Edit</button><button className="btn btn-danger btn-sm" onClick={()=>handleDelete(meal.id)}>🗑️</button></div></td>
                    </>)}
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
