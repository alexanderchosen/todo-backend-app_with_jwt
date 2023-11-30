const express = require('express')
const {addAuthorValidatorMW,updateAuthorValidatorMW} = require('../validators/author.validator')
const authorController = require('../controller/author.controller')

const authorRoute = express.Router()

authorRoute.get('/', authorController.getAllAuthors)

authorRoute.get('/author/:id', authorController.getAuthor)

authorRoute.post('/new', addAuthorValidatorMW, authorController.createNewAuthor)

authorRoute.patch('/update/:id', updateAuthorValidatorMW, authorController.updateAuthor)

authorRoute.delete('/delete/:id', authorController.deleteAuthor)

module.exports = authorRoute