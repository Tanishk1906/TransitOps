import { useState, useEffect } from 'react';
import api from '../services/api';

const Maintenance = () => {
  const [logs, setLogs] = useState([]);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newLog, setNewLog] = useState({ vehicleId: '', description: '', cost: '' });

  const fetchData = () => {
    api.get('/maintenance').then(res => setLogs(res.data.data)).catch(() => {});

    api.get('/vehicles?status=Available').then(res => setAvailableVehicles(res.data.data)).catch(() => {});
  };

  useEffect(() => { fetchData(); }, []);

  const handleStartMaintenance = async (e) => {
    e.preventDefault();
    try {
      await api.post('/maintenance', newLog);
      alert('✅ Maintenance started. Vehicle status changed to "In Shop" and removed from dispatch.');
      setShowForm(false);
      fetchData();
    } catch (error) {
      alert('❌ Error creating maintenance log.');
    }
  };

  const handleCloseMaintenance = async (id) => {
    if (!window.confirm('Mark this maintenance as closed? Vehicle will return to "Available".')) return;
    try {
      await api.patch(`/maintenance/${id}/close`);
      alert('✅ Maintenance closed. Vehicle restored to fleet.');
      fetchData();
    } catch (error) {
      alert('❌ Error closing log.');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Maintenance Logs</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ Start Maintenance</button>
      </div>

      {showForm && (
        <div className="card">
          <h3>Log New Maintenance</h3>
          <form onSubmit={handleStartMaintenance} className="form-grid">
            <div className="form-group">
              <label>Select Vehicle (Available Only)</label>
              <select value={newLog.vehicleId} onChange={e => setNewLog({...newLog, vehicleId: e.target.value})} required>
                <option value="">Select Vehicle</option>
                {availableVehicles.map(v => <option key={v._id} value={v._id}>{v.registrationNumber} - {v.nameModel}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Estimated Cost ($)</label><input type="number" value={newLog.cost} onChange={e => setNewLog({...newLog, cost: e.target.value})} /></div>
            <div className="form-group full-width"><label>Description / Issue *</label><input value={newLog.description} onChange={e => setNewLog({...newLog, description: e.target.value})} placeholder="e.g., Oil Change, Brake Repair" required /></div>
            <div className="full-width"><button type="submit" className="btn btn-warning" style={{background: '#ffc107', color: '#000'}}>Send to Shop</button></div>
          </form>
        </div>
      )}

      <div className="card">
        <table>
          <thead><tr><th>Vehicle</th><th>Description</th><th>Cost</th><th>Start Date</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {logs.map(log => (
              <tr key={log._id}>
                <td>{log.vehicleId?.registrationNumber || 'N/A'}</td>
                <td>{log.description}</td>
                <td>${log.cost || 0}</td>
                <td>{new Date(log.startDate).toLocaleDateString()}</td>
                <td><span className={`status-badge ${log.isClosed ? 'status-available' : 'status-in-shop'}`}>{log.isClosed ? 'Closed' : 'In Shop'}</span></td>
                <td>
                  {!log.isClosed && <button className="btn btn-sm btn-success" onClick={() => handleCloseMaintenance(log._id)}>Close Log</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Maintenance;
