const User = require('models/user')
const AuthCode = require('models/auth_code')
const PointArchive = require('models/point_archive')

const _ = require('lodash')

exports.createUser = async (ctx) => {
  let userInfo = ctx.request.body

  let foundUser = await AuthCode.validateCode(userInfo.code)

  let foundUserInfo = {
    email: foundUser.email,
    password: foundUser.password,
    phone: foundUser.phone,
    name: foundUser.name
  }

  if (_.isEqual(userInfo, foundUserInfo)) {
    ctx.body = await User.createUser(userInfo)
  } else {
    ctx.body = 'User can\'t be created!'
  }
}

exports.findUserByID = async (ctx) => {
  ctx.body = await User.findUserByID(ctx.params.id)
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
