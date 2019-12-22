const Router = require('koa-router')
const auth = new Router()
const authCtrl = require('./auth.controller')

auth.post('/code/validate', authCtrl.validateCode)
auth.post('/code/student', authCtrl.generateStudentCode)
auth.post('/code/administrator', authCtrl.generateAdministratorCode)
auth.delete('/code', authCtrl.revokeCode)

module.exports = auth
