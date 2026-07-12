import { useState, useEffect } from 'react';
import api from '../services/api'; //[cite: 3]

const FuelExpenses = () => {
  const [logs, setLogs] = useState([]); //[cite: 3]
  const [vehicles, setVehicles] = useState([]); //[cite: 3]
  const [showForm, setShowForm] = useState(false); //[cite: 3]
  const [newLog, setNewLog] = useState({ vehicleId: '', type: 'Fuel', amount: '', liters: '', date: new Date().toISOString().split('T')[0] }); //[cite: 3]

  const fetchData = () => {
    // Fixed: Added error logging so you can see in the console if the backend routes are missing or failing[cite: 3]
    api.get('/expenses')
      .then(res => setLogs(res.data.data))
      .catch(err => console.error("❌ Failed to fetch expenses:", err));
      
    api.get('/vehicles')
      .then(res => setVehicles(res.data.data))
      .catch(err => console.error("❌ Failed to fetch vehicles:", err));
  };

  useEffect(() => { fetchData(); }, []); //[cite: 3]

  const handleSubmit = async (e) => {
    e.preventDefault(); //[cite: 3]
    try {
      await api.post('/expenses', newLog); //[cite: 3]
      alert('✅ Expense logged successfully!'); //[cite: 3]
      setShowForm(false); //[cite: 3]
      
      // Reset the form state after a successful submission
      setNewLog({ vehicleId: '', type: 'Fuel', amount: '', liters: '', date: new Date().toISOString().split('T')[0] });
      
      fetchData(); //[cite: 3]
    } catch (error) {
      // Fixed: Print the actual backend error to the console
      console.error("❌ Error submitting expense:", error.response || error);
      alert(`❌ Error logging expense: ${error.response?.data?.error || error.message}`);
    }
  };

  // Added: Clears the liters input automatically if the user switches away from 'Fuel'
  const handleTypeChange = (e) => {
    const selectedType = e.target.value;
    setNewLog({ 
      ...newLog, 
      type: selectedType, 
      liters: selectedType === 'Fuel' ? newLog.liters : '' 
    });
  };

  return (
    <div>
      <div className="page-header">
        <h1>Fuel & Expense Tracking</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ Log Expense</button>
      </div>

      {showForm && (
        <div className="card">
          <h3>Record New Expense</h3>
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group">
              <label>Vehicle</label>
              <select value={newLog.vehicleId} onChange={e => setNewLog({...newLog, vehicleId: e.target.value})} required>
                <option value="">Select Vehicle</option>
                {vehicles.map(v => <option key={v._id} value={v._id}>{v.registrationNumber}</option>)} 
              </select>
            </div>
            <div className="form-group">
              <label>Expense Type</label>
              {/* Pointing to the new handleTypeChange function */}
              <select value={newLog.type} onChange={handleTypeChange}>
                <option>Fuel</option><option>Toll</option><option>Insurance</option><option>Other</option>
              </select>
            </div>
            <div className="form-group"><label>Amount ($) *</label><input type="number" value={newLog.amount} onChange={e => setNewLog({...newLog, amount: e.target.value})} required /></div>
            <div className="form-group"><label>Date *</label><input type="date" value={newLog.date} onChange={e => setNewLog({...newLog, date: e.target.value})} required /></div>
            
            {/* Business Rule: Only show Liters if Type is Fuel[cite: 3] */}
            {newLog.type === 'Fuel' && (
              <div className="form-group"><label>Fuel Consumed (Liters) *</label><input type="number" value={newLog.liters} onChange={e => setNewLog({...newLog, liters: e.target.value})} required /></div>
            )}
            
            <div className="full-width"><button type="submit" className="btn btn-success">Save Log</button></div>
          </form>
        </div>
      )}

      <div className="card">
        <table>
          <thead><tr><th>Date</th><th>Vehicle</th><th>Type</th><th>Amount</th><th>Volume (L)</th></tr></thead>
          <tbody>
            {logs.map(log => (
              <tr key={log._id}>
                <td>{new Date(log.date).toLocaleDateString()}</td>
                {/* Note for Backend Teammate: Make sure the expenses GET route uses .populate('vehicleId') */}
                <td>{log.vehicleId?.registrationNumber || 'N/A'}</td>
                <td>{log.type}</td>
                <td>${log.amount}</td>
                <td>{log.type === 'Fuel' ? `${log.liters} L` : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FuelExpenses; //[cite: 3]