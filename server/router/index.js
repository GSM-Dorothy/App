const Router = require('koa-router')

const index = new Router()

const { jwtVerifyMiddleware } = require('lib/decode_token')

index.get('/', jwtVerifyMiddleware, (ctx, next) => {
  ctx.body = 'GET ' + ctx.request.path
})

index.get('/meals', jwtVerifyMiddleware, (ctx, next) => {
  ctx.body = 'GET ' + ctx.request.path
})

index.get('/washer', jwtVerifyMiddleware, (ctx, next) => {
  ctx.body = 'GET ' + ctx.request.path
})

index.get('/schedule', jwtVerifyMiddleware, (ctx, next) => {
  ctx.body = 'GET ' + ctx.request.path
})

index.get('/point', jwtVerifyMiddleware, (ctx, next) => {
  ctx.body = 'GET ' + ctx.request.path
})

module.exports = index
