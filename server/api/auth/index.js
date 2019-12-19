const Router = require('koa-router')
const auth = new Router()
const authCtrl = require('./auth.controller')

auth.post('/code/validate', authCtrl.validateCode)
auth.post('/code', authCtrl.generateCode)
auth.delete('/code', authCtrl.revokeCode)

module.exports = auth
