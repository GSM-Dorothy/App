const Router = require('koa-router')
const school = new Router()
const schoolCtrl = require('./school.controller')

school.get('/meal/:year/:month/:day', schoolCtrl.getMeal)
school.get('/schedule/:year/:month/:day', schoolCtrl.getSchedule)

module.exports = school
