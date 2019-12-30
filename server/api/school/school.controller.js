const SchoolAPI = require('node-school-kr')
const School = new SchoolAPI()

const RemainAdministrator = require('models/remain_administrator')
const RemainEnroll = require('models/remain_enroll')
const RemainArchive = require('models/remain_archive')

const Washer = require('models/washer')
const WasherArchive = require('models/washer_archive')

const User = require('models/user')

const { STUDENT, ADMINISTRATOR } = require('actions/auth_code')
const { OCCUPIED, RESERVED, INOPERABLE } = require('actions/washer')

School.init(SchoolAPI.Type.HIGH, SchoolAPI.Region.GWANGJU, 'F100000120')

exports.getMeal = async (ctx) => {
  let meals = await School.getMeal(ctx.params.year, ctx.params.month)

  delete meals.year
  delete meals.month
  delete meals.day
  delete meals.today

  for (let i in meals) {
    meals[i] = jsonifyMeal(meals[i])
  }

  if (ctx.params.day) {
    ctx.body = meals[ctx.params.day]
  } else {
    ctx.body = meals
  }
}

exports.getSchedule = async (ctx) => {
  let year = ctx.params.year
  let month = ctx.params.month
  const schedule = await School.getCalendar(year, month)

  delete schedule.year
  delete schedule.month

  if (ctx.params.day) {
    ctx.body = { today: schedule[ctx.params.day] }
  } else {
    ctx.body = schedule
  }
}

exports.getRemainAdministrator = async (ctx) => {
  let userID = ctx.request.userID
  let foundUser = await User.findUserByID(userID)

  if (!foundUser) {
    ctx.throw(401, 'This user is not administrator!(or is not exist)')
  }

  ctx.body = await RemainAdministrator.findAll()
}

exports.getRemainAdministratorByDate = async (ctx) => {
  let userID = ctx.request.userID
  let foundUser = await User.findUserByID(userID)

  if (!foundUser) {
    ctx.throw(401, 'This user is not administrator!(or is not exist)')
  }

  let year = parseInt(ctx.params.year)
  let month = parseInt(ctx.params.month) - 1
  let day = parseInt(ctx.params.day)

  let start, end

  if (ctx.params.day) {
    start = new Date(Date.UTC(year, month, day))
    end = new Date(Date.UTC(year, month, day + 1))
  } else {
    start = new Date(Date.UTC(year, month, 1))
    end = new Date(Date.UTC(year, month + 1, 1))
  }

  ctx.body = await RemainAdministrator.findByDate(start, end)
}

exports.addRemainAdministrator = async (ctx) => {
  let userID = ctx.request.userID
  let foundUser = await User.findUserByID(userID)

  if (!foundUser || foundUser.userType !== ADMINISTRATOR) {
    ctx.throw(401, 'This user is not administrator!(or is not exist)')
  }

  let administrator = ctx.request.body

  ctx.body = await RemainAdministrator.addAdministrator(administrator)
}

exports.replaceRemainAdministrator = async (ctx) => {
  let userID = ctx.request.userID
  let foundUser = await User.findUserByID(userID)

  if (!foundUser || foundUser.userType !== ADMINISTRATOR) {
    ctx.throw(401, 'This user is not administrator!(or is not exist)')
  }

  let administrator = ctx.request.body.administrator
  let replacedAdministrator = ctx.request.body.replacedAdministrator

  let result = await RemainAdministrator.replaceAdministrator(administrator, replacedAdministrator)

  if (result.n !== 1 || result.nModified !== 1 || result.ok !== 1) {
    ctx.throw(401, 'Remain administrator hasn\'t just completely replaced.')
  }

  ctx.body = 'Remain administrator has just completely replaced!'
}

exports.findRemainEnroll = async (ctx) => {
  let userID = ctx.request.userID
  let foundUser = await User.findUserByID(userID)

  if (!foundUser) {
    ctx.throw(401, 'This user is not exist!')
  }

  let year = parseInt(ctx.params.year)
  let month = parseInt(ctx.params.month) - 1
  let day = parseInt(ctx.params.day)

  let start, end

  if (ctx.params.day) {
    start = new Date(Date.UTC(year, month, day))
    end = new Date(Date.UTC(year, month, day + 1))
  } else {
    start = new Date(Date.UTC(year, month, 1))
    end = new Date(Date.UTC(year, month + 1, 1))
  }

  ctx.body = await RemainEnroll.findEnrollListByDate(start, end)
}

exports.addEnrollList = async (ctx) => {
  let userID = ctx.request.userID
  let foundUser = await User.findUserByID(userID)

  if (!foundUser || foundUser.userType !== STUDENT) {
    ctx.throw(401, 'This user is not exist(or is not student)!')
  }

  let enrollDate = ctx.request.body.enrollDate

  let enrollInfo = {
    userID: userID,
    enrollDate: enrollDate
  }

  ctx.body = await RemainEnroll.addEnrollList(enrollInfo)
}

