const Todo = require('../models/todo.model')

// Create Todo
const createTodo = async (req, res) => {
    try {
        const { title, description, priority, dueDate } = req.body

        if (!title) {
            return res.status(400).json({ error: 'Title is required' })
        }

        const todo = await Todo.create({
            userId: req.user.id,  
            title,
            description,
            priority,
            dueDate,
        })

        res.status(201).json({ success: true, todo })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// Get All Todos 
const getAllTodos = async (req, res) => {
    try {
        const todos = await Todo.find({ userId: req.user.id })
            .sort({ createdAt: -1 }) // naye first

        res.status(200).json({ success: true, todos })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// Get Single Todo
const getTodo = async (req, res) => {
    try {
        const todo = await Todo.findOne({
            _id: req.params.id,
            userId: req.user.id  
        })

        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' })
        }

        res.status(200).json({ success: true, todo })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// Update Todo
const updateTodo = async (req, res) => {
    try {
        const { title, description, completed, priority, dueDate } = req.body

        const todo = await Todo.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.id  // sirf apna update kar sake
            },
            { title, description, completed, priority, dueDate },
            { new: true }  // updated todo return karo
        )

        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' })
        }

        res.status(200).json({ success: true, todo })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// Delete Todo
const deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id  // sirf apna delete kar sake
        })

        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' })
        }

        res.status(200).json({ success: true, message: 'Todo deleted' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = {
    createTodo,
    getAllTodos,
    getTodo,
    updateTodo,
    deleteTodo
}