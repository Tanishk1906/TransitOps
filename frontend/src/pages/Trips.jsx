import { useState, useEffect } from 'react';
import api from '../services/api';

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newTrip, setNewTrip] = useState({ source: '', dest: '', vehicleId: '', driverId: '', weight: '', distance: '' });

  const fetchData = async () => {
    try {
      const resTrips = await api.get('/trips');
      setTrips(resTrips.data.data);

      const resVehicles = await api.get('/vehicles?status=Available');
      setAvailableVehicles(resVehicles.data.data);

      const resDrivers = await api.get('/drivers?status=Available');
      setAvailableDrivers(resDrivers.data.data);
    } catch (err) {
      console.error("Failed to fetch trip data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDispatch = async (e) => {
    e.preventDefault();
    try {

      const createRes = await api.post('/trips', {
        ...newTrip,
        weight: parseFloat(newTrip.weight),
        distance: parseFloat(newTrip.distance),
        vehicleId: parseInt(newTrip.vehicleId),
        driverId: parseInt(newTrip.driverId)
      });

      const tripId = createRes.data._id || createRes.data.id;

      await api.post(`/trips/${tripId}/dispatch`);

      alert("✅ Trip Dispatched! Vehicle & Driver status changed to 'On Trip'.");
      setShowForm(false);
      setNewTrip({ source: '', dest: '', vehicleId: '', driverId: '', weight: '', distance: '' });
      fetchData();
    } catch (error) {
      alert(`❌ Error dispatching trip: ${error.response?.data?.detail || error.message}`);
    }
  };

  const handleComplete = async (tripId) => {
    try {
      await api.post(`/trips/${tripId}/complete`);
      alert("✅ Trip Completed! Vehicle & Driver are available again.");
      fetchData();
    } catch (error) {
      alert(`❌ Error completing trip: ${error.response?.data?.detail || error.message}`);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Trip Management</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ Dispatch Trip</button>
      </div>

      {showForm && (
        <div className="card">
          <h3>Create New Trip</h3>
          <form onSubmit={handleDispatch} className="form-grid">
            <div className="form-group"><label>Source</label><input value={newTrip.source} onChange={e => setNewTrip({...newTrip, source: e.target.value})} required /></div>
            <div className="form-group"><label>Destination</label><input value={newTrip.dest} onChange={e => setNewTrip({...newTrip, dest: e.target.value})} required /></div>

            <div className="form-group">
                <label>Select Vehicle (Available Only)</label>
                <select value={newTrip.vehicleId} onChange={e => setNewTrip({...newTrip, vehicleId: e.target.value})} required>
                    <option value="">Select Vehicle</option>
                    {availableVehicles.map(v => <option key={v._id} value={v._id}>{v.registrationNumber} (Max: {v.maxLoadCapacity}kg)</option>)}
                </select>
            </div>
            <div className="form-group">
                <label>Select Driver (Valid License Only)</label>
                <select value={newTrip.driverId} onChange={e => setNewTrip({...newTrip, driverId: e.target.value})} required>
                    <option value="">Select Driver</option>
                    {availableDrivers.map(d => <option key={d._id} value={d._id}>{d.name} (License: {d.licenseNumber})</option>)}
                </select>
            </div>
            <div className="form-group"><label>Cargo Weight (kg)</label><input type="number" value={newTrip.weight} onChange={e => setNewTrip({...newTrip, weight: e.target.value})} required /></div>
            <div className="form-group"><label>Distance (km)</label><input type="number" value={newTrip.distance} onChange={e => setNewTrip({...newTrip, distance: e.target.value})} required /></div>

            <div className="full-width"><button type="submit" className="btn btn-success">Dispatch Trip</button></div>
          </form>
        </div>
      )}

      <div className="card">
        <table>
          <thead>
            <tr><th>Trip ID</th><th>Source</th><th>Destination</th><th>Vehicle</th><th>Driver</th><th>Weight</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {trips.map(t => (
              <tr key={t._id}>
                <td>#{t._id}</td>
                <td>{t.source}</td><td>{t.dest}</td>
                <td>{t.vehicle?.registrationNumber || `ID:${t.vehicleId}`}</td>
                <td>{t.driver?.name || `ID:${t.driverId}`}</td>
                <td>{t.weight} kg</td>
                <td><span className={`status-badge status-${t.status.toLowerCase().replace(' ', '-')}`}>{t.status}</span></td>
                <td>
                  {t.status === 'Dispatched' && (
                    <button className="btn btn-sm btn-primary" onClick={() => handleComplete(t._id)}>Complete</button>
                  )}
                </td>
              </tr>
            ))}
            {trips.length === 0 && (
              <tr><td colSpan="8" style={{textAlign: 'center', color: '#666'}}>No trips found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Trips;
