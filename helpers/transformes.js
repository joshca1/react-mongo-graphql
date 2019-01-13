const { transformDate } = require('./date')
const Event = require('../models/event')
const User = require('../models/users')
const singleEvent = async eventId => {
  try {
    const event = await Event.findById(eventId)
    return transformEvent(event)
  } catch (err) {
    throw err
  }
}

const fetchEventsId = async eventIds => {
  try {
    const event = await Event.find({ _id: { $in: eventIds } })
    return event.map(e => {
      return transformEvent(e)
    })
  } catch (err) {
    throw err
  }
}
const userMerge = async userId => {
  try {
    const user = await User.findById(userId)
    user ? 'finded' : 'not finded'
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: fetchEventsId.bind(this, user._doc.createdEvents)
    }
  } catch (err) {
    throw err
  }
}

const transformEvent = event => {
  return {
    ...event._doc,
    _id: event.id,
    date: transformDate(event._doc.date),
    creator: userMerge.bind(this, event.creator)
  }
}

const transformBooking = booking => {
  return {
    ...booking._doc,
    _id: booking.id,
    event: singleEvent.bind(this, booking.event),
    user: userMerge.bind(this, booking.user),
    createdAt: transformDate(booking.createdAt),
    updatedAt: transformDate(booking.updatedAt)
  }
}

exports.transformBooking = transformBooking
exports.transformEvent = transformEvent
exports.userMerge = userMerge
