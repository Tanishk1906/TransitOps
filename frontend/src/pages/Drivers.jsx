import { useState, useEffect } from 'react';
import api from '../services/api';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newDriver, setNewDriver] = useState({
    name: '', licenseNumber: '', licenseCategory: 'Class C',
    licenseExpiryDate: '', contactNumber: ''
  });

  const fetchDrivers = () => {
    api.get('/drivers').then(res => setDrivers(res.data.data)).catch(() => {});
  };

  useEffect(() => { fetchDrivers(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/drivers', newDriver);
      alert('✅ Driver registered!');
      setShowForm(false);
      fetchDrivers();
    } catch (error) {
      alert('❌ Error registering driver.');
    }
  };

  const isExpired = (date) => new Date(date) < new Date();

  return (
    <div>
      <div className="page-header">
        <h1>Driver Management</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ Register Driver</button>
      </div>

      {showForm && (
        <div className="card">
          <h3>Add Driver Profile</h3>
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group"><label>Full Name *</label><input value={newDriver.name} onChange={e => setNewDriver({...newDriver, name: e.target.value})} required /></div>
            <div className="form-group"><label>License Number *</label><input value={newDriver.licenseNumber} onChange={e => setNewDriver({...newDriver, licenseNumber: e.target.value})} required /></div>
            <div className="form-group"><label>License Category</label>
              <select value={newDriver.licenseCategory} onChange={e => setNewDriver({...newDriver, licenseCategory: e.target.value})}>
                <option>Class A</option><option>Class B</option><option>Class C</option><option>Class D</option>
              </select>
            </div>
            <div className="form-group"><label>Expiry Date *</label><input type="date" value={newDriver.licenseExpiryDate} onChange={e => setNewDriver({...newDriver, licenseExpiryDate: e.target.value})} required /></div>
            <div className="form-group"><label>Contact Number *</label><input value={newDriver.contactNumber} onChange={e => setNewDriver({...newDriver, contactNumber: e.target.value})} required /></div>
            <div className="full-width"><button type="submit" className="btn btn-success">Save Driver</button></div>
          </form>
        </div>
      )}

      <div className="card">
        <table>
          <thead><tr><th>Name</th><th>License No.</th><th>Category</th><th>Expiry Date</th><th>Safety Score</th><th>Status</th></tr></thead>
          <tbody>
            {drivers.map(d => (

              <tr key={d._id} style={{ backgroundColor: isExpired(d.licenseExpiryDate) ? '#ffebee' : 'transparent' }}>
                <td><strong>{d.name}</strong></td>
                <td>{d.licenseNumber}</td><td>{d.licenseCategory}</td>
                <td>{new Date(d.licenseExpiryDate).toLocaleDateString()} {isExpired(d.licenseExpiryDate) && <span style={{color: 'red', fontWeight: 'bold'}}>⚠️ EXPIRED</span>}</td>
                <td>{d.safetyScore}</td>
                <td><span className={`status-badge status-${d.status.toLowerCase().replace(' ', '-')}`}>{d.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Drivers;
