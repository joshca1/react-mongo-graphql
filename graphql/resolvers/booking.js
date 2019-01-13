const Booking = require('../../models/booking')
const { transformBooking } = require('../../helpers/transformes')

module.exports = {
  bookings: async () => {
    try {
      const bookings = await Booking.find()
      return bookings.map(bo => {
        return transformBooking(bo)
      })
    } catch (err) {
      throw err
    }
  },
  cancelBooking: async args => {
    try {
      const { bookingId } = args
      const booking = await Booking.findById(bookingId).populate('event')
      const event = transformEvent(booking.event)
      await Booking.deleteOne({ _id: bookingId })
      return event
    } catch (error) {
      throw error
    }
  },
  bookEvent: async args => {
    const { eventId } = args
    const fetchedEvent = await Event.findOne({ _id: eventId })
    const booking = new Booking({
      event: fetchedEvent,
      user: '5c337b4072104f14bcccd345'
    })
    const result = await booking.save()
    return transformBooking(result)
  }
}
