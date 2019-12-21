const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RemainAdministrator = new Schema({
  name: String,
  phone: String,
  startDate: Date,
  endDate: Date
})

RemainAdministrator.statics.addAdministrator = async function (administrator) {
  let administratorData = {
    'name': administrator.name,
    'phone': administrator.phone,
    'startDate': administrator.startDate,
    'endDate': administrator.endDate
  }

  let Administrator = new this(administratorData)

  await Administrator.save()

  return Administrator
}

RemainAdministrator.statics.findAll = async function () {
  return (await this.find()).exec()
}

RemainAdministrator.statics.findByDate = async function (date) {
  return (await this.find({ startDate: date })).exec()
}

RemainAdministrator.replaceAdministrator = async function (administrator, replacedAdministrator) {
  return (await this.findOneAndUpdate({ $and: [
    { 'name': administrator.name },
    { 'phone': administrator.phone },
    { 'startDate': administrator.startDate }
  ] }, { $set: {
    name: replacedAdministrator.name,
    phone: replacedAdministrator.phone,
    startDate: replacedAdministrator.startDate,
    endDate: replacedAdministrator.endDate
  } })).exec()
}

const _remainAdministrator = mongoose.model('RemainAdministrator', RemainAdministrator, 'RemainAdministrator')

module.exports = _remainAdministrator
