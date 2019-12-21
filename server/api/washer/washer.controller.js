const Washer = require('models/washer')
// const WasherArchive = require('models/washer_archive')

exports.findWasher = async (ctx) => {
  let washer = {
    'floor': ctx.params.floor,
    'location': ctx.params.location
  }

  ctx.body = await Washer.findByInfo(washer)
}

exports.changeStatus = async (ctx) => {
  let washer = ctx.request.body
  ctx.body = await Washer.changeStatus(washer)
}
