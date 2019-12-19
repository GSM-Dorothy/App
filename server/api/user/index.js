const Router = require('koa-router')
const user = new Router()
const userCtrl = require('./user.controller')

user.post('/user', userCtrl.createUser)

module.exports = user
