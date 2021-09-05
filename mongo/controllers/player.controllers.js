require('dotenv').config()
const controllerDebugger = require('debug')('app:controllers')
const { connect, connection } = require('mongoose')
const mongoose = require('mongoose')
const  Player  = require('../models/player')

const config = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}


async function createPlayer(req, res){
    const { name } = req.body
    await connect(process.env.CONNECTIONURL, config)
    console.log('Connected to MongoDB')
    if (name === undefined || name === 'Anonim'){
        try {
            const player = new Player({ _id: new mongoose.Types.ObjectId()})
            await player.save()
            connection.close()
            res.send(player)
            return player
        } catch (err){
            connection.close()
            return res.status('500').json(err)
        }
    } else {
        const existingPlayer = await Player.find({ name })
        controllerDebugger(existingPlayer)
        if (existingPlayer[0]) {
            return res.json({message: `Player already in the database`})
        } else {
            try {
                const player = new Player ({ _id : new mongoose.Types.ObjectId(), name })
                await player.save()
                connection.close()
                res.send(player)
                return player
            } catch (err) {
                connection.close()
                return res.status(500).json(err)
            }
        }
    }
}

 


async function changeName(req, res){
    const { _id, name } = req.body
    try { 
        await connect(process.env.CONNECTIONURL, config)
        const player = await Player.findById({ _id })
        const existingName = await Player.find({ name })
        if (player && existingName.length===0) {
            player.name = name
            await player.save()
            res.send(player)
            connection.close()
            return player
        } else if(!player){
            return res.json({message: "Player not in the database"})
        } else if(existingName[0].name === name) { 
            return res.json({message: "Invalid name"})
        } 
    } catch(err) {
        console.log(err)
        return res.status(500).json(err)
    }
}


async function getPlayers (req, res) {
    try {
        await connect(process.env.CONNECTIONURL, config)
        const players = await Player.find()

        if(players.length === 0) {
            return res.json({message: 'There are no players in the DB'})
        } else {
        res.send(players)
        connection.close()
        return players
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}


module.exports = {
    createPlayer: createPlayer,
    changeName: changeName,
    getPlayers: getPlayers
}