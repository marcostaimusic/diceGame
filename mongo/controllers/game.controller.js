require('dotenv').config()
const controllerDebugger = require('debug')('app:controllers')
const { connect, connection } = require('mongoose')
const Mongoose = require('mongoose') 
const Game = require('../models/game')
const Player = require('../models/player')

const config = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

async function playgame(req, res) {
    const id = req.params.id
    const dice1 = Math.ceil(Math.random() * 6)
    const dice2 = Math.ceil(Math.random() * 6)
    const result = dice1 + dice2 == 7 ? 1 : 0
    await connect(process.env.CONNECTIONURL, config)
    console.log('Connected to MongoDB')

    try {
        const existingPlayer = await Player.findById(id)        
        if (existingPlayer){
            const game = new Game({
                _id: new Mongoose.Types.ObjectId,
                result,
                dice1,
                dice2,
                player: id      // da "Saving refs" sul manuale di Mongoose
            })
            await game.save()

            const gamePlayedByPlayer = await Game.find({ player: id })
            let results = gamePlayedByPlayer.map(game=>game.result)
            controllerDebugger(results)
            const reducer = (accumulator, currentValue) => accumulator + currentValue
            const sumOfVictories = results.reduce(reducer)
            const average = Math.round(sumOfVictories / results.length * 100) / 100
            controllerDebugger(average)
            existingPlayer.gamesCounter++
            existingPlayer.successRate = average
            controllerDebugger(existingPlayer)
            await existingPlayer.save()

            let gameResult
            if (game.result === 1) {
                gameResult = 'win'
            } else {
                gameResult = 'lost'
            }

            res.send({gameResult, dice1: game.dice1, dice2: game.dice2, existingPlayer, })
            return game
        } else {
            return res.status(404.).json({message: "Player not in the database"})
        }
    } catch(err){
        console.log(err)
        return res.status(400).json({message: "The id you inserted is invalid"})
    }
    connection.close()
}


async function deleteGames (req, res){
    const id = req.params.id
    await connect(process.env.CONNECTIONURL, config)
    try{
        const existingPlayer = await Player.findById(id)
        controllerDebugger(existingPlayer)
        if (existingPlayer) {
            const gamePlayedByPlayer = await Game.find({ player : id })
            if (gamePlayedByPlayer.length > 0) {
                for(i=0; i<gamePlayedByPlayer.length; i++) {
                    gamePlayedByPlayer[i].player = null
                    await gamePlayedByPlayer[i].save()
                }
                return res.json(gamePlayedByPlayer)
            } else {
                return res.json({message: "No games recorded for this player"})
            }
        } else {
            return res.json({message: "The player is not in the database"})
        } 


    } catch(err){
        console.log(err)
        return res.status(400).json({message: "The id you inserted is invalid"})
    }
    connection.close()
}


async function getGames(req, res){
    const id = req.params.id
    await connect(process.env.CONNECTIONURL, config)
    try{
        const existingPlayer = await Player.findById(id)
        if (existingPlayer) {
            const gamesPlayed = await Game.find({ player : id })
            if (gamesPlayed.length!=0) {
                return res.json(gamesPlayed)
            } else {
                return res.json({message: "No games recorded for this player"})
            }
        } else {
            return res.json({message: "The player is not in the database"})
        }
    } catch(err){
        console.log(err)
        return res.status(400).json({message: "The id you inserted is invalid"})
    }
}

module.exports = {
    playGame: playgame,
    deleteGames: deleteGames,
    getGames: getGames
}