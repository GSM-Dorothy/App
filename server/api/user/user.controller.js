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
    name: userInfo.name
  }

  let foundUserInfo = {
    userType: foundUser.userInfo.userType,
    name: foundUser.userInfo.name
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

  ctx.body = await PointArchive.findPointArchive(studentInfo)
}

exports.addPointArchive = async (ctx) => {
  let userInfo = ctx.request.body

  let foundUser = await User.findUserByID(userInfo.userID)

  if (foundUser && foundUser.userType === AuthCodeType.STUDENT) {
    let enteredUserInfo = {
      grade: userInfo.grade,
      class: userInfo.class,
      number: userInfo.number
    }

    let foundUserInfo = {
      grade: foundUser.studentInfo.grade,
      class: foundUser.studentInfo.class,
      number: foundUser.studentInfo.number
    }

    if (_.isEqual(enteredUserInfo, foundUserInfo)) {
      ctx.body = await PointArchive.addPointArchive(userInfo)
    } else {
      ctx.body = 'Student information you provided is invalid.'
    }
  } else {
    ctx.body = 'This user is not exist(or is not student)!'
  }
}

exports.updatePointArchive = async (ctx) => {
  let studentInfo = ctx.request.body.studentInfo
  let archive = ctx.request.body.archive

  let result = await PointArchive.updatePointArchive(studentInfo, archive)

  if (result.n === 1 && result.nModified === 1 && result.ok === 1) {
    ctx.body = 'This student\'s point archive has successfully added/updated.'
  } else {
    ctx.body = 'This student\'s point archive wasn\'t successfully added/updated.'
  }
}

exports.deletePointArchive = async (ctx) => {
  let studentInfo = ctx.request.body.studentInfo
  let archive = ctx.request.body.archive

  let result = await PointArchive.deletePointArchive(studentInfo, archive)

  if (result.n === 1 && result.nModified === 1 && result.ok === 1) {
    ctx.body = 'Part of the archive of point was deleted as you requested.'
  } else {
    ctx.body = 'Part of the archive of point wasn\'t deleted properly.'
  }
}
