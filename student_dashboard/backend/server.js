import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Database connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'student_dashboard',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
async function testDbConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection successful');
    connection.release();
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

testDbConnection();

// Routes
app.get('/api/dashboard', async (req, res) => {
  try {
    // Get all applications count
    const [applications] = await pool.query(
      'SELECT COUNT(*) as count FROM applications'
    );
    
    // Get interviews count
    const [interviews] = await pool.query(
      'SELECT COUNT(*) as count FROM applications WHERE status = "interviews"'
    );
    
    // Get offers count
    const [offers] = await pool.query(
      'SELECT COUNT(*) as count FROM applications WHERE status = "offers"'
    );
    
    // Get applications with upcoming deadlines
    const [deadlines] = await pool.query(
      'SELECT COUNT(*) as count FROM applications WHERE deadline IS NOT NULL AND deadline >= CURDATE()'
    );
    
    res.json({
      applications: applications[0].count,
      interviews: interviews[0].count,
      offers: offers[0].count,
      deadlines: deadlines[0].count
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
});

app.get('/api/applications', async (req, res) => {
  try {
    // Get applications by status
    const [applications] = await pool.query(
      'SELECT * FROM applications ORDER BY created_at DESC'
    );
    
    // Group applications by status
    const result = {
      applied: [],
      shortlisted: [],
      interviews: [],
      offers: [],
      rejected: []
    };
    
    applications.forEach(app => {
      if (result[app.status]) {
        result[app.status].push({
          id: app.id,
          company: app.company,
          position: app.position,
          deadline: app.deadline ? new Date(app.deadline).toISOString().split('T')[0] : null,
          appliedDate: new Date(app.applied_date).toISOString().split('T')[0],
          notes: app.notes
        });
      }
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
});

app.post('/api/applications', async (req, res) => {
  try {
    const { company, position, deadline, notes } = req.body;
    
    const [result] = await pool.query(
      'INSERT INTO applications (company, position, deadline, status, notes, applied_date) VALUES (?, ?, ?, "applied", ?, NOW())',
      [company, position, deadline || null, notes || null]
    );
    
    res.status(201).json({ 
      id: result.insertId,
      message: 'Application created successfully' 
    });
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ message: 'Failed to create application' });
  }
});

app.put('/api/applications/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['applied', 'shortlisted', 'interviews', 'offers', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    await pool.query(
      'UPDATE applications SET status = ? WHERE id = ?',
      [status, id]
    );
    
    res.json({ message: 'Application status updated successfully' });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ message: 'Failed to update application status' });
  }
});

app.put('/api/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { company, position, deadline, notes } = req.body;
    
    await pool.query(
      'UPDATE applications SET company = ?, position = ?, deadline = ?, notes = ? WHERE id = ?',
      [company, position, deadline || null, notes || null, id]
    );
    
    res.json({ message: 'Application updated successfully' });
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ message: 'Failed to update application' });
  }
});

app.delete('/api/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.query('DELETE FROM applications WHERE id = ?', [id]);
    
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ message: 'Failed to delete application' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});