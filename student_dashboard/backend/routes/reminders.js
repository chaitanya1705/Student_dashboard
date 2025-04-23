const express = require('express');
const router = express.Router();
const pool = require('../database/db');

// Get all reminders
router.get('/', async (req, res) => {
  try {
    const [reminders] = await pool.query('SELECT * FROM reminders ORDER BY reminder_date ASC');
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
    res.status(201).json({ id: result.insertId, message: 'Reminder created successfully' });
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
    await pool.query('UPDATE reminders SET is_completed = ? WHERE id = ?', [is_completed, id]);
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
