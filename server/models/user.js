const mongoose = require('mongoose')
const Schema = mongoose.Schema

const { STUDENT } = require('actions/auth_code')

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
  },
  refreshToken: {
    value: String,
    expireDate: Date
  },
  archive: [new Schema({ date: Date, reason: String, point: Number }, { _id: false })]
})

User.statics.createUser = async function (userInfo) {
  let userData = {
    userType: userInfo.userType,
    email: userInfo.email,
    password: userInfo.password,
    phone: userInfo.phone,
    name: userInfo.name,
    studentInfo: userInfo.studentInfo,
    archive: [],
    administratorInfo: userInfo.administratorInfo
  }

  let user = new this(userData)

  await user.save()

  return user
}

User.statics.findUserByID = async function (id) {
  let foundUser = {}

  try {
    foundUser = await this.findById(id).exec()
  } catch (e) {
    console.log(e)
  }

  return foundUser
}

User.statics.findAllStudents = async function () {
  let foundUsers = this.find({ userType: STUDENT }).exec()

  return foundUsers
}

User.statics.findUserWithStudentInfo = async function (studentInfo) {
  let foundUser

  try {
    foundUser = await this.findOne({ $and: [
      { grade: studentInfo.grade },
      { class: studentInfo.class },
      { number: studentInfo.number }
    ] }).exec()
  } catch (e) {
    console.log(e)
  }

  return foundUser
}

User.statics.findUserWithLoginData = async function (loginData) {
  let foundUser

  try {
    foundUser = await this.findOne({ $or: [
      { email: loginData.ID, password: loginData.password },
      { phone: loginData.ID, password: loginData.password }
    ] }).exec()
  } catch (e) {
    console.log(e)
  }

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

User.statics.storeRefreshToken = async function (id, refreshTokenData) {
  let results = await this.updateOne({ _id: id }, { $set:
    { refreshToken: {
      value: refreshTokenData.value,
      expireDate: refreshTokenData.expireDate
    }
    } }).exec()

  return results
}

User.statics.findRefreshToken = async function (refreshToken) {
  let results = await this.findOne({ 'refreshToken.value': refreshToken }).exec()

  return results
}

User.statics.revokeRefreshToken = async function (refreshToken) {
  let results = await this.updateOne({ 'refreshToken.value': refreshToken }, { $unset:
    { refreshToken: { value: 1, expireDate: 1 }
    } }).exec()

  return results
}

User.statics.findPointArchive = async function (studentInfo) {
  let found = await this.findOne({ studentInfo: {
    grade: studentInfo.grade,
    class: studentInfo.class,
    number: studentInfo.number
  } }).exec()

  if (found) {
    return found.archive
  } else {
    return []
  }
}

User.statics.updatePointArchive = async function (studentInfo, archive) {
  let result = await this.updateOne({ $and: [
    { 'studentInfo.grade': studentInfo.grade },
    { 'studentInfo.class': studentInfo.class },
    { 'studentInfo.number': studentInfo.number },
    { 'archive.date': archive.date }
  ] }, { $set:
    { 'archive.$.reason': archive.reason, 'archive.$.point': archive.point }
  }).exec()

  if (result.n === 0 || result.nModified === 0) {
    result = await this.updateOne({ $and: [
      { 'studentInfo.grade': studentInfo.grade },
      { 'studentInfo.class': studentInfo.class },
      { 'studentInfo.number': studentInfo.number },
      { 'archive.date': { $ne: archive.date } }
    ] }, { $push: {
      archive: { date: archive.date, reason: archive.reason, point: archive.point }
    } }).exec()
  }

  return result
}

User.statics.deletePointArchive = async function (studentInfo, archive) {
  let result = await this.updateOne({ $and: [
    { 'studentInfo.grade': studentInfo.grade },
    { 'studentInfo.class': studentInfo.class },
    { 'studentInfo.number': studentInfo.number },
    { 'archive.date': archive.date }
  ] }, { $pull: { archive: { date: archive.date } } }).exec()

  return result
}

const _user = mongoose.models.User || mongoose.model('User', User, 'User')

module.exports = _user
