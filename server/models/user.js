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
  return (await this.findById(id)).exec()
}

const _user = mongoose.model('User', User, 'User')

module.exports = _user
