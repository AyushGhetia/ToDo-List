const express = require('express');
const Task = require('../models/Tasks');
const auth = require('../middleware/auth');
const router = express.Router();

module.exports = (io) => {
    router.get('/', auth, async (req, res) => {
        try {
            const tasks = await Task.find({ userId: req.user.id });
            res.json(tasks);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching tasks' });
        }
    });

    router.post('/', auth, async (req, res) => {
        const { text } = req.body;
        try {
            const task = new Task({ text, userId: req.user.id });
            await task.save();
            io.emit('updateTasks');
            res.json(task);
        } catch (error) {
            res.status(500).json({ error: 'Error saving task' });
        }
    });

    router.put('/:id', auth, async (req, res) => {
        const { text, completed } = req.body;
        try {
            const task = await Task.findByIdAndUpdate(req.params.id, { text, completed }, { new: true });
            io.emit('updateTasks');
            res.json(task);
        } catch (error) {
            res.status(500).json({ error: 'Error updating task' });
        }
    });

    router.delete('/:id', auth, async (req, res) => {
        try {
            await Task.findByIdAndDelete(req.params.id);
            io.emit('updateTasks');
            res.sendStatus(204);
        } catch (error) {
            res.status(500).json({ error: 'Error deleting task' });
        }
    });

    return router;
};
