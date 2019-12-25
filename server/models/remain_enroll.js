const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId

const remainEnroll = new Schema({
  userID: ObjectId,
  enrollDate: Date
})

remainEnroll.statics.findEnrollList = async function (userID) {
  let results = this.find({ userID: userID }).exec()

  return results
}
remainEnroll.statics.findAllEnrollList = async function () {
  let results = this.find().exec()

  return results
}
remainEnroll.statics.addEnrollList = async function (enrollInfo) {
  let enrollData = {
    userID: enrollInfo.userID,
    enrollDate: enrollInfo.enrollDate
  }

  let enrollItem = new this(enrollData)

  await enrollItem.save()

  return enrollItem
}
remainEnroll.statics.deleteEnrollList = async function (enrollInfo) {
  let result = this.deleteOne({ $and: [
    { userID: enrollInfo.userID },
    { enrollDate: enrollInfo.enrollDate }
  ] }).exec()

  return result
}

const _remainEnroll = mongoose.model('RemainEnroll', remainEnroll, 'RemainEnroll')

module.exports = _remainEnroll