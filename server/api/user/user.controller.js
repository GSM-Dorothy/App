const User = require('models/user')

exports.createUser = async (ctx) => {
  let userInfo = ctx.request.body

  ctx.body = await User.createUser(userInfo)
}
