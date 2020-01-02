const Router = require('koa-router')
const school = new Router()

const schoolCtrl = require('./school.controller')
const remainCtrl = require('./remain.controller')
const washerCtrl = require('./washer.controller')

const { validateTokenMiddleware } = require('lib/validate_token')
const { validateUser, validateStudent, validateAdministrator } = require('lib/validate_user_type')

school.get('/meal/:year/:month', schoolCtrl.getMeal)
school.get('/meal/:year/:month/:day', schoolCtrl.getMeal)

school.get('/schedule/:year/:month/', schoolCtrl.getSchedule)
school.get('/schedule/:year/:month/:day', schoolCtrl.getSchedule)

school.get('/remain/administrator/:year/:month', validateTokenMiddleware, validateUser, remainCtrl.getRemainAdministratorByDate)
school.get('/remain/administrator/:year/:month/:day', validateTokenMiddleware, validateUser, remainCtrl.getRemainAdministratorByDate)
school.post('/remain/administrator', validateTokenMiddleware, validateAdministrator, remainCtrl.addRemainAdministrator)
school.put('/remain/administrator', validateTokenMiddleware, validateAdministrator, remainCtrl.replaceRemainAdministrator)

school.get('/remain/enroll/:year/:month', validateTokenMiddleware, validateUser, remainCtrl.findRemainEnroll)
school.get('/remain/enroll/:year/:month/:day', validateTokenMiddleware, validateUser, remainCtrl.findRemainEnroll)
school.post('/remain/enroll', validateTokenMiddleware, validateStudent, remainCtrl.addEnrollList)
school.delete('/remain/enroll', validateTokenMiddleware, validateUser, remainCtrl.deleteEnrollList)

school.get('/remain/archive/:year/:month', validateTokenMiddleware, validateUser, remainCtrl.findRemainArchive)
school.get('/remain/archive/:year/:month/:day', validateTokenMiddleware, validateUser, remainCtrl.findRemainArchive)
school.post('/remain/archive', validateTokenMiddleware, validateStudent, remainCtrl.addRemainArchive)
school.delete('/remain/archive', validateTokenMiddleware, validateUser, remainCtrl.deleteRemainArchive)

school.get('/washer/:floor/:location', validateTokenMiddleware, validateUser, washerCtrl.findWasher)
school.post('/washer', validateTokenMiddleware, validateAdministrator, washerCtrl.addWasher)
school.put('/washer', validateTokenMiddleware, validateStudent, washerCtrl.changeStatus)

module.exports = school
