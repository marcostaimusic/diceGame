const { sequelize, Game, Player } = require('../models');


async function playGame(req, res){
    const id  = req.params.id
    const dice1 = Math.ceil(Math.random() * 6);
    const dice2 = Math.ceil(Math.random() * 6);
    const result = dice1 + dice2 ==  7 ? true : false

    try {
        const player = await Player.findByPk(id)
        if (player) {
            const game =  await Game.create({result, PlayerId : player.id, dice1, dice2})

            const average = await Game.findOne({
                where: { PlayerId: id},
                attributes: [
                  [sequelize.fn('AVG', sequelize.col('result')), 'successRate'],
                ],  
                raw: true,
              })

            await Player.increment({gamesCounter: +1}, {where: { id } } )
            console.log(average.successRate)  
            
            // Player.update non funzionava perchè avevo messo DataType.DECIMAL invece che FLOAT
            await Player.update({successRate: average.successRate}, {where: { id: id }})

            const playerUpdated = await Player.findByPk(id)
            
            let gameResult
            if (game.result === true) {
                gameResult = "win"
            } else {
                gameResult = "lost"
            }

            return res.json({message: `The player ${playerUpdated.name} has played a game`, playerUpdated, gameResult})
        } else {
            res.json({message: 'Player not in the db'})
        };
    } catch(err) {
        console.log(err)
        return res.status(500).json(err)
    }
}


async function deleteGames(req, res) {
    try {
        const id = req.params.id
        await Player.update({gamesCounter: 0}, {where: { id }})
        await Game.update({PlayerId: null }, { where: { PlayerId : id }})
        const updatedPlayer = await Player.findByPk(id)
        return res.json({message: "Deleted the games for the player:", updatedPlayer})
    } catch(err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

async function getGames(req, res) {
    const id = req.params.id

    if(id) {
        try {
            const player = await Player.findByPk(id)
            const games = await Game.findAll({where: { PlayerId : id}})
            if (!player) {
                return res.json({message: 'This player is not in the db'})
            } else if (player && games.length === 0) {
                return res.json({message: 'This player has played no games'})
            } else {
                const gamePlayed = games.map(game=>{ 
                    let result
                    if(game.result===true){
                        result = 'win'
                    } else {
                        result = 'lost'
                    }
    
                    return {dice1: game.dice1, dice2: game.dice2, result, played: game.createdAt}
    
                })
            res.json({message: `The player ${player.name} has played: `, gamePlayed})
            }
        } catch(err) {
            console.log(err)
            return res.status(500).json(err)
        }
    } else {
        res.json({message: 'Player not in the db'})
    }

}


module.exports = {
    playGame: playGame,
    deleteGames: deleteGames,
    getGames: getGames
}





  