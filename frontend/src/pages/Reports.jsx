import { useState, useEffect } from 'react';
import api from '../services/api';

const Reports = () => {
  const [metrics, setMetrics] = useState({ totalFuelCost: 0, totalMaintCost: 0, avgEfficiency: 0, avgROI: 0 });
  const [vehicleReports, setVehicleReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/reports/financial').then(res => {
      setMetrics(res.data.data.metrics || res.data.data);
      setVehicleReports(res.data.data.vehicles || []);
    }).catch(() => {}).finally(() => setIsLoading(false));
  }, []);

  // Hackathon Pro-Tip: Vanilla JS CSV Export (No libraries needed)
  const exportCSV = () => {
    const headers = ['Vehicle', 'Total Revenue', 'Fuel Cost', 'Maint Cost', 'Distance', 'Fuel Used', 'Efficiency', 'ROI'];
    const rows = vehicleReports.map(v => [
      v.registrationNumber, v.revenue, v.fuelCost, v.maintCost, v.distance, v.fuelUsed, v.efficiency, v.roi
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `TransitOps_Financial_Report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (isLoading) return <div className="card"><p>Loading financial data...</p></div>;

  return (
    <div>
      <div className="page-header">
        <h1>Financial Reports & Analytics</h1>
        <button className="btn btn-success" onClick={exportCSV}>⬇ Export CSV</button>
      </div>

      {/* Summary Metrics */}
      <div className="kpi-grid">
        <div className="kpi-card" style={{borderLeftColor: '#dc3545'}}>
          <h3>Total Fuel Cost</h3>
          <div className="kpi-value">${metrics.totalFuelCost.toLocaleString()}</div>
        </div>
        <div className="kpi-card" style={{borderLeftColor: '#ffc107'}}>
          <h3>Total Maint. Cost</h3>
          <div className="kpi-value">${metrics.totalMaintCost.toLocaleString()}</div>
        </div>
        <div className="kpi-card" style={{borderLeftColor: '#17a2b8'}}>
          <h3>Avg Fuel Efficiency</h3>
          <div className="kpi-value">{metrics.avgEfficiency} km/L</div>
        </div>
        <div className="kpi-card" style={{borderLeftColor: '#28a745'}}>
          <h3>Avg Fleet ROI</h3>
          <div className="kpi-value">{metrics.avgROI}%</div>
        </div>
      </div>

      {/* Detailed Vehicle Breakdown */}
      <div className="card">
        <h3 style={{marginBottom: '15px'}}>Vehicle Profitability Breakdown</h3>
        <table>
          <thead>
            <tr>
              <th>Vehicle</th><th>Revenue</th><th>Fuel Cost</th><th>Maint. Cost</th>
              <th>Distance (km)</th><th>Fuel (L)</th><th>Efficiency</th><th>ROI</th>
            </tr>
          </thead>
          <tbody>
            {vehicleReports.length === 0 ? (
              <tr><td colSpan="8" style={{textAlign:'center', color:'#666'}}>No financial data available yet.</td></tr>
            ) : (
              vehicleReports.map(v => (
                <tr key={v._id || v.registrationNumber}>
                  <td><strong>{v.registrationNumber}</strong></td>
                  <td>${v.revenue || 0}</td>
                  <td style={{color: 'red'}}>${v.fuelCost || 0}</td>
                  <td style={{color: 'orange'}}>${v.maintCost || 0}</td>
                  <td>{v.distance || 0}</td>
                  <td>{v.fuelUsed || 0}</td>
                  <td>{v.efficiency || 0} km/L</td>
                  <td style={{fontWeight: 'bold', color: v.roi > 0 ? 'green' : 'red'}}>{v.roi || 0}%</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;