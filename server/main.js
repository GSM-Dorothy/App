require('dotenv').config()

const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const cors = require('@koa/cors')

const app = new Koa()
const router = new Router()
const index = require('./router/index')
const api = require('./api')

const mongoose = require('mongoose')

mongoose.Promise = global.Promise

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(response => {
  console.log('Successfully connected to mongodb')
}).catch(e => {
  console.error(e)
})

router.use('', index.routes())
router.use('', api.routes())

app.use(cors())

app.use(bodyParser({
  detectJSON: function (ctx) {
    return /\.json$/i.test(ctx.path)
  }
})).use(router.routes()).use(router.allowedMethods())

app.listen(80, () => {
  console.log('Server is listening to port 80')
})
