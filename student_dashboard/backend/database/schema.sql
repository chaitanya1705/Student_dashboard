-- Create database
CREATE DATABASE IF NOT EXISTS student_dashboard;
USE student_dashboard;

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company VARCHAR(100) NOT NULL,
  position VARCHAR(100) NOT NULL,
  status ENUM('applied', 'shortlisted', 'interviews', 'offers', 'rejected') NOT NULL DEFAULT 'applied',
  applied_date DATE NOT NULL,
  deadline DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create application status history table
CREATE TABLE IF NOT EXISTS application_status_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT NOT NULL,
  old_status ENUM('applied', 'shortlisted', 'interviews', 'offers', 'rejected'),
  new_status ENUM('applied', 'shortlisted', 'interviews', 'offers', 'rejected') NOT NULL,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);

-- Create reminders table
CREATE TABLE IF NOT EXISTS reminders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT NOT NULL,
  reminder_date DATE NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20),
  position VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE SET NULL
);

-- Create job listings table
CREATE TABLE IF NOT EXISTS job_listings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company VARCHAR(100) NOT NULL,
  position VARCHAR(100) NOT NULL,
  deadline DATE NOT NULL,
  description TEXT,
  requirements TEXT,
  location VARCHAR(100),
  job_type ENUM('Full-time', 'Part-time', 'Internship') NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create job applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  job_listing_id INT NOT NULL,
  application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('Submitted', 'Under Review', 'Shortlisted', 'Rejected') DEFAULT 'Submitted',
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (job_listing_id) REFERENCES job_listings(id)
);

-- Create dashboard summary view
CREATE OR REPLACE VIEW dashboard_summary AS
SELECT
  (SELECT COUNT(*) FROM applications) AS total_applications,
  (SELECT COUNT(*) FROM applications WHERE status = 'interviews') AS total_interviews,
  (SELECT COUNT(*) FROM applications WHERE status = 'offers') AS total_offers,
  (SELECT COUNT(*) FROM applications WHERE deadline IS NOT NULL AND deadline >= CURDATE()) AS upcoming_deadlines,
  (SELECT COUNT(*) FROM reminders WHERE reminder_date >= CURDATE() AND is_completed = FALSE) AS pending_reminders;

-- Create stored procedure for moving status
DELIMITER //
CREATE PROCEDURE move_application_status(
  IN app_id INT,
  IN new_status VARCHAR(20)
)
BEGIN
  DECLARE current_status VARCHAR(20);
  SELECT status INTO current_status FROM applications WHERE id = app_id;
  UPDATE applications SET status = new_status WHERE id = app_id;
  INSERT INTO application_status_history (application_id, old_status, new_status)
  VALUES (app_id, current_status, new_status);
END //
DELIMITER ;

-- Create indexes
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_deadline ON applications(deadline);
CREATE INDEX idx_reminders_date ON reminders(reminder_date);
CREATE INDEX idx_job_listings_company ON job_listings(company);
CREATE INDEX idx_job_listings_deadline ON job_listings(deadline);
CREATE INDEX idx_job_applications_status ON job_applications(status);

-- Sample user
INSERT INTO users (email, password, first_name, last_name) VALUES
('student@pes.edu', '$2b$10$abcdefghijklmnopqrstuv', 'John', 'Smith');

-- Sample applications
INSERT INTO applications (company, position, status, applied_date, deadline, notes) VALUES
('Google', 'Data Scientist', 'applied', '2025-04-01', '2025-05-15', 'Applied through referral from Professor Williams'),
('IBM', 'Data Analyst', 'applied', '2025-04-05', '2025-05-20', 'Phone screening scheduled for next week'),
('Microsoft', 'UX Designer', 'shortlisted', '2025-03-20', '2025-04-30', 'Portfolio was well received, expecting to hear back soon'),
('Amazon', 'ML Engineer', 'interviews', '2025-03-15', '2025-04-25', 'Technical interview scheduled for April 22, 2025'),
('Google', 'Software Engineer', 'offers', '2025-02-10', NULL, 'Received offer: $120k/year with $20k signing bonus'),
('Apple', 'iOS Developer', 'rejected', '2025-02-05', NULL, 'Rejected after final interview, feedback was to improve system design skills');

-- Sample application status history
INSERT INTO application_status_history (application_id, old_status, new_status) VALUES
(1, NULL, 'applied'),
(2, NULL, 'applied'),
(3, NULL, 'applied'),
(3, 'applied', 'shortlisted'),
(4, NULL, 'applied'),
(4, 'applied', 'shortlisted'),
(4, 'shortlisted', 'interviews'),
(5, NULL, 'applied'),
(5, 'applied', 'shortlisted'),
(5, 'shortlisted', 'interviews'),
(5, 'interviews', 'offers'),
(6, NULL, 'applied'),
(6, 'applied', 'shortlisted'),
(6, 'shortlisted', 'interviews'),
(6, 'interviews', 'rejected');

-- Sample reminders
INSERT INTO reminders (application_id, reminder_date, title, description) VALUES
(1, '2025-04-25', 'Follow up with recruiter', 'If no response by April 25, send a follow-up email'),
(2, '2025-04-15', 'Prepare for phone screening', 'Review company info and prepare answers to common questions'),
(3, '2025-04-20', 'Update portfolio', 'Add recent UX case study before next interview round'),
(4, '2025-04-21', 'Technical interview prep', 'Practice machine learning algorithms and system design');

-- Sample contacts
INSERT INTO contacts (application_id, first_name, last_name, email, phone, position, notes) VALUES
(1, 'Sarah', 'Johnson', 'sjohnson@google.com', '555-123-4567', 'Technical Recruiter', 'Initial contact from career fair'),
(3, 'Michael', 'Chen', 'mchen@microsoft.com', '555-987-6543', 'Design Team Lead', 'Gave positive feedback on portfolio'),
(4, 'Priya', 'Patel', 'ppatel@amazon.com', '555-456-7890', 'Senior Data Scientist', 'Will be conducting the technical interview'),
(5, 'David', 'Wilson', 'dwilson@google.com', '555-789-0123', 'Engineering Manager', 'Final interviewer who extended the offer');

-- Sample job listings
INSERT INTO job_listings (company, position, deadline, description, requirements, location, job_type) VALUES
('Google', 'Software Engineer', '2025-06-15', 'Join our team to build innovative solutions...', 'BS in Computer Science, knowledge of algorithms and data structures', 'Bangalore', 'Full-time'),
('Google', 'Data Scientist', '2025-05-30', 'Work on cutting-edge machine learning projects...', 'MS in CS/Statistics, experience with Python, ML frameworks', 'Hyderabad', 'Full-time'),
('Microsoft', 'UX Designer', '2025-05-25', 'Design user experiences for our products...', 'UI/UX design experience, portfolio required', 'Bangalore', 'Full-time'),
('Microsoft', 'Frontend Developer', '2025-06-10', 'Build responsive web applications...', 'React, JavaScript, CSS expertise', 'Hyderabad', 'Full-time'),
('Amazon', 'ML Engineer', '2025-05-20', 'Implement machine learning solutions...', 'Experience with TensorFlow, PyTorch', 'Bangalore', 'Full-time'),
('Amazon', 'Backend Developer', '2025-06-05', 'Develop scalable backend systems...', 'Java, Spring Boot, AWS experience', 'Chennai', 'Full-time'),
('IBM', 'Data Analyst', '2025-05-15', 'Analyze business data and provide insights...', 'SQL, Excel, data visualization skills', 'Pune', 'Full-time'),
('IBM', 'Cloud Engineer', '2025-06-20', 'Work with IBM Cloud infrastructure...', 'Cloud certification, Linux knowledge', 'Bangalore', 'Full-time'),
('Apple', 'iOS Developer', '2025-06-25', 'Build mobile applications for iOS...', 'Swift, Objective-C experience', 'Hyderabad', 'Full-time'),
('Apple', 'Machine Learning Engineer', '2025-05-28', 'Work on ML models for Apple devices...', 'Deep learning experience, C++ knowledge', 'Bangalore', 'Full-time'),
('TCS', 'Systems Analyst', '2025-06-12', 'Analyze and design enterprise systems...', 'Business analysis skills, UML knowledge', 'Mumbai', 'Full-time'),
('TCS', 'Java Developer', '2025-05-18', 'Develop enterprise Java applications...', 'Java, Spring, Hibernate experience', 'Pune', 'Full-time'),
('Infosys', 'DevOps Engineer', '2025-06-30', 'Implement CI/CD pipelines...', 'Jenkins, Docker, Kubernetes experience', 'Bangalore', 'Full-time'),
('Infosys', 'QA Engineer', '2025-06-08', 'Ensure quality of software products...', 'Testing tools, automation experience', 'Chennai', 'Full-time'),
('Wipro', 'Database Administrator', '2025-07-05', 'Manage and optimize database systems...', 'Oracle, SQL Server experience', 'Hyderabad', 'Full-time'),
('Wipro', 'Network Engineer', '2025-06-22', 'Design and implement network solutions...', 'CCNA certification, network protocols knowledge', 'Bangalore', 'Full-time'),
('Adobe', 'Frontend Developer', '2025-07-15', 'Build creative web applications...', 'JavaScript, HTML/CSS expertise', 'Noida', 'Full-time'),
('Adobe', 'UI Designer', '2025-06-18', 'Design user interfaces for creative products...', 'Adobe Creative Suite, UI design experience', 'Bangalore', 'Full-time'),
('Flipkart', 'Backend Developer', '2025-06-28', 'Build scalable e-commerce systems...', 'Java, microservices experience', 'Bangalore', 'Full-time'),
('Flipkart', 'Data Engineer', '2025-07-10', 'Build data pipelines for analytics...', 'Hadoop, Spark, SQL experience', 'Hyderabad', 'Full-time'),
('Oracle', 'Database Developer', '2025-07-20', 'Develop database solutions...', 'PL/SQL, Oracle database experience', 'Bangalore', 'Full-time'),
('Oracle', 'Cloud Infrastructure Engineer', '2025-06-15', 'Work on Oracle Cloud Infrastructure...', 'OCI certification, cloud experience', 'Hyderabad', 'Full-time'),
('SAP', 'ABAP Developer', '2025-07-25', 'Develop SAP solutions...', 'ABAP, SAP modules knowledge', 'Bangalore', 'Full-time'),
('SAP', 'Business Analyst', '2025-06-30', 'Analyze business processes for SAP implementation...', 'Business process knowledge, SAP modules', 'Pune', 'Full-time'),
('Intel', 'Hardware Engineer', '2025-07-30', 'Design computer hardware components...', 'Electrical engineering degree, VLSI knowledge', 'Bangalore', 'Full-time');
