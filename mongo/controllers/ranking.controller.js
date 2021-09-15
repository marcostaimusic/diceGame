require('dotenv').config()
const controllerDebugger = require('debug')('app:controllers')
const { connect, connection } = require('mongoose')
const Mongoose = require('mongoose')
const Game = require('../models/game')
const Player = require('../models/player')
const mongoUri = `${process.env.CONNECTIONURL}${process.env.DATABASE}`

const config = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

async function getAverageRate (req, res){
    await connect(mongoUri, config)
    try{
        const players = await Player.find()
        if(players.length != 0) {
        const rates = players.map(player => player.successRate)
        const reducer = (accumulator, currentValue) => accumulator + currentValue
        const average = Math.round(rates.reduce(reducer) / rates.length * 100) / 100
        return res.json({message: `The average successRate is ${average}`})
        } else {
            return res.json({message: " There are no players in the db"})
        }
    } catch(err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

async function getLoser (req, res) {
    await connect(mongoUri, config)
    try{
        const players = await Player.find()
        if(players.length != 0) {
            const rates = players.map(player => player.successRate)
            const losersRate = Math.min(...rates)
            const winnersRate = Math.max(...rates)
            
            if(losersRate != winnersRate) {            
                const loser = await Player.find({successRate : losersRate})
                return res.json({message: `The loser is:`, player : loser})
            } else {
                return res.json({message: "There are no winners or losers"})
            }
        } else if (players.length === 1) {
            return res.json({message: " There is only one player in the db"})
        } else {
            return res.json({message: " There are no players in the db"})
        }
    }catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
}


async function getWinner (req, res) {
    await connect(mongoUri, config)
    try{
        const players = await Player.find()
        if(players.length != 0) {
            const rates = players.map(player => player.successRate)
            const losersRate = Math.min(...rates)
            const winnersRate = Math.max(...rates)
            
            if(losersRate != winnersRate) {            
                const winner = await Player.find({successRate : winnersRate})
                return res.json({message: `The winner is:`, player : winner})
            } else {
                return res.json({message: "There are no winners or losers"})
            }
        } else if (players.length === 1) {
            return res.json({message: " There is only one player in the db"})
        } else {
            return res.json({message: " There are no players in the db"})
        }
    }catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
}


module.exports = {
    getAverageRate: getAverageRate,
    getLoser: getLoser,
    getWinner: getWinner
}