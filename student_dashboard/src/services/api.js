// src/services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Dashboard data
export const fetchDashboardData = async () => {
  try {
    const response = await api.get('/dashboard');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

// Applications
export const fetchApplications = async () => {
  try {
    const response = await api.get('/applications');
    return response.data;
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
};

export const createApplication = async (applicationData) => {
  try {
    const response = await api.post('/applications', applicationData);
    return response.data;
  } catch (error) {
    console.error('Error creating application:', error);
    throw error;
  }
};

export const updateApplicationStatus = async (id, status) => {
  try {
    const response = await api.put(`/applications/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating application status:', error);
    throw error;
  }
};

export const updateApplication = async (id, applicationData) => {
  try {
    const response = await api.put(`/applications/${id}`, applicationData);
    return response.data;
  } catch (error) {
    console.error('Error updating application:', error);
    throw error;
  }
};

export const deleteApplication = async (id) => {
  try {
    const response = await api.delete(`/applications/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting application:', error);
    throw error;
  }
};

// Reminders
export const fetchReminders = async () => {
  try {
    const response = await api.get('/reminders');
    return response.data;
  } catch (error) {
    console.error('Error fetching reminders:', error);
    throw error;
  }
};

export const createReminder = async (reminderData) => {
  try {
    const response = await api.post('/reminders', reminderData);
    return response.data;
  } catch (error) {
    console.error('Error creating reminder:', error);
    throw error;
  }
};

export const updateReminder = async (id, completed) => {
  try {
    const response = await api.put(`/reminders/${id}`, { is_completed: completed });
    return response.data;
  } catch (error) {
    console.error('Error updating reminder:', error);
    throw error;
  }
};

export const deleteReminder = async (id) => {
  try {
    const response = await api.delete(`/reminders/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting reminder:', error);
    throw error;
  }
};

// src/hooks/useApplications.js
import { useState, useEffect } from 'react';
import { 
  fetchApplications, 
  createApplication, 
  updateApplicationStatus, 
  updateApplication, 
  deleteApplication 
} from '../services/api';

export const useApplications = () => {
  const [applications, setApplications] = useState({
    applied: [],
    shortlisted: [],
    interviews: [],
    offers: [],
    rejected: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadApplications = async () => {
      try {
        setLoading(true);
        const data = await fetchApplications();
        setApplications(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load applications');
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  const addApplication = async (applicationData) => {
    try {
      const result = await createApplication(applicationData);
      // Refresh applications
      const data = await fetchApplications();
      setApplications(data);
      return result;
    } catch (err) {
      setError('Failed to add application');
      throw err;
    }
  };

  const moveApplication = async (id, fromStatus, toStatus) => {
    try {
      await updateApplicationStatus(id, toStatus);
      
      // Update local state for immediate feedback
      const updatedApplications = {...applications};
      const appIndex = updatedApplications[fromStatus].findIndex(app => app.id === id);
      
      if (appIndex !== -1) {
        const app = updatedApplications[fromStatus][appIndex];
        updatedApplications[fromStatus] = updatedApplications[fromStatus].filter(a => a.id !== id);
        updatedApplications[toStatus] = [...updatedApplications[toStatus], app];
        setApplications(updatedApplications);
      }
    } catch (err) {
      setError('Failed to update application status');
      throw err;
    }
  };

  const editApplication = async (id, applicationData) => {
    try {
      await updateApplication(id, applicationData);
      // Refresh applications
      const data = await fetchApplications();
      setApplications(data);
    } catch (err) {
      setError('Failed to update application');
      throw err;
    }
  };

  const removeApplication = async (id, status) => {
    try {
      await deleteApplication(id);
      
      // Update local state
      const updatedApplications = {...applications};
      updatedApplications[status] = updatedApplications[status].filter(app => app.id !== id);
      setApplications(updatedApplications);
    } catch (err) {
      setError('Failed to delete application');
      throw err;
    }
  };

  return {
    applications,
    loading,
    error,
    addApplication,
    moveApplication,
    editApplication,
    removeApplication
  };
};

// backend/routes/reminders.js
const express = require('express');
const router = express.Router();
const pool = require('../database/db');

// Get all reminders
router.get('/', async (req, res) => {
  try {
    const [reminders] = await pool.query(
      'SELECT * FROM reminders ORDER BY reminder_date ASC'
    );
    
    res.json(reminders);
  } catch (error) {
    console.error('Error fetching reminders:', error);
    res.status(500).json({ message: 'Failed to fetch reminders' });
  }
});

// Create a new reminder
router.post('/', async (req, res) => {
  try {
    const { application_id, reminder_date, title, description } = req.body;
    
    const [result] = await pool.query(
      'INSERT INTO reminders (application_id, reminder_date, title, description) VALUES (?, ?, ?, ?)',
      [application_id, reminder_date, title, description || null]
    );
    
    res.status(201).json({ 
      id: result.insertId,
      message: 'Reminder created successfully' 
    });
  } catch (error) {
    console.error('Error creating reminder:', error);
    res.status(500).json({ message: 'Failed to create reminder' });
  }
});

// Update reminder completion status
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { is_completed } = req.body;
    
    await pool.query(
      'UPDATE reminders SET is_completed = ? WHERE id = ?',
      [is_completed, id]
    );
    
    res.json({ message: 'Reminder updated successfully' });
  } catch (error) {
    console.error('Error updating reminder:', error);
    res.status(500).json({ message: 'Failed to update reminder' });
  }
});

// Delete a reminder
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.query('DELETE FROM reminders WHERE id = ?', [id]);
    
    res.json({ message: 'Reminder deleted successfully' });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    res.status(500).json({ message: 'Failed to delete reminder' });
  }
});

module.exports = router;