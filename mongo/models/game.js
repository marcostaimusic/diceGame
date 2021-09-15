const { Schema, model } = require('mongoose')
const Mongoose = require('mongoose')

const gameSchema = new Schema({
    _id: Mongoose.Types.ObjectId,
    result: Number,
    dice1: Number,
    dice2: Number,
    player: {
        type: Schema.Types.ObjectId,
        ref: 'Player'
    },
    playedAt: {
        type: Date,
        default: new Date()
    },
    
})

gameSchema.set('toJSON',{
    transform: (doc, game)=>{
        game.id = game._id,
        delete game._id,
        delete game.__v
    }
})

const Game = model('Game', gameSchema)

module.exports = Game