const _ = require('lodash')

const User = require('models/user')
const AuthCode = require('models/auth_code')

const { STUDENT } = require('actions/auth_code')

exports.createUser = async (ctx) => {
  let registerInfo = ctx.request.body
  let code = registerInfo.code

  let foundUser = await AuthCode.validateCode(code)

  ctx.assert(foundUser, 401, 'Provided user code is invalid!')

  let userInfo = {
    userType: foundUser.userInfo.userType,
    name: foundUser.userInfo.name,
    email: registerInfo.email,
    password: registerInfo.password,
    phone: registerInfo.phone,
    studentInfo: foundUser.userInfo.studentInfo,
    administratorInfo: foundUser.userInfo.administratorInfo
  }

  await AuthCode.revokeCode(code)

  ctx.body = await User.createUser(userInfo)
}

exports.findStudent = async (ctx) => {
  let foundUser = ctx.state.foundUser

  foundUser = JSON.parse(JSON.stringify(foundUser))

  delete foundUser.password
  delete foundUser.__v
  delete foundUser._id
  delete foundUser.refreshToken
  delete foundUser.fingerprint
  delete foundUser.userType

  ctx.body = foundUser
}

exports.findAllStudents = async (ctx) => {
  let foundUsers = await User.findAllStudents()

  for (let i in foundUsers) {
    foundUsers[i] = {
      userType: foundUsers[i].userType,
      studentInfo: foundUsers[i].studentInfo,
      _id: foundUsers[i]._id,
      name: foundUsers[i].name
    }
  }

  ctx.body = foundUsers
}

exports.findPointArchiveByStudent = async (ctx) => {
  let foundUser = ctx.state.foundUser

  let studentInfo = {
    grade: foundUser.studentInfo.grade,
    class: foundUser.studentInfo.class,
    number: foundUser.studentInfo.number
  }

  ctx.body = await User.findPointArchive(studentInfo)
}

exports.findPointArchiveByAdmin = async (ctx) => {
  let studentInfo = {
    grade: ctx.params.grade,
    class: ctx.params.class,
    number: ctx.params.number
  }

  ctx.body = await User.findPointArchive(studentInfo)
}

exports.addPointArchive = async (ctx) => {
  let userInfo = ctx.request.body

  let enteredUserInfo = {
    grade: userInfo.grade,
    class: userInfo.class,
    number: userInfo.number
  }

  let foundUser = await User.findUserWithStudentInfo(enteredUserInfo)

  ctx.assert(foundUser && foundUser.userType === STUDENT, 401, 'This student is not exist(or is not student)!')
  let foundUserInfo = {
    grade: foundUser.studentInfo.grade,
    class: foundUser.studentInfo.class,
    number: foundUser.studentInfo.number
  }

  ctx.assert(_.isEqual(enteredUserInfo, foundUserInfo), 401, 'Student information you provided does not match with anyone in student list.')

  foundUserInfo.room = foundUser.studentInfo.room
  foundUserInfo.name = foundUser.name

  ctx.body = await User.addPointArchive(userInfo)
}

exports.updatePointArchive = async (ctx) => {
  let studentInfo = ctx.request.body.studentInfo
  let archive = ctx.request.body.archive

  let result = await User.updatePointArchive(studentInfo, archive)

  ctx.assert(result.n === 1 && result.nModified === 1 && result.ok === 1, 401, 'This student\'s point archive wasn\'t successfully added/updated.')

  ctx.body = 'This student\'s point archive has successfully added/updated.'
}

exports.deletePointArchive = async (ctx) => {
  let studentInfo = ctx.request.body.studentInfo
  let archive = ctx.request.body.archive

  let result = await User.deletePointArchive(studentInfo, archive)

  ctx.assert(result.n === 1 && result.deletedCount === 1 && result.ok === 1, 401, 'Part of the archive of point wasn\'t deleted properly.')

  ctx.body = 'Part of the archive of point was deleted as you requested.'
}
