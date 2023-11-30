const express = require('express');
const {addTodoValidatorMW, updateTodoValidatorMW} = require('../validators/todo.validator')
const todoController = require('../controller/todo.contoller')

const todoRouter =express.Router()


// get all todo
todoRouter.get('/', todoController.getAllTodo)

// create a todo route to post todos
todoRouter.post('/add', addTodoValidatorMW, todoController.postNewTodo )


// get by id params
todoRouter.get('/:id', todoController.getTodoById)


// update todo by id
todoRouter.patch('/update/:id', updateTodoValidatorMW, todoController.updateTodoById)


// delete todo by ID
todoRouter.delete('/del/:id', todoController.deleteTodoByID)






module.exports = todoRouter