const jwt = require('jsonwebtoken')

const Token = require('models/token')
const { TOKEN_UNAUTHORIZED, TOKEN_NON_EXIST } = require('actions/token')

exports.validateTokenMiddleware = async (ctx, next) => {
  const accessToken = ctx.request.headers['x-access-token']

  ctx.assert(accessToken, 401, TOKEN_NON_EXIST + ': Access token is not exist!')

  let tokenData = await Token.findToken(accessToken)

  ctx.assert(tokenData, 401, TOKEN_UNAUTHORIZED + ': Please grant your token first.')

  try {
    jwt.verify(accessToken, process.env.SECRET)
  } catch (e) {
    let result = await Token.revokeToken(accessToken)

    ctx.assert(result.n === 1 && result.deletedCount === 1 && result.ok === 1, 401, 'Error occured while revoking token.')
  }

  ctx.request.userID = tokenData.userID

  return next()
}
