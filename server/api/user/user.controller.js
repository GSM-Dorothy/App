const User = require('models/user')
const AuthCode = require('models/auth_code')
const PointArchive = require('models/point_archive')

const { STUDENT } = require('actions/auth_code')
const { TOKEN_UNAUTHORIZED } = require('actions/token')

const _ = require('lodash')

exports.createUser = async (ctx) => {
  let userInfo = ctx.request.body
  let enteredCode = userInfo.code

  let foundUser = await AuthCode.validateCode(enteredCode)

  if (!foundUser) {
    ctx.throw(401, 'Provided user code is invalid!')
  }

  let enteredUserInfo = {
    userType: userInfo.userType,
    name: userInfo.name
  }

  let foundUserInfo = {
    userType: foundUser.userType,
    name: foundUser.name
  }

  if (_.isEqual(enteredUserInfo, foundUserInfo)) {
    await AuthCode.revokeCode(enteredCode)
    delete userInfo.code

    ctx.body = await User.createUser(userInfo)
  } else {
    ctx.throw(401, 'User can\'t be created!')
  }
}

exports.findStudent = async (ctx) => {
  if (!ctx.request.token_validated) {
    ctx.throw(401, TOKEN_UNAUTHORIZED + ': Please grant your token first.')
  }

  let userID = ctx.request.userID

  let foundUser = await User.findUserByID(userID)

  if (foundUser && foundUser.userType === STUDENT) {
    foundUser = JSON.parse(JSON.stringify(foundUser))

    delete foundUser.password
    delete foundUser.__v
    delete foundUser._id
    delete foundUser.refreshToken
    delete foundUser.fingerprint

    ctx.body = foundUser
  } else {
    ctx.throw(401, 'This user is not student!(or is not exist)')
  }
}

exports.findPointArchiveByStudentInfo = async (ctx) => {
  if (!ctx.request.token_validated) {
    ctx.throw(401, TOKEN_UNAUTHORIZED + ': Please grant your token first.')
  }

  let userID = ctx.request.userID

  let foundUser = await User.findUserByID(userID)

  if (foundUser) {
    let studentInfo = {
      grade: ctx.params.grade,
      class: ctx.params.class,
      number: ctx.params.number
    }

    ctx.body = await PointArchive.findPointArchive(studentInfo)
  } else {
    ctx.throw(401, 'This user is not student!(or is not exist)')
  }
}

exports.addPointArchive = async (ctx) => {
  let userInfo = ctx.request.body

  let foundUser = await User.findUserByID(userInfo.userID)

  if (foundUser && foundUser.userType === STUDENT) {
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
