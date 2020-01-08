const Washer = require('models/washer')
const WasherArchive = require('models/washer_archive')

const { OCCUPIED, RESERVED, INOPERABLE } = require('actions/washer')

exports.findWasher = async (ctx) => {
  let washer = {
    'floor': ctx.params.floor,
    'location': ctx.params.location
  }

  ctx.body = await Washer.findByInfo(washer)
}

exports.addWasher = async (ctx) => {
  let washerInfo = ctx.request.body

  ctx.body = await Washer.addWasher(washerInfo)
}

exports.changeStatus = async (ctx) => {
  let washer = ctx.request.body
  let foundWasher = await Washer.findByInfo(washer)

  ctx.assert(foundWasher && foundWasher.status !== INOPERABLE, 401, 'This washer is not exist(or is inoperable)!')

  let latestArchive = (await WasherArchive.latestArchive(foundWasher))[0]
  let startTime, status

  if (latestArchive) {
    startTime = latestArchive.finishTime
    status = RESERVED
  } else {
    startTime = Date.now()
    status = OCCUPIED
  }

  await WasherArchive.useWasher(foundWasher, userID, startTime)

  await Washer.changeStatus(washer, status)

  let response = {
    status: status
  }

  ctx.body = response
}