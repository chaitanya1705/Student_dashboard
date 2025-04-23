import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './JobListings.css';

export default function JobListings() {
  const navigate = useNavigate();
  const [jobListings, setJobListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    company: '',
    position: '',
    location: ''
  });
  
  // Mock data for the frontend demo
  const mockJobListings = [
    {id: 1, company: 'Google', position: 'Software Engineer', deadline: '2025-06-15', location: 'Bangalore', jobType: 'Full-time'},
    {id: 2, company: 'Google', position: 'Data Scientist', deadline: '2025-05-30', location: 'Hyderabad', jobType: 'Full-time'},
    {id: 3, company: 'Microsoft', position: 'UX Designer', deadline: '2025-05-25', location: 'Bangalore', jobType: 'Full-time'},
    {id: 4, company: 'Microsoft', position: 'Frontend Developer', deadline: '2025-06-10', location: 'Hyderabad', jobType: 'Full-time'},
    {id: 5, company: 'Amazon', position: 'ML Engineer', deadline: '2025-05-20', location: 'Bangalore', jobType: 'Full-time'},
    {id: 6, company: 'Amazon', position: 'Backend Developer', deadline: '2025-06-05', location: 'Chennai', jobType: 'Full-time'},
    {id: 7, company: 'IBM', position: 'Data Analyst', deadline: '2025-05-15', location: 'Pune', jobType: 'Full-time'},
    {id: 8, company: 'IBM', position: 'Cloud Engineer', deadline: '2025-06-20', location: 'Bangalore', jobType: 'Full-time'},
    {id: 9, company: 'Apple', position: 'iOS Developer', deadline: '2025-06-25', location: 'Hyderabad', jobType: 'Full-time'},
    {id: 10, company: 'Apple', position: 'Machine Learning Engineer', deadline: '2025-05-28', location: 'Bangalore', jobType: 'Full-time'}
  ];
  
  // Filter unique companies for dropdown
  const companies = [...new Set(mockJobListings.map(job => job.company))];
  
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setJobListings(mockJobListings);
      setLoading(false);
    }, 500);
  }, []);
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({...prev, [name]: value}));
  };
  
  const filteredJobs = jobListings.filter(job => {
    return (
      (filter.company === '' || job.company === filter.company) &&
      (filter.position === '' || job.position.toLowerCase().includes(filter.position.toLowerCase())) &&
      (filter.location === '' || job.location.toLowerCase().includes(filter.location.toLowerCase()))
    );
  });
  
  const handleApplyClick = (jobId) => {
    navigate(`/apply/${jobId}`);
  };
  
  return (
    <div className="container">
      <header className="header">
        <div className="logo">
          <img src="/pes-logo.png" alt="PES University" />
        </div>
        <h1 className="title">Job Listings</h1>
      </header>
      
      <div className="content">
        <div className="filters-container">
          <h2 className="subtitle">Available Positions</h2>
          <div className="filters">
            <div className="filter-group">
              <label className="filter-label">Company</label>
              <select 
                name="company" 
                value={filter.company} 
                onChange={handleFilterChange}
                className="filter-control"
              >
                <option value="">All Companies</option>
                {companies.map(company => (
                  <option key={company} value={company}>{company}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Position</label>
              <input
                type="text"
                name="position"
                value={filter.position}
                onChange={handleFilterChange}
                placeholder="Search positions..."
                className="filter-control"
              />
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Location</label>
              <input
                type="text"
                name="location"
                value={filter.location}
                onChange={handleFilterChange}
                placeholder="Search locations..."
                className="filter-control"
              />
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="loading">Loading job listings...</div>
        ) : (
          <div className="job-listings">
            {filteredJobs.length === 0 ? (
              <div className="no-jobs">No jobs match your criteria</div>
            ) : (
              filteredJobs.map(job => (
                <div key={job.id} className="job-card">
                  <div className="job-header">
                    <h3 className="job-title">{job.position}</h3>
                    <span className="job-company">{job.company}</span>
                  </div>
                  <div className="job-details">
                    <div className="job-location">
                      <span className="icon">📍</span> {job.location}
                    </div>
                    <div className="job-type">
                      <span className="icon">💼</span> {job.jobType}
                    </div>
                    <div className="job-deadline">
                      <span className="icon">⏰</span> Apply by: {job.deadline}
                    </div>
                  </div>
                  <button 
                    className="apply-button"
                    onClick={() => handleApplyClick(job.id)}
                  >
                    Apply Now
                  </button>
                </div>
              ))
            )}
          </div>
        )}
        
        <div className="back-button-container">
          <button 
            className="button button-secondary"
            onClick={() => navigate('/')}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}