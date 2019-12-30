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
const { TOKEN_UNAUTHORIZED } = require('actions/token')

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
  let day = parseInt(ctx.params.day) + 1

  console.log(year, month, day)

  let start = new Date(year, month, day)
  let end = new Date(year, month, day + 1)

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

exports.findRemainEnrollByUser = async (ctx) => {
  if (!ctx.request.token_validated) {
    ctx.throw(401, TOKEN_UNAUTHORIZED + ': Please grant your token first.')
  }

  let userID = ctx.request.userID

  let foundUser = await User.findUserByID(userID)
  let foundUserType = foundUser ? foundUser.userType : ''

  if (foundUserType === STUDENT) {
    ctx.body = await RemainEnroll.findEnrollList(userID)
  } else if (foundUserType === ADMINISTRATOR) {
    ctx.body = await RemainEnroll.findAllEnrollList()
  } else {
    ctx.throw(401, 'This user is not exist!')
  }
}

exports.addEnrollList = async (ctx) => {
  if (!ctx.request.token_validated) {
    ctx.throw(401, TOKEN_UNAUTHORIZED + ': Please grant your token first.')
  }

  let userID = ctx.request.userID
  let enrollDate = ctx.request.body

  let foundUser = await User.findUserByID(userID)
  let foundUserType = foundUser ? foundUser.userType : ''

  if (foundUserType === STUDENT) {
    let enrollInfo = {
      userID: userID,
      enrollDate: enrollDate
    }

    ctx.body = await RemainEnroll.addEnrollList(enrollInfo)
  } else if (foundUserType === ADMINISTRATOR) {
    ctx.body = 'Administrator can\'t be enrolled in school remain.'
  } else {
    ctx.throw(401, 'This user is not exist!')
  }
}

exports.deleteEnrollList = async (ctx) => {
  if (!ctx.request.token_validated) {
    ctx.throw(401, TOKEN_UNAUTHORIZED + ': Please grant your token first.')
  }

  let userID = ctx.request.userID

  let foundUser = await User.findUserByID(userID)

  if (foundUser && foundUser.userType === ADMINISTRATOR) {
    let enrollInfo = ctx.request.body

    ctx.body = await RemainEnroll.deleteEnrollList(enrollInfo)
  } else {
    ctx.throw(401, 'This user is not administrator!(or is not exist)')
  }
}

exports.findRemainArchiveByUser = async (ctx) => {
  if (!ctx.request.token_validated) {
    ctx.throw(401, TOKEN_UNAUTHORIZED + ': Please grant your token first.')
  }

  let userID = ctx.request.userID

  let foundUser = await User.findUserByID(userID)
  let foundUserType = foundUser ? foundUser.userType : ''

  if (foundUserType === STUDENT) {
    ctx.body = await RemainArchive.findArchive(userID)
  } else if (foundUserType === ADMINISTRATOR) {
    ctx.body = await RemainArchive.findAllArchive()
  } else {
    ctx.throw(401, 'This user is not exist!')
  }
}

exports.addRemainArchive = async (ctx) => {
  if (!ctx.request.token_validated) {
    ctx.throw(401, TOKEN_UNAUTHORIZED + ': Please grant your token first.')
  }

  let userID = ctx.request.userID

  let foundUser = await User.findUserByID(userID)

  if (foundUser && foundUser.userType === ADMINISTRATOR) {
    let archiveInfo = ctx.request.body

    ctx.body = await RemainArchive.addArchive(archiveInfo)
  } else {
    ctx.throw(401, 'This user is not administrator!(or is not exist)')
  }
}

exports.deleteRemainArchive = async (ctx) => {
  if (!ctx.request.token_validated) {
    ctx.throw(401, TOKEN_UNAUTHORIZED + ': Please grant your token first.')
  }

  let userID = ctx.request.userID

  let foundUser = await User.findUserByID(userID)

  if (foundUser && foundUser.userType === ADMINISTRATOR) {
    let archiveInfo = ctx.request.body

    ctx.body = await RemainArchive.deleteArchive(archiveInfo)
  } else {
    ctx.throw(401, 'This user is not administrator!(or is not exist)')
  }
}

exports.findWasher = async (ctx) => {
  if (!ctx.request.token_validated) {
    ctx.throw(401, TOKEN_UNAUTHORIZED + ': Please grant your token first.')
  }

  let userID = ctx.request.userID

  let foundUser = await User.findUserByID(userID)

  if (foundUser) {
    let washer = {
      'floor': ctx.params.floor,
      'location': ctx.params.location
    }

    ctx.body = await Washer.findByInfo(washer)
  } else {
    ctx.throw(401, 'This user is not exist!')
  }
}

exports.addWasher = async (ctx) => {
  if (!ctx.request.token_validated) {
    ctx.throw(401, TOKEN_UNAUTHORIZED + ': Please grant your token first.')
  }

  let userID = ctx.request.userID

  let foundUser = await User.findUserByID(userID)

  if (foundUser && foundUser.userType === ADMINISTRATOR) {
    let washerInfo = ctx.request.body

    ctx.body = await Washer.addWasher(washerInfo)
  } else {
    ctx.throw(401, 'This user is not administrator!(or is not exist)')
  }
}

exports.changeStatus = async (ctx) => {
  if (!ctx.request.token_validated) {
    ctx.throw(401, TOKEN_UNAUTHORIZED + ': Please grant your token first.')
  }

  let userID = ctx.request.userID

  let foundUser = await User.findUserByID(userID)

  if (foundUser && foundUser.userType === STUDENT) {
    let washer = ctx.request.body.washer
    let userID = ctx.request.body.userID
    let status

    let foundWasher = await Washer.findByInfo(washer)

    if (foundWasher) {
      status = foundWasher.status
    } else {
      ctx.body = 'This washer is not exist!'
      return
    }

    if (status === INOPERABLE) {
      ctx.body = { status: status }
      return
    }

    let latestArchive = (await WasherArchive.latestArchive(foundWasher))[0]
    let startTime

    if (latestArchive) {
      startTime = latestArchive.finishTime
      status = RESERVED
    } else {
      startTime = Date.now()
      status = OCCUPIED
    }

    await WasherArchive.useWasher(foundWasher, userID, startTime)

    await Washer.changeStatus(washer, status)

    ctx.body = { status: status }
  } else {
    ctx.throw(401, 'This user is not student!(or is not exist)')
  }
}
