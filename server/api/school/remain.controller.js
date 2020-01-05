const RemainAdministrator = require('models/remain_administrator')
const RemainEnroll = require('models/remain_enroll')
const RemainArchive = require('models/remain_archive')

const User = require('models/user')

exports.getRemainAdministrator = async (ctx) => {
  ctx.body = await RemainAdministrator.findAll()
}

exports.getRemainAdministratorByDate = async (ctx) => {
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
  let administrator = {
    name: ctx.state.foundUser.name,
    phone: ctx.state.foundUser.phone,
    startDate: ctx.request.body.startDate,
    endDate: ctx.request.body.endDate
  }

  ctx.body = await RemainAdministrator.addAdministrator(administrator)
}

exports.replaceRemainAdministrator = async (ctx) => {
  let administrator = ctx.request.body.administrator
  let replacedAdministrator = ctx.request.body.replacedAdministrator

  let result = await RemainAdministrator.replaceAdministrator(administrator, replacedAdministrator)

  ctx.assert(result.n === 1 && result.nModified === 1 && result.ok === 1, 401, 'Remain administrator hasn\'t just completely replaced.')

  ctx.body = 'Remain administrator has just completely replaced!'
}

exports.findRemainEnroll = async (ctx) => {
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

  let foundStudents = await RemainEnroll.findEnrollListByDate(start, end)
  let enrolledStudents = []

  for (let i in foundStudents) {
    let user = await User.findUserByID(foundStudents[i].userID)

    enrolledStudents.push({
      grade: user.studentInfo.grade,
      class: user.studentInfo.class,
      number: user.studentInfo.number,
      room: user.studentInfo.room,
      name: user.name
    })
  }

  ctx.body = enrolledStudents
}

exports.addEnrollList = async (ctx) => {
  let enrollDate = ctx.request.body.enrollDate

  let enrollInfo = {
    userID: ctx.state.foundUser._id,
    enrollDate: enrollDate
  }

  ctx.body = await RemainEnroll.addEnrollList(enrollInfo)
}

exports.deleteEnrollList = async (ctx) => {
  let enrollDate = ctx.request.body.enrollDate

  let enrollInfo = {
    userID: ctx.state.foundUser._id,
    enrollDate: enrollDate
  }

  let result = await RemainEnroll.deleteEnrollList(enrollInfo)

  ctx.assert(result.n === 1 && result.deleteCount === 1 && result.ok === 1, 401, 'You weren\'t left from remain enroll list.')

  ctx.body = 'You were left from remain enroll list!'
}

exports.findRemainArchive = async (ctx) => {
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

  let archives = await RemainArchive.findArchiveByDate(start, end)

  for (let i in archives) {
    let user = await User.findUserByID(archives[i].userID)

    if (user) {
      archives[i] = {
        remainType: archives[i].remainType,
        startDate: archives[i].startDate,
        finishDate: archives[i].finishDate,
        grade: user.studentInfo.grade,
        class: user.studentInfo.class,
        number: user.studentInfo.number,
        room: user.studentInfo.room,
        name: user.name
      }
    }

    console.log(archives[i])
  }

  ctx.body = archives
}

exports.addRemainArchive = async (ctx) => {
  let archiveInfo = ctx.request.body

  let _archiveInfo = {
    userID: ctx.state.foundUser._id,
    remainType: archiveInfo.remainType,
    startDate: archiveInfo.startDate,
    finishDate: archiveInfo.finishDate,
    reason: archiveInfo.reason
  }

  ctx.body = await RemainArchive.addArchive(_archiveInfo)
}

exports.deleteRemainArchive = async (ctx) => {
  let archiveInfo = ctx.request.body

  let _archiveInfo = {
    userID: ctx.state.foundUser._id,
    remainType: archiveInfo.remainType,
    startDate: archiveInfo.startDate
  }

  let result = await RemainArchive.deleteArchive(_archiveInfo)

  ctx.assert(result.n === 1 && result.deleteCount === 1 && result.ok === 1, 401, 'The info you requested wasn\'t deleted from archive.')

  ctx.body = 'The info you requested was deleted from archive.'
}
