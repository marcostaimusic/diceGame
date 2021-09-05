const { Schema, model } = require('mongoose')
const mongoose = require('mongoose')

const playerSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    name: {
        type: String,
        minLength: 3,
        maxlength: 255,
        default: 'Anonim'
    },
    successRate: {
        type: Number,
        default: 0
    },
    gamesCounter: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: new Date(),
        required: true
    }
})

playerSchema.set('toJSON', {
    transform: (doc, player) => {
      player.id = player._id
      delete player._id
      delete player.__v
    }
  })

  const Player = model('Player', playerSchema)

  module.exports = Player