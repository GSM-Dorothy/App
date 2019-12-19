const Router = require('koa-router')

const api = new Router()
const auth = require('./auth')
const user = require('./user')
const school = require('./school')

api.use('/auth', auth.routes())
api.use('/auth', user.routes())
api.use('/school', school.routes())

module.exports = api
