const User = require('models/user')
const { STUDENT, ADMINISTRATOR } = require('actions/auth_code')

exports.validateUser = async (ctx, next) => {
  let userID = ctx.state.userID
  let foundUser = await User.findUserByID(userID)

  ctx.assert(foundUser, 401, 'This user is not exist!')

  ctx.state.foundUser = foundUser

  return next()
}

exports.validateStudent = async (ctx, next) => {
  let userID = ctx.state.userID
  let foundUser = await User.findUserByID(userID)

  ctx.assert(foundUser && foundUser.userType === STUDENT, 401, 'This user is not exist(or is not student)!')

  ctx.state.foundUser = foundUser

  return next()
}

exports.validateAdministrator = async (ctx, next) => {
  let userID = ctx.state.userID
  let foundUser = await User.findUserByID(userID)

  ctx.assert(foundUser && foundUser.userType === ADMINISTRATOR, 401, 'This user is not exist(or is not administrator)!')

  ctx.state.foundUser = foundUser
  
  return next()
}
