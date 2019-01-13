const Event = require('../../models/event')
const { transformEvent, userMerge } = require('../../helpers/transformes')

module.exports = {
  events: async () => {
    try {
      const event = await Event.find()
      // el id que retorna mongo db es tibo object y no es entendido por graphql , se debe transformar a string
      // con el siguiente comando _id: e._doc._id.toString() o con e.id provided by mongodb method
      return event.map(e => {
        return transformEvent(e)
      })
    } catch (err) {
      throw err
    }
  },

  createEvent: async args => {
    try {
      const event = new Event({
        title: args.EventArgs.title,
        description: args.EventArgs.description,
        price: +args.EventArgs.price,
        date: new Date(args.EventArgs.date),
        creator: args.EventArgs.creator
      })
      const eventSave = await event.save()
      let createdEvent = {
        ...eventSave._doc,
        _id: eventSave.id,
        creator: userMerge.bind(this, eventSave._doc.creator)
      }
      const user = await User.findById(args.EventArgs.creator)
      if (!user) {
        throw new Error('user not found')
      }
      user.createdEvents.push(event)
      await user.save()
      return createdEvent
    } catch (err) {
      throw err
    }
  }
}
