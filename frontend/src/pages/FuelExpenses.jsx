import { useState, useEffect } from 'react';
import api from '../services/api';

const FuelExpenses = () => {
  const [logs, setLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newLog, setNewLog] = useState({ vehicleId: '', type: 'Fuel', amount: '', liters: '', date: new Date().toISOString().split('T')[0] });

  const fetchData = () => {
    api.get('/expenses').then(res => setLogs(res.data.data)).catch(() => {});
    api.get('/vehicles').then(res => setVehicles(res.data.data)).catch(() => {});
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/expenses', newLog);
      alert('✅ Expense logged successfully!');
      setShowForm(false);
      fetchData();
    } catch (error) {
      alert('❌ Error logging expense.');
    }
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
              <select value={newLog.type} onChange={e => setNewLog({...newLog, type: e.target.value})}>
                <option>Fuel</option><option>Toll</option><option>Insurance</option><option>Other</option>
              </select>
            </div>
            <div className="form-group"><label>Amount ($) *</label><input type="number" value={newLog.amount} onChange={e => setNewLog({...newLog, amount: e.target.value})} required /></div>
            <div className="form-group"><label>Date *</label><input type="date" value={newLog.date} onChange={e => setNewLog({...newLog, date: e.target.value})} required /></div>
            
            {/* Business Rule: Only show Liters if Type is Fuel */}
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

export default FuelExpenses;