import { useState, useEffect } from 'react';
import api from '../services/api';
import { Truck, Navigation, Users, CheckCircle, AlertTriangle, Activity } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    activeVehicles: 0, availableVehicles: 0, inShopVehicles: 0,
    activeTrips: 0, pendingTrips: 0, driversOnDuty: 0, utilization: 0
  });
  const [recentTrips, setRecentTrips] = useState([]);

  useEffect(() => {
    api.get('/dashboard/stats').then(res => setStats(res.data.data)).catch(() => {});
    api.get('/trips?limit=5').then(res => setRecentTrips(res.data.data)).catch(() => {});
  }, []);

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div>
          <h1>Operational Dashboard</h1>
          <p className="subtitle">Real-time overview of your fleet and trip activity</p>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card stats-available">
          <div className="kpi-content">
            <h3>Available Vehicles</h3>
            <div className="kpi-value">{stats.availableVehicles}</div>
          </div>
          <div className="kpi-icon icon-available"><CheckCircle size={24} /></div>
        </div>

        <div className="kpi-card stats-active-v">
          <div className="kpi-content">
            <h3>Active Vehicles</h3>
            <div className="kpi-value">{stats.activeVehicles}</div>
          </div>
          <div className="kpi-icon icon-active-v"><Truck size={24} /></div>
        </div>

        <div className="kpi-card stats-in-shop">
          <div className="kpi-content">
            <h3>In Shop</h3>
            <div className="kpi-value">{stats.inShopVehicles}</div>
          </div>
          <div className="kpi-icon icon-in-shop"><AlertTriangle size={24} /></div>
        </div>

        <div className="kpi-card stats-active-t">
          <div className="kpi-content">
            <h3>Active Trips</h3>
            <div className="kpi-value">{stats.activeTrips}</div>
          </div>
          <div className="kpi-icon icon-active-t"><Navigation size={24} /></div>
        </div>

        <div className="kpi-card stats-drivers">
          <div className="kpi-content">
            <h3>Drivers On Duty</h3>
            <div className="kpi-value">{stats.driversOnDuty}</div>
          </div>
          <div className="kpi-icon icon-drivers"><Users size={24} /></div>
        </div>

        <div className="kpi-card stats-utilization">
          <div className="kpi-content">
            <h3>Fleet Utilization</h3>
            <div className="kpi-value">{stats.utilization}%</div>
          </div>
          <div className="kpi-icon icon-utilization"><Activity size={24} /></div>
        </div>
      </div>

      <div className="card table-card">
        <div className="card-header">
          <h3>Recent Trip Activity</h3>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Trip ID</th>
                <th>Route</th>
                <th>Vehicle</th>
                <th>Driver</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTrips.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-row">
                    No recent trips found.
                  </td>
                </tr>
              ) : (
                recentTrips.map(trip => (
                  <tr key={trip._id || trip.id}>
                    <td className="trip-id">
                      #{(trip._id || trip.id).slice(-6).toUpperCase()}
                    </td>
                    <td className="route-cell">
                      <span>{trip.source}</span>
                      <span className="arrow">→</span>
                      <span>{trip.destination}</span>
                    </td>
                    <td>{trip.vehicleId?.registrationNumber || trip.vehicle}</td>
                    <td>{trip.driverId?.name || trip.driver}</td>
                    <td>
                      <span className={`status-badge status-${trip.status.toLowerCase().replace(' ', '-')}`}>
                        {trip.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
