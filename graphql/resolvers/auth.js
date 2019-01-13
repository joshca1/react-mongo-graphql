const bcrypt = require('bcryptjs')
const User = require('../../models/users')

module.exports = {
  createUser: async args => {
    try {
      const findedUser = await User.findOne({ email: args.UserArgs.email })
      if (findedUser) {
        throw Error('User Exist Already')
      }
      const hashedpassword = await bcrypt.hash(args.UserArgs.password, 12)
      const user = new User({
        email: args.UserArgs.email,
        password: hashedpassword
      })
      const result = await user.save()
      return { ...result._doc, password: null, _id: result.id }
    } catch (err) {
      throw err
    }
  },
  users: async () => {
    try {
      const users = await User.find()
      return users
    } catch (error) {
      throw error
    }
  }
}
