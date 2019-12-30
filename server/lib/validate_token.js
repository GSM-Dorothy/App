const jwt = require('jsonwebtoken')

const Token = require('models/token')
const { TOKEN_UNAUTHORIZED, TOKEN_NON_EXIST } = require('actions/token')

exports.validateTokenMiddleware = async (ctx, next) => {
  const accessToken = ctx.request.headers['x-access-token']

  ctx.request.token_validated = false

  if (!accessToken) {
    ctx.throw(401, TOKEN_NON_EXIST + ': Access token is not exist!')
  }

  let foundTokenData = await Token.findToken(accessToken)

  if (foundTokenData) {
    try {
      jwt.verify(accessToken, process.env.SECRET)
    } catch (e) {
      let result = await Token.revokeToken(accessToken)

      if (result.n !== 1 || result.deletedCount !== 1 || result.ok !== 1) {
        ctx.throw(401, 'Error occured while revoking token.')
      }
    }

    let userID = foundTokenData.userID

    ctx.request.token_validated = true
    ctx.request.userID = userID
  } else {
    ctx.throw(401, TOKEN_UNAUTHORIZED + ': Please provide a valid token.')
  }

  return next()
}
