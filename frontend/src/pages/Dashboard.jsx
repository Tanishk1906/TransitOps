import { useState, useEffect } from 'react';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    activeVehicles: 0, availableVehicles: 0, inShopVehicles: 0,
    activeTrips: 0, pendingTrips: 0, driversOnDuty: 0, utilization: 0
  });
  const [recentTrips, setRecentTrips] = useState([]);

  useEffect(() => {
    // Fetch Dashboard Stats
    api.get('/dashboard/stats').then(res => setStats(res.data.data)).catch(() => {});
    // Fetch Recent Trips
    api.get('/trips?limit=5').then(res => setRecentTrips(res.data.data)).catch(() => {});
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Operational Dashboard</h1>
      </div>

      {/* KPI Grid */}
      <div className="kpi-grid">
        <div className="kpi-card" style={{borderLeftColor: '#28a745'}}>
          <h3>Available Vehicles</h3>
          <div className="kpi-value">{stats.availableVehicles}</div>
        </div>
        <div className="kpi-card" style={{borderLeftColor: '#007bff'}}>
          <h3>Active Vehicles</h3>
          <div className="kpi-value">{stats.activeVehicles}</div>
        </div>
        <div className="kpi-card" style={{borderLeftColor: '#ffc107'}}>
          <h3>In Shop</h3>
          <div className="kpi-value">{stats.inShopVehicles}</div>
        </div>
        <div className="kpi-card" style={{borderLeftColor: '#17a2b8'}}>
          <h3>Active Trips</h3>
          <div className="kpi-value">{stats.activeTrips}</div>
        </div>
        <div className="kpi-card" style={{borderLeftColor: '#6c757d'}}>
          <h3>Drivers On Duty</h3>
          <div className="kpi-value">{stats.driversOnDuty}</div>
        </div>
        <div className="kpi-card" style={{borderLeftColor: '#dc3545'}}>
          <h3>Fleet Utilization</h3>
          <div className="kpi-value">{stats.utilization}%</div>
        </div>
      </div>

      {/* Recent Trips Table */}
      <div className="card">
        <h3 style={{marginBottom: '15px'}}>Recent Trip Activity</h3>
        <table>
          <thead>
            <tr><th>Trip ID</th><th>Route</th><th>Vehicle</th><th>Driver</th><th>Status</th></tr>
          </thead>
          <tbody>
            {recentTrips.length === 0 ? (
              <tr><td colSpan="5" style={{textAlign: 'center', color: '#666'}}>No recent trips found.</td></tr>
            ) : (
              recentTrips.map(trip => (
                <tr key={trip._id || trip.id}>
                  <td>#{(trip._id || trip.id).slice(-6).toUpperCase()}</td>
                  <td>{trip.source} → {trip.destination}</td>
                  <td>{trip.vehicleId?.registrationNumber || trip.vehicle}</td>
                  <td>{trip.driverId?.name || trip.driver}</td>
                  <td><span className={`status-badge status-${trip.status.toLowerCase().replace(' ', '-')}`}>{trip.status}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;