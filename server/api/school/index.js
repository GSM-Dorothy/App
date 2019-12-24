const Router = require('koa-router')
const school = new Router()
const schoolCtrl = require('./school.controller')

school.get('/meal/:year/:month', schoolCtrl.getMeal)
school.get('/meal/:year/:month/:day', schoolCtrl.getMeal)
school.get('/schedule/:year/:month/:day', schoolCtrl.getSchedule)

school.get('/remain/administrator', schoolCtrl.getRemainAdministrator)
school.get('/remain/administrator/:year/:month/:day', schoolCtrl.getRemainAdministratorByDate)
school.post('/remain/administrator', schoolCtrl.addRemainAdministrator)
school.put('/remain/administrator', schoolCtrl.replaceRemainAdministrator)

school.get('/remain/enroll/:id', schoolCtrl.findRemainEnrollByUser)
school.post('/remain/enroll', schoolCtrl.addEnrollList)
school.delete('/remain/enroll', schoolCtrl.deleteEnrollList)

school.get('/remain/archive/:id', schoolCtrl.findRemainArchiveByUser)
school.post('/remain/archive', schoolCtrl.addRemainArchive)
school.delete('/remain/archive', schoolCtrl.deleteRemainArchive)

module.exports = school
