import { useState } from 'react';

const Trips = () => {
  const [trips, setTrips] = useState([
    { id: 1, source: 'Delhi', dest: 'Mumbai', vehicle: 'VAN-05', driver: 'Alex', weight: 450, status: 'Dispatched' }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newTrip, setNewTrip] = useState({ source: '', dest: '', vehicle: '', driver: '', weight: 0, distance: 0 });

  const handleDispatch = (e) => {
    e.preventDefault();
    
    // MOCK BUSINESS RULE VALIDATION
    // Assuming VAN-05 has max capacity of 500kg
    if (newTrip.vehicle === 'VAN-05' && newTrip.weight > 500) {
        alert("❌ Error: Cargo weight exceeds vehicle capacity (Max 500kg)!");
        return;
    }

    // If valid, add trip and change statuses (Mocking the backend transaction)
    setTrips([...trips, { ...newTrip, id: Date.now(), status: 'Dispatched' }]);
    alert("✅ Trip Dispatched! Vehicle & Driver status changed to 'On Trip'.");
    setShowForm(false);
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
            
            {/* Notice we ONLY show 'Available' vehicles in the dropdown */}
            <div className="form-group">
                <label>Select Vehicle (Available Only)</label>
                <select value={newTrip.vehicle} onChange={e => setNewTrip({...newTrip, vehicle: e.target.value})} required>
                    <option value="">Select Vehicle</option>
                    <option value="VAN-05">VAN-05 (Max: 500kg)</option>
                    <option value="VAN-06">VAN-06 (Max: 750kg)</option>
                </select>
            </div>
            <div className="form-group">
                <label>Select Driver (Valid License Only)</label>
                <select value={newTrip.driver} onChange={e => setNewTrip({...newTrip, driver: e.target.value})} required>
                    <option value="">Select Driver</option>
                    <option value="Alex">Alex (Expires: 2026)</option>
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
            <tr><th>Source</th><th>Destination</th><th>Vehicle</th><th>Driver</th><th>Weight</th><th>Status</th></tr>
          </thead>
          <tbody>
            {trips.map(t => (
              <tr key={t.id}>
                <td>{t.source}</td><td>{t.dest}</td><td>{t.vehicle}</td><td>{t.driver}</td>
                <td>{t.weight} kg</td>
                <td><span className={`status-badge status-${t.status.toLowerCase()}`}>{t.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Trips;