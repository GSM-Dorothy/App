const Koa = require('koa')
const Router = require('koa-router')

const app = new Koa()
const router = new Router()
const index = require('./router/index');

router.use('', index.routes());

app.use(router.routes()).use(router.allowedMethods())

app.listen(8080, () => {
  console.log('Server is listening to port 8080')
})
