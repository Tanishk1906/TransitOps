import { useState, useEffect } from 'react';
import api from '../services/api';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    registrationNumber: '', nameModel: '', type: 'Van', 
    maxLoadCapacity: '', odometer: 0, acquisitionCost: ''
  });

  const fetchVehicles = () => {
    api.get('/vehicles').then(res => setVehicles(res.data.data)).catch(() => {});
  };

  useEffect(() => { fetchVehicles(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/vehicles', newVehicle);
      alert('✅ Vehicle registered successfully!');
      setShowForm(false);
      setNewVehicle({ registrationNumber: '', nameModel: '', type: 'Van', maxLoadCapacity: '', odometer: 0, acquisitionCost: '' });
      fetchVehicles();
    } catch (error) {
      // Business Rule: Unique Registration Number enforcement
      if (error.response?.status === 409) {
        alert('❌ Error: Registration Number already exists!');
      } else {
        alert('❌ Failed to register vehicle.');
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Vehicle Registry</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ Add Vehicle</button>
      </div>

      {showForm && (
        <div className="card">
          <h3>Register New Asset</h3>
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group"><label>Registration Number *</label><input value={newVehicle.registrationNumber} onChange={e => setNewVehicle({...newVehicle, registrationNumber: e.target.value})} required /></div>
            <div className="form-group"><label>Model / Name *</label><input value={newVehicle.nameModel} onChange={e => setNewVehicle({...newVehicle, nameModel: e.target.value})} required /></div>
            <div className="form-group"><label>Vehicle Type</label>
              <select value={newVehicle.type} onChange={e => setNewVehicle({...newVehicle, type: e.target.value})}>
                <option>Van</option><option>Truck</option><option>Prime Mover</option><option>Trailer</option>
              </select>
            </div>
            <div className="form-group"><label>Max Load Capacity (kg) *</label><input type="number" value={newVehicle.maxLoadCapacity} onChange={e => setNewVehicle({...newVehicle, maxLoadCapacity: e.target.value})} required /></div>
            <div className="form-group"><label>Acquisition Cost ($) *</label><input type="number" value={newVehicle.acquisitionCost} onChange={e => setNewVehicle({...newVehicle, acquisitionCost: e.target.value})} required /></div>
            <div className="form-group"><label>Current Odometer (km)</label><input type="number" value={newVehicle.odometer} onChange={e => setNewVehicle({...newVehicle, odometer: e.target.value})} /></div>
            <div className="full-width"><button type="submit" className="btn btn-success">Save Vehicle</button></div>
          </form>
        </div>
      )}

      <div className="card">
        <table>
          <thead><tr><th>Reg No.</th><th>Model</th><th>Type</th><th>Max Cap.</th><th>Odometer</th><th>Status</th></tr></thead>
          <tbody>
            {vehicles.map(v => (
              <tr key={v._id}>
                <td><strong>{v.registrationNumber}</strong></td>
                <td>{v.nameModel}</td><td>{v.type}</td>
                <td>{v.maxLoadCapacity} kg</td><td>{v.odometer} km</td>
                <td><span className={`status-badge status-${v.status.toLowerCase().replace(' ', '-')}`}>{v.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Vehicles;