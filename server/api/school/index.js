const Router = require('koa-router')
const school = new Router()
const schoolCtrl = require('./school.controller')

const { validateTokenMiddleware } = require('lib/validate_token')

school.get('/meal/:year/:month', schoolCtrl.getMeal)
school.get('/meal/:year/:month/:day', schoolCtrl.getMeal)
school.get('/schedule/:year/:month/', schoolCtrl.getSchedule)
school.get('/schedule/:year/:month/:day', schoolCtrl.getSchedule)

school.get('/remain/administrator', validateTokenMiddleware, schoolCtrl.getRemainAdministrator)
school.get('/remain/administrator/:year/:month/:day', validateTokenMiddleware, schoolCtrl.getRemainAdministratorByDate)
school.post('/remain/administrator', validateTokenMiddleware, schoolCtrl.addRemainAdministrator)
school.put('/remain/administrator', validateTokenMiddleware, schoolCtrl.replaceRemainAdministrator)

school.get('/remain/enroll', validateTokenMiddleware, schoolCtrl.findRemainEnrollByUser)
school.post('/remain/enroll', validateTokenMiddleware, schoolCtrl.addEnrollList)
school.delete('/remain/enroll', validateTokenMiddleware, schoolCtrl.deleteEnrollList)

school.get('/remain/archive', validateTokenMiddleware, schoolCtrl.findRemainArchiveByUser)
school.post('/remain/archive', validateTokenMiddleware, schoolCtrl.addRemainArchive)
school.delete('/remain/archive', validateTokenMiddleware, schoolCtrl.deleteRemainArchive)

school.get('/washer/:floor/:location', validateTokenMiddleware, schoolCtrl.findWasher)
school.post('/washer', validateTokenMiddleware, schoolCtrl.addWasher)
school.put('/washer', validateTokenMiddleware, schoolCtrl.changeStatus)

module.exports = school
