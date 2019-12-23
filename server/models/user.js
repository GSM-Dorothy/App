const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
  userType: String,
  email: String,
  password: String,
  phone: String,
  name: String,
  fingerprint: Array,
  NFC: String,
  studentInfo: {
    grade: Number,
    class: Number,
    number: Number,
    room: Number
  },
  administratorInfo: {
    responsibility: String
  }
})

User.statics.createUser = async function (userInfo) {
  let userData = {
    userType: userInfo.userType,
    email: userInfo.email,
    password: userInfo.password,
    phone: userInfo.phone,
    name: userInfo.name,
    studentInfo: userInfo.studentInfo,
    administratorInfo: userInfo.administratorInfo
  }

  let user = new this(userData)

  await user.save()

  return user
}

User.statics.findUserByID = async function (id) {
  let foundUser = await this.findById(id).exec()

  return foundUser
}

User.statics.findAllFingerprints = async function () {
  let results = await this.find({}, { fingerprint: 1 }).exec()

  return results
}

User.statics.updateFingerprint = async function (id, fingerprints) {
  let results = await this.updateOne({ _id: id }, { $set: { fingerprint: fingerprints } }).exec()

  return results
}

const _user = mongoose.model('User', User, 'User')

module.exports = _user
