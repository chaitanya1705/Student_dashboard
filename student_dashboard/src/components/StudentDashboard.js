import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    applications: 12,
    interviews: 3, 
    offers: 2,
    deadlines: 5
  });
  
  const [applications, setApplications] = useState({
    applied: [
      { id: 1, company: 'Google', position: 'Data Scientist', deadline: '2025-05-15' },
      { id: 2, company: 'IBM', position: 'Data Analyst', deadline: '2025-05-20' }
    ],
    shortlisted: [
      { id: 3, company: 'Microsoft', position: 'UX Designer', deadline: '2025-04-30' }
    ],
    interviews: [
      { id: 4, company: 'Amazon', position: 'ML Engineer', deadline: '2025-04-25' }
    ],
    offers: [
      { id: 5, company: 'Google', position: 'Software Engineer', deadline: null }
    ],
    rejected: [
      { id: 6, company: 'Apple', position: 'iOS Developer', deadline: null }
    ]
  });
  
  const [draggedItem, setDraggedItem] = useState(null);
  const [newApplication, setNewApplication] = useState({
    company: '',
    position: '',
    deadline: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  
  // In a real app, this would fetch from API
  // useEffect(() => {
  //   const fetchData = async () => {
  //     // API calls would go here
  //   };
  //   fetchData();
  // }, []);
  
  const handleDragStart = (item, status) => {
    setDraggedItem({ item, status });
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleDrop = (targetStatus) => {
    if (!draggedItem) return;
    
    const { item, status } = draggedItem;
    if (status === targetStatus) return;
    
    // Remove from source column
    const updatedApplications = {...applications};
    updatedApplications[status] = updatedApplications[status].filter(
      app => app.id !== item.id
    );
    
    // Add to target column
    updatedApplications[targetStatus] = [...updatedApplications[targetStatus], item];
    
    // Update dashboard counts
    const newDashboardData = {...dashboardData};
    if (targetStatus === 'interviews') newDashboardData.interviews++;
    if (targetStatus === 'offers') newDashboardData.offers++;
    if (status === 'interviews') newDashboardData.interviews--;
    if (status === 'offers') newDashboardData.offers--;
    
    setApplications(updatedApplications);
    setDashboardData(newDashboardData);
    setDraggedItem(null);
  };
  
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewApplication(prev => ({...prev, [name]: value}));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create new application
    const newApp = {
      id: Math.max(...Object.values(applications).flat().map(app => app.id)) + 1,
      ...newApplication
    };
    
    // Add to applied column
    setApplications(prev => ({
      ...prev,
      applied: [...prev.applied, newApp]
    }));
    
    // Update dashboard counts
    setDashboardData(prev => ({
      ...prev,
      applications: prev.applications + 1,
      deadlines: newApplication.deadline ? prev.deadlines + 1 : prev.deadlines
    }));
    
    // Reset form
    setNewApplication({ company: '', position: '', deadline: '' });
    setShowAddForm(false);
  };
  
  const navigateToJobListings = () => {
    navigate('/job-listings');
  };
  
  return (
    <div className="container">
      <header className="header">
        <div className="logo">
          <img src="pes-logo.png" alt="PES University" />
        </div>
        <h1 className="title">Module 1: Student Dashboard & Application Management</h1>
      </header>
      
      {/* Dashboard Stats */}
      <div className="dashboard">
        <div className="decorator decorator-1"></div>
        <div className="decorator decorator-2"></div>
        <div className="decorator decorator-3"></div>
        
        <div className="dashboard-title">
          <span className="dashboard-title-badge">Student Dashboard</span>
        </div>
        <div className="stats-grid">
          <div className="stat-card stat-applications">
            <div className="stat-value">{dashboardData.applications}</div>
            <div className="stat-label">Applications</div>
          </div>
          <div className="stat-card stat-interviews">
            <div className="stat-value">{dashboardData.interviews}</div>
            <div className="stat-label">Interviews</div>
          </div>
          <div className="stat-card stat-offers">
            <div className="stat-value">{dashboardData.offers}</div>
            <div className="stat-label">Offers</div>
          </div>
          <div className="stat-card stat-deadlines">
            <div className="stat-value">{dashboardData.deadlines}</div>
            <div className="stat-label">Deadlines</div>
          </div>
        </div>
      </div>
      
      {/* Application Tracker */}
      <div className="content">
        <div className="tracker-header">
          <h2 className="subtitle">Application Tracker</h2>
          <div className="button-group">
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className={`button ${showAddForm ? 'button-secondary' : 'button-primary'}`}
            >
              {showAddForm ? 'Cancel' : 'Add Application'}
            </button>
            <button 
              onClick={navigateToJobListings}
              className="button button-success"
            >
              Apply for Jobs
            </button>
          </div>
        </div>
        
        {/* Add Application Form */}
        {showAddForm && (
          <div className="form-container">
            <h3 className="form-title">Add New Application</h3>
            <form onSubmit={handleSubmit} className="form-grid">
              <div className="form-group">
                <label className="form-label">Company</label>
                <input
                  type="text"
                  name="company"
                  value={newApplication.company}
                  onChange={handleFormChange}
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Position</label>
                <input
                  type="text"
                  name="position"
                  value={newApplication.position}
                  onChange={handleFormChange}
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Deadline (optional)</label>
                <input
                  type="date"
                  name="deadline"
                  value={newApplication.deadline}
                  onChange={handleFormChange}
                  className="form-control"
                />
              </div>
              <div className="form-buttons">
                <button 
                  type="submit" 
                  className="button button-success"
                >
                  Save Application
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Kanban Board */}
        <div className="kanban-board">
          {/* Applied Column */}
          <div 
            className="kanban-column column-applied"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop('applied')}
          >
            <h3 className="column-heading">Applied</h3>
            {applications.applied.map(app => (
              <div 
                key={app.id}
                draggable
                onDragStart={() => handleDragStart(app, 'applied')}
                className="app-card"
              >
                <h4 className="app-company">{app.company}</h4>
                <p className="app-position">{app.position}</p>
                {app.deadline && (
                  <p className="app-deadline">Due: {app.deadline}</p>
                )}
              </div>
            ))}
          </div>
          
          {/* Shortlisted Column */}
          <div 
            className="kanban-column column-shortlisted"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop('shortlisted')}
          >
            <h3 className="column-heading">Shortlisted</h3>
            {applications.shortlisted.map(app => (
              <div 
                key={app.id}
                draggable
                onDragStart={() => handleDragStart(app, 'shortlisted')}
                className="app-card"
              >
                <h4 className="app-company">{app.company}</h4>
                <p className="app-position">{app.position}</p>
                {app.deadline && (
                  <p className="app-deadline">Due: {app.deadline}</p>
                )}
              </div>
            ))}
          </div>
          
          {/* Interviews Column */}
          <div 
            className="kanban-column column-interviews"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop('interviews')}
          >
            <h3 className="column-heading">Interviews</h3>
            {applications.interviews.map(app => (
              <div 
                key={app.id}
                draggable
                onDragStart={() => handleDragStart(app, 'interviews')}
                className="app-card"
              >
                <h4 className="app-company">{app.company}</h4>
                <p className="app-position">{app.position}</p>
                {app.deadline && (
                  <p className="app-deadline">Due: {app.deadline}</p>
                )}
              </div>
            ))}
          </div>
          
          {/* Offers Column */}
          <div 
            className="kanban-column column-offers"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop('offers')}
          >
            <h3 className="column-heading">Offers</h3>
            {applications.offers.map(app => (
              <div 
                key={app.id}
                draggable
                onDragStart={() => handleDragStart(app, 'offers')}
                className="app-card"
              >
                <h4 className="app-company">{app.company}</h4>
                <p className="app-position">{app.position}</p>
              </div>
            ))}
          </div>
          
          {/* Rejected Column */}
          <div 
            className="kanban-column column-rejected"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop('rejected')}
          >
            <h3 className="column-heading">Rejected</h3>
            {applications.rejected.map(app => (
              <div 
                key={app.id}
                draggable
                onDragStart={() => handleDragStart(app, 'rejected')}
                className="app-card"
              >
                <h4 className="app-company">{app.company}</h4>
                <p className="app-position">{app.position}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}