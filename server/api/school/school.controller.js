
const SchoolAPI = require('node-school-kr')
const School = new SchoolAPI()

const User = require('models/user')

const RemainAdministrator = require('models/remain_administrator')
const RemainEnroll = require('models/remain_enroll')
const RemainArchive = require('models/remain_archive')

const AuthCodeType = require('actions/auth_code')

School.init(SchoolAPI.Type.HIGH, SchoolAPI.Region.GWANGJU, 'F100000120')

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
  ctx.body = await RemainAdministrator.findAll()
}

exports.getRemainAdministratorByDate = async (ctx) => {
  let year = ctx.params.year
  let month = ctx.params.month
  let day = ctx.params.day

  let date = new Date(year, month, day)

  ctx.body = await RemainAdministrator.findByDate(date)
}

exports.addRemainAdministrator = async (ctx) => {
  let administrator = ctx.request.body

  ctx.body = await RemainAdministrator.addAdministrator(administrator)
}

exports.replaceRemainAdministrator = async (ctx) => {
  let administrator = ctx.request.body.administrator
  let replacedAdministrator = ctx.request.body.replacedAdministrator

  ctx.body = await RemainAdministrator.replaceAdministrator(administrator, replacedAdministrator)
}

exports.findRemainEnrollByUser = async (ctx) => {
  let userID = ctx.params.id

  let foundUser = await User.findUserByID(userID)
  let foundUserType = foundUser ? foundUser.userType : ''

  if (foundUserType === AuthCodeType.STUDENT) {
    ctx.body = await RemainEnroll.findEnrollList(userID)
  } else if (foundUserType === AuthCodeType.ADMINISTRATOR) {
    ctx.body = await RemainEnroll.findAllEnrollList()
  } else {
    ctx.body = 'Entered user\'s id is invaild!'
  }
}

exports.addEnrollList = async (ctx) => {
  let enrollInfo = ctx.request.body

  let foundUser = await User.findUserByID(enrollInfo.userID)
  let foundUserType = foundUser ? foundUser.userType : ''

  if (foundUserType === AuthCodeType.STUDENT) {
    ctx.body = await RemainEnroll.addEnrollList(enrollInfo)
  } else if (foundUserType === AuthCodeType.ADMINISTRATOR) {
    ctx.body = 'Administrator can\'t be enrolled in school remain.'
  } else {
    ctx.body = 'Entered user\'s id is invaild!'
  }
}

exports.deleteEnrollList = async (ctx) => {
  let enrollInfo = ctx.request.body

  ctx.body = await RemainEnroll.deleteEnrollList(enrollInfo)
}

exports.findRemainArchiveByUser = async (ctx) => {
  let userID = ctx.params.id

  let foundUser = await User.findUserByID(userID)
  let foundUserType = foundUser ? foundUser.userType : ''

  if (foundUserType === AuthCodeType.STUDENT) {
    ctx.body = await RemainArchive.findArchive(userID)
  } else if (foundUserType === AuthCodeType.ADMINISTRATOR) {
    ctx.body = await RemainArchive.findAllArchive()
  } else {
    ctx.body = 'Entered user\'s id is invaild!'
  }
}

exports.addRemainArchive = async (ctx) => {
  let archiveInfo = ctx.request.body

  ctx.body = await RemainArchive.addArchive(archiveInfo)
}

exports.deleteRemainArchive = async (ctx) => {
  let archiveInfo = ctx.request.body

  ctx.body = await RemainArchive.deleteArchive(archiveInfo)
}
