const _ = require('lodash')

const User = require('models/user')
const AuthCode = require('models/auth_code')
const PointArchive = require('models/point_archive')

const { STUDENT, ADMINISTRATOR } = require('actions/auth_code')

exports.createUser = async (ctx) => {
  let userInfo = ctx.request.body
  let enteredCode = userInfo.code

  let foundUser = await AuthCode.validateCode(enteredCode)

  if (!foundUser) {
    ctx.throw(401, 'Provided user code is invalid!')
  }

  userInfo.userType = foundUser.userType

  await AuthCode.revokeCode(enteredCode)

  delete userInfo.code

  ctx.body = await User.createUser(userInfo)
}

exports.findStudent = async (ctx) => {
  let userID = ctx.request.userID
  let foundUser = await User.findUserByID(userID)

  if (!foundUser || foundUser.userType !== STUDENT) {
    ctx.throw(401, 'This user is not exist(or is not student)!')
  }

  foundUser = JSON.parse(JSON.stringify(foundUser))

  delete foundUser.password
  delete foundUser.__v
  delete foundUser._id
  delete foundUser.refreshToken
  delete foundUser.fingerprint
  delete foundUser.userType

  ctx.body = foundUser
}

exports.findPointArchiveByStudent = async (ctx) => {
  let userID = ctx.request.userID
  let foundUser = await User.findUserByID(userID)

  if (!foundUser || foundUser.userType !== STUDENT) {
    ctx.throw(401, 'This user is not exist(or is not student)!')
  }

  let studentInfo = {
    grade: foundUser.studentInfo.grade,
    class: foundUser.studentInfo.class,
    number: foundUser.studentInfo.number
  }

  ctx.body = await PointArchive.findPointArchive(studentInfo)
}

exports.findPointArchiveByAdmin = async (ctx) => {
  let userID = ctx.request.userID
  let foundUser = await User.findUserByID(userID)

  if (!foundUser || foundUser.userType !== ADMINISTRATOR) {
    ctx.throw(401, 'This user is not exist(or is not administrator!')
  }

  let studentInfo = {
    grade: ctx.params.grade,
    class: ctx.params.class,
    number: ctx.params.number
  }

  ctx.body = await PointArchive.findPointArchive(studentInfo)
}

exports.addPointArchive = async (ctx) => {
  let userID = ctx.request.userID
  let currentUser = await User.findUserByID(userID)

  if (!currentUser || currentUser.userType !== ADMINISTRATOR) {
    ctx.throw(401, 'This user is not exist(or is not adminisrator)!')
  }

  let userInfo = ctx.request.body
  let foundUser = await User.findUserByID(userInfo.userID)

  if (!foundUser || foundUser.userType !== STUDENT) {
    ctx.throw(401, 'This user is not exist(or is not student)!')
  }

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
    ctx.throw(401, 'Student information you provided is invalid.')
  }
}

exports.updatePointArchive = async (ctx) => {
  let userID = ctx.request.userID
  let currentUser = await User.findUserByID(userID)

  if (!currentUser || currentUser.userType !== ADMINISTRATOR) {
    ctx.throw(401, 'This user is not exist(or is not adminisrator)!')
  }

  let studentInfo = ctx.request.body.studentInfo
  let archive = ctx.request.body.archive

  let result = await PointArchive.updatePointArchive(studentInfo, archive)

  if (result.n === 1 && result.nModified === 1 && result.ok === 1) {
    ctx.body = 'This student\'s point archive has successfully added/updated.'
  } else {
    ctx.throw(401, 'This student\'s point archive wasn\'t successfully added/updated.')
  }
}

exports.deletePointArchive = async (ctx) => {
  let userID = ctx.request.userID
  let currentUser = await User.findUserByID(userID)

  if (!currentUser || currentUser.userType !== ADMINISTRATOR) {
    ctx.throw(401, 'This user is not exist(or is not adminisrator)!')
  }

  let studentInfo = ctx.request.body.studentInfo
  let archive = ctx.request.body.archive

  let result = await PointArchive.deletePointArchive(studentInfo, archive)

  if (result.n === 1 && result.nModified === 1 && result.ok === 1) {
    ctx.body = 'Part of the archive of point was deleted as you requested.'
  } else {
    ctx.throw(401, 'Part of the archive of point wasn\'t deleted properly.')
  }
}
