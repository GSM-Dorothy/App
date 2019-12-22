const User = require('models/user')
const AuthCode = require('models/auth_code')
const PointArchive = require('models/point_archive')

const AuthCodeType = require('actions/auth_code')

const _ = require('lodash')

exports.createUser = async (ctx) => {
  let userInfo = ctx.request.body
  let enteredCode = userInfo.code

  let foundUser = await AuthCode.validateCode(enteredCode)

  let enteredUserInfo = {
    userType: userInfo.userType,
    email: userInfo.email,
    password: userInfo.password,
    phone: userInfo.phone,
    name: userInfo.name
  }

  let foundUserInfo = {
    userType: foundUser.userType,
    email: foundUser.email,
    password: foundUser.password,
    phone: foundUser.phone,
    name: foundUser.name
  }

  if (_.isEqual(enteredUserInfo, foundUserInfo)) {
    await AuthCode.revokeCode(enteredCode)
    delete userInfo.code

    ctx.body = await User.createUser(userInfo)
  } else {
    ctx.body = 'User can\'t be created!'
  }
}

exports.findStudentByID = async (ctx) => {
  let foundUser = await User.findUserByID(ctx.params.id)

  if (foundUser.userType !== AuthCodeType.STUDENT) {
    ctx.body = 'This user is not student!'
    return
  }

  foundUser = JSON.parse(JSON.stringify(foundUser))

  delete foundUser.password

  ctx.body = foundUser
}

exports.findPointArchiveByStudentInfo = async (ctx) => {
  let studentInfo = {
    grade: ctx.params.grade,
    class: ctx.params.class,
    number: ctx.params.number,
    name: ctx.params.name
  }

  ctx.body = await PointArchive.findAllPointArchive(studentInfo)
}

exports.addPointArchive = async (ctx) => {
  let pointArchive = ctx.request.body
  ctx.body = await PointArchive.addPointArchive(pointArchive)
}

exports.updatePointArchive = async (ctx) => {
  let pointArchive = ctx.request.body
  ctx.body = await PointArchive.updatePointArchive(pointArchive)
}

exports.deletePointArchive = async (ctx) => {
  let pointArchive = ctx.request.body
  ctx.body = await PointArchive.deletePointArchive(pointArchive)
}
