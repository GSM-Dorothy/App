const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
  email: String,
  password: String,
  grade: Number,
  class: Number,
  name: String
})

User.statics.createUser = async function (userInfo) {
  let user = new this({
    'email': userInfo.email,
    'password': userInfo.password,
    'grade': userInfo.grade,
    'class': userInfo.class,
    'name': userInfo.name
  })

  await user.save()

  return user
}

const _user = mongoose.model('User', User, 'User')

module.exports = _user
