
const SchoolAPI = require('node-school-kr')
const School = new SchoolAPI()
const RemainAdministrator = require('models/remain_administrator')

School.init(School.Type.HIGH, School.Region.GWANGJU, 'F100000120')

exports.getMeal = async (ctx) => {
  let year = ctx.params.year
  let month = ctx.params.month
  const meal = (await School.getMeal(year, month))[ctx.params.day]

  ctx.body = meal // TO-DO: JSON 반환 후 ctx.body에 할당
}

exports.getSchedule = async (ctx) => {
  let year = ctx.params.year
  let month = ctx.params.month
  const schedule = (await School.getCalendar(year, month))[ctx.params.day]

  ctx.body = schedule // TO-DO: JSON 반환 후 ctx.body에 할당
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
