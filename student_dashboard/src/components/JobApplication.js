import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './JobApplication.css';

export default function JobApplication() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    education: '',
    experience: '',
    skills: '',
    coverLetter: ''
  });
  const [resume, setResume] = useState(null);
  const [resumeAnalysis, setResumeAnalysis] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Mock data for frontend demo
  const mockJobData = {
    id: jobId,
    company: 'Google',
    position: 'Software Engineer',
    deadline: '2025-06-15',
    location: 'Bangalore',
    jobType: 'Full-time',
    description: 'Join our team to build innovative solutions that impact millions of users worldwide. You will work on challenging problems that require creative thinking and technical excellence.',
    requirements: 'BS degree in Computer Science or related field, strong programming skills in at least one language, knowledge of data structures and algorithms, excellent problem-solving abilities.'
  };
  
  useEffect(() => {
    // Simulate API call to fetch job details
    setTimeout(() => {
      setJob(mockJobData);
      setLoading(false);
    }, 500);
  }, [jobId]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };
  
  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResume(file);
      setShowAnalysis(false);
      setResumeAnalysis(null);
    }
  };
  
  const handleAnalyzeResume = () => {
    if (!resume) return;
    
    setShowAnalysis(true);
    
    // Simulate resume analysis
    setTimeout(() => {
      // Mock resume analysis results
      setResumeAnalysis({
        matchScore: 85,
        strengths: [
          'Strong programming background',
          'Relevant project experience',
          'Technical skills match job requirements'
        ],
        improvements: [
          'Consider adding more details about teamwork experience',
          'Highlight any Google-specific technologies you\'ve worked with',
          'Include quantifiable achievements'
        ],
        keywordMatches: [
          'Java',
          'Python',
          'Data structures',
          'Algorithms',
          'Problem-solving'
        ]
      });
    }, 1500);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulate API call to submit application
    setTimeout(() => {
      setSubmitted(true);
    }, 1000);
  };
  
  if (loading) {
    return (
      <div className="container">
        <header className="header">
          <div className="logo">
            <img src="/pes-logo.png" alt="PES University" />
          </div>
          <h1 className="title">Job Application</h1>
        </header>
        <div className="loading">Loading job details...</div>
      </div>
    );
  }
  
  if (submitted) {
    return (
      <div className="container">
        <header className="header">
          <div className="logo">
            <img src="/pes-logo.png" alt="PES University" />
          </div>
          <h1 className="title">Job Application</h1>
        </header>
        <div className="success-container">
          <div className="success-icon">✓</div>
          <h2 className="success-title">Application Submitted Successfully!</h2>
          <p className="success-message">
            Your application for the {job.position} position at {job.company} has been submitted.
            You will receive a confirmation email shortly.
          </p>
          <div className="button-container">
            <button
              className="button button-primary"
              onClick={() => navigate('/job-listings')}
            >
              Browse More Jobs
            </button>
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
  
  return (
    <div className="container">
      <header className="header">
        <div className="logo">
          <img src="/pes-logo.png" alt="PES University" />
        </div>
        <h1 className="title">Job Application</h1>
      </header>
      
      <div className="content">
        <div className="job-details-banner">
          <h2 className="job-title">{job.position}</h2>
          <div className="job-company">{job.company}</div>
          <div className="job-meta">
            <span className="job-location">📍 {job.location}</span>
            <span className="job-type">💼 {job.jobType}</span>
            <span className="job-deadline">⏰ Apply by: {job.deadline}</span>
          </div>
        </div>
        
        <div className="job-description-container">
          <div className="job-section">
            <h3 className="section-title">Job Description</h3>
            <p className="section-content">{job.description}</p>
          </div>
          <div className="job-section">
            <h3 className="section-title">Requirements</h3>
            <p className="section-content">{job.requirements}</p>
          </div>
        </div>
        
        <div className="application-container">
          <h2 className="form-title">Submit Your Application</h2>
          <form onSubmit={handleSubmit} className="application-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Education</label>
              <textarea
                name="education"
                value={formData.education}
                onChange={handleInputChange}
                className="form-control"
                rows="3"
                placeholder="Degree, University, Year of Graduation"
                required
              ></textarea>
            </div>
            
            <div className="form-group">
              <label className="form-label">Work Experience</label>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="form-control"
                rows="3"
                placeholder="Previous roles, companies, and responsibilities"
                required
              ></textarea>
            </div>
            
            <div className="form-group">
              <label className="form-label">Skills</label>
              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                className="form-control"
                rows="3"
                placeholder="Technical skills, soft skills, certifications"
                required
              ></textarea>
            </div>
            
            <div className="form-group">
              <label className="form-label">Cover Letter</label>
              <textarea
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleInputChange}
                className="form-control"
                rows="5"
                placeholder="Why you're interested in this position and how your experience makes you a good fit"
                required
              ></textarea>
            </div>
            
            <div className="form-group resume-upload">
              <label className="form-label">Resume/CV</label>
              <div className="resume-input-container">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeChange}
                  className="resume-input"
                  required
                />
                {resume && (
                  <button
                    type="button"
                    className="analyze-button"
                    onClick={handleAnalyzeResume}
                  >
                    Analyze Resume
                  </button>
                )}
              </div>
              {resume && (
                <p className="file-selected">
                  Selected file: {resume.name}
                </p>
              )}
            </div>
            
            {showAnalysis && (
              <div className="resume-analysis">
                <h3 className="analysis-title">Resume Analysis</h3>
                
                {!resumeAnalysis ? (
                  <div className="analysis-loading">Analyzing your resume...</div>
                ) : (
                  <div className="analysis-results">
                    <div className="analysis-score">
                      <div className="score-circle">
                        <span className="score-value">{resumeAnalysis.matchScore}%</span>
                      </div>
                      <span className="score-label">Match Score</span>
                    </div>
                    
                    <div className="analysis-details">
                      <div className="analysis-section">
                        <h4 className="analysis-section-title">Strengths</h4>
                        <ul className="analysis-list">
                          {resumeAnalysis.strengths.map((strength, index) => (
                            <li key={index} className="analysis-item">{strength}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="analysis-section">
                        <h4 className="analysis-section-title">Suggested Improvements</h4>
                        <ul className="analysis-list">
                          {resumeAnalysis.improvements.map((improvement, index) => (
                            <li key={index} className="analysis-item">{improvement}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="analysis-section">
                        <h4 className="analysis-section-title">Keyword Matches</h4>
                        <div className="keyword-matches">
                          {resumeAnalysis.keywordMatches.map((keyword, index) => (
                            <span key={index} className="keyword-badge">{keyword}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="form-buttons">
              <button
                type="button"
                className="button button-secondary"
                onClick={() => navigate('/job-listings')}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="button button-primary"
              >
                Submit Application
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}