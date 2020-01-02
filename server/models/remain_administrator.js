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
  let results = await this.find().exec()

  return results
}

RemainAdministrator.statics.findByDate = async function (start, end) {
  let results = await this.find({ $or: [
    { startDate: { $lte: start }, endDate: { $gte: start } },
    { startDate: { $gte: start, $lt: end }, endDate: { $gte: start } }
  ] }).exec()

  return results
}

RemainAdministrator.statics.replaceAdministrator = async function (administrator, replacedAdministrator) {
  let results = await this.updateOne({ $and: [
    { 'name': administrator.name },
    { 'phone': administrator.phone },
    { 'startDate': administrator.startDate }
  ] }, { $set: {
    name: replacedAdministrator.name,
    phone: replacedAdministrator.phone,
    startDate: replacedAdministrator.startDate,
    endDate: replacedAdministrator.endDate
  } }).exec()

  return results
}

const _remainAdministrator = mongoose.models.RemainAdministrator || mongoose.model('RemainAdministrator', RemainAdministrator, 'RemainAdministrator')

module.exports = _remainAdministrator
