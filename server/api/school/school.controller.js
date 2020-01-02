const SchoolAPI = require('node-school-kr')
const School = new SchoolAPI()

const GWANGJU_SOFTWARE_MEISTER_SCHOOL_CODE = 'F100000120'

School.init(SchoolAPI.Type.HIGH, SchoolAPI.Region.GWANGJU, GWANGJU_SOFTWARE_MEISTER_SCHOOL_CODE)

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

let jsonifyMeal = meal => {
  let menus = meal.replace(/\n/g, ',').replace(/[1234567890*./]/gi, '').split(',')

  let breakfastIndex = menus.indexOf('[조식]') === -1 ? menus.length : menus.indexOf('[조식]')
  let lunchIndex = menus.indexOf('[중식]') === -1 ? menus.length : menus.indexOf('[중식]')
  let dinnerIndex = menus.indexOf('[석식]') === -1 ? menus.length : menus.indexOf('[석식]')

  return {
    조식: menus.slice(breakfastIndex + 1, lunchIndex),
    중식: menus.slice(lunchIndex + 1, dinnerIndex),
    석식: menus.slice(dinnerIndex + 1)
  }
}
