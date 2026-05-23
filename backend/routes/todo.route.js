const express = require('express')
const router = express.Router()
const {verifyToken} = require('../middleware/auth.middleware')
const {
    createTodo,
    getAllTodos,
    getTodo,
    updateTodo,
    deleteTodo
} = require('../controller/todo.controller')

router.use(verifyToken)

router.post('/', createTodo)
router.get('/', getAllTodos)
router.get('/:id', getTodo)
router.put('/:id', updateTodo)
router.delete('/:id', deleteTodo)

module.exports = router