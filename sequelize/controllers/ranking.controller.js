const { sequelize, Game, Player } = require('../models');

async function getAverageRate(req, res) {
    try {
        const players = await Player.findAll()

        if(players.length === 0) {
            return res.json({message: `There are no players in the db`})
        } else {
        const average = await Player.findAll({
            attributes: [
                [sequelize.fn('AVG', sequelize.col('successRate')), 'averageRate']
            ],
            raw: true
        })
        console.log(average[0].averageRate)
        return res.json({message: `The average success rate is ${average[0].averageRate.toFixed(3)}`})
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}


async function getLoser(req, res) {
    try {
        const loserRate = await Player.min('successRate')
        console.log(loserRate)
        const winnerRate = await Player.max('successRate')
        const loser = await Player.findAll({ where: { successRate : loserRate}, raw: true})
        if (loserRate === winnerRate) {
            res.json({message: 'It\'s a tie', winners: loser})
        } else {
        console.log(loser)
        return res.json({message: "The loser is ", loser})
        }
    } catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
}

async function getWinner(req, res) {
    try {
        const winnerRate = await Player.max('successRate')
        const winner = await Player.findAll({ where: { successRate : winnerRate}, raw: true})
        if (winnerRate === 0) {
            return res.json({message: 'All players suck', losers: winner})
        } else {       
        console.log(winner)
        return res.json({message: "The winner is ", winner})
        }
    } catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
}

module.exports = {
    getAverageRate: getAverageRate,
    getLoser: getLoser,
    getWinner: getWinner
}