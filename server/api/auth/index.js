const Router = require('koa-router')
const auth = new Router()
const authCtrl = require('./auth.controller')

auth.post('/signup', authCtrl.validateUser)

module.exports = auth
