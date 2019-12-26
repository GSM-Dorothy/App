const jwt = require('jsonwebtoken')
const { TOKEN_EXPIRED, TOKEN_NON_EXIST } = require('actions/token')

exports.jwtVerifyMiddleware = async ctx => {
  const accessToken = ctx.request.body.accessToken || ctx.request.query.accessToken || ctx.request.headers['x-access-token']

  if (accessToken) {
    jwt.verify(accessToken, process.env.SECRET, function (err, decoded) {
      if (err) {
        ctx.body = TOKEN_EXPIRED
        return
      }
      ctx.body = decoded
    })
  } else {
    ctx.body = TOKEN_NON_EXIST
  }
}
