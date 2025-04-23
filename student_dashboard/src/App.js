import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentDashboard from './components/StudentDashboard';
import JobListings from './components/JobListings';
import JobApplication from './components/JobApplication';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StudentDashboard />} />
        <Route path="/job-listings" element={<JobListings />} />
        <Route path="/apply/:jobId" element={<JobApplication />} />
      </Routes>
    </Router>
  );
}

export default App;