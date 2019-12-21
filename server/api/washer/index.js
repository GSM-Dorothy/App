const Router = require('koa-router')
const washer = new Router()
const washerCtrl = require('./washer.controller')

washer.get('/:floor/:location', washerCtrl.findWasher)
washer.put('/status', washerCtrl.changeStatus)

module.exports = washer
