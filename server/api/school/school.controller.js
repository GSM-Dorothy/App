
const School = require('node-school-kr')
const school = new School()

school.init(School.Type.HIGH, School.Region.GWANGJU, 'F100000120')

exports.getMeal = async (ctx) => {
  let year = ctx.params.year
  let month = ctx.params.month
  const meal = (await school.getMeal(year, month))[ctx.params.day]

  ctx.body = meal
}

exports.getSchedule = async (ctx) => {
  let year = ctx.params.year
  let month = ctx.params.month
  const schedule = (await school.getCalendar(year, month))[ctx.params.day]

  ctx.body = schedule
}