exports.deleteEnrollList = async (ctx) => {
  let userID = ctx.request.userID
  let foundUser = await User.findUserByID(userID)

  if (!foundUser) {
    ctx.throw(401, 'This user is not administrator!(or is not exist)')
  }

  let enrollDate = ctx.request.body.enrollDate

  let enrollInfo = {
    userID: userID,
    enrollDate: enrollDate
  }

  let result = await RemainEnroll.deleteEnrollList(enrollInfo)

  if (result.n !== 1 || result.deleteCount !== 1 || result.ok !== 1) {
    ctx.throw(401, 'You weren\'t left from remain enroll list.')
  }

  ctx.body = 'You were left from remain enroll list!'
}

exports.findRemainArchive = async (ctx) => {
  let userID = ctx.request.userID
  let foundUser = await User.findUserByID(userID)

  if (!foundUser) {
    ctx.throw(401, 'This user is not exist!')
  }

  let year = parseInt(ctx.params.year)
  let month = parseInt(ctx.params.month) - 1
  let day = parseInt(ctx.params.day)

  let start, end

  if (ctx.params.day) {
    start = new Date(Date.UTC(year, month, day))
    end = new Date(Date.UTC(year, month, day + 1))
  } else {
    start = new Date(Date.UTC(year, month, 1))
    end = new Date(Date.UTC(year, month + 1, 1))
  }

  ctx.body = await RemainArchive.findArchiveByDate(start, end)
}

exports.addRemainArchive = async (ctx) => {
  let archiveInfo = ctx.request.body

  let userID = ctx.request.userID
  let foundUser = await User.findUserByID(userID)

  if (!foundUser || foundUser.userType !== STUDENT) {
    ctx.throw(401, 'This user is not exist(or is not administrator)!')
  }

  let _archiveInfo = {
    userID: userID,
    remainType: archiveInfo.remainType,
    startDate: archiveInfo.startDate,
    finishDate: archiveInfo.finishDate,
    reason: archiveInfo.reason
  }

  ctx.body = await RemainArchive.addArchive(_archiveInfo)
}

exports.deleteRemainArchive = async (ctx) => {
  let archiveInfo = ctx.request.body
  let userID = ctx.request.userID
  let foundUser = await User.findUserByID(userID)

  if (!foundUser || foundUser.userType !== STUDENT) {
    ctx.throw(401, 'This user is not exist(or is not administrator)!')
  }

  let _archiveInfo = {
    userID: userID,
    remainType: archiveInfo.remainType,
    startDate: archiveInfo.startDate
  }

  let result = await RemainArchive.deleteArchive(_archiveInfo)

  if (result.n !== 1 || result.deleteCount !== 1 || result.ok !== 1) {
    ctx.throw(401, 'The info you requested wasn\'t deleted from archive.')
  }

  ctx.body = 'The info you requested was deleted from archive.'
}

exports.findWasher = async (ctx) => {
  let userID = ctx.request.userID
  let foundUser = await User.findUserByID(userID)

  if (!foundUser) {
    ctx.throw(401, 'This user is not exist!')
  }

  let washer = {
    'floor': ctx.params.floor,
    'location': ctx.params.location
  }

  ctx.body = await Washer.findByInfo(washer)
}

exports.addWasher = async (ctx) => {
  let userID = ctx.request.userID
  let foundUser = await User.findUserByID(userID)

  if (!foundUser || foundUser.userType !== ADMINISTRATOR) {
    ctx.throw(401, 'This user is not exist(or is not administrator)!')
  }

  let washerInfo = ctx.request.body

  ctx.body = await Washer.addWasher(washerInfo)
}

exports.changeStatus = async (ctx) => {
  let userID = ctx.request.userID
  let foundUser = await User.findUserByID(userID)

  if (!foundUser || foundUser.userType !== STUDENT) {
    ctx.throw(401, 'This user is not exist(or is not student)!')
  }

  let washer = ctx.request.body
  let foundWasher = await Washer.findByInfo(washer)

  if (!foundWasher || foundWasher.status === INOPERABLE) {
    ctx.throw(401, 'This washer is not exist(or is inoperable)!')
  }

  let latestArchive = (await WasherArchive.latestArchive(foundWasher))[0]
  let startTime, status

  if (latestArchive) {
    startTime = latestArchive.finishTime
    status = RESERVED
  } else {
    startTime = Date.now()
    status = OCCUPIED
  }

  await WasherArchive.useWasher(foundWasher, userID, startTime)

  await Washer.changeStatus(washer, status)

  let response = {
    status: status
  }

  ctx.body = response
}

let jsonifyMeal = meal => {
  let menus = meal.replace(/\n/g, ',').replace(/[1234567890*.]/gi, '').split(',')

  let breakfastIndex = menus.indexOf('[조식]') === -1 ? menus.length : menus.indexOf('[조식]')
  let lunchIndex = menus.indexOf('[중식]') === -1 ? menus.length : menus.indexOf('[중식]')
  let dinnerIndex = menus.indexOf('[석식]') === -1 ? menus.length : menus.indexOf('[석식]')

  return {
    조식: menus.slice(breakfastIndex + 1, lunchIndex),
    중식: menus.slice(lunchIndex + 1, dinnerIndex),
    석식: menus.slice(dinnerIndex + 1)
  }
}
