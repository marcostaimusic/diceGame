const { sequelize, Player } = require('../models')



async function createPlayer(req, res){
    const { name } = req.body
    // console.log(name)
    if (name === undefined || name === 'Anonim') {
        try {
            const player = await Player.create({name})
            return res.json(player)
        }
        catch(err){
            console.log(err)
            return res.status(500).json(err)
        }
    } else {
        const existingPlayer = await Player.findOne({where : { name }})
        if (existingPlayer) {
            return res.json({message: 'Player already in the db'})
        } else {
            try {
                const player = await Player.create({name})
                return res.json(player)
            }
            catch(err){
                console.log(err)
                return res.status(500).json(err)
            }

        }
    }
}


async function changeName(req, res) {
    const { id, name } = req.body
    try {
        const player = await Player.findOne({where:{id}})
        const existingName = await Player.findOne({where:{name}})

        if(existingName){
            return res.json({message: "Name already in use"})
        } else if (player) { 
        await player.update({name}, {where: {id}})

        // await player.update({
        //     name: sequelize.fn('upper', sequelize.col('name'))
        //   }); serve solo per dimostrare come funziona sequelize.fn; in questo caso fa upperCase del risultato

        return res.json(await Player.findOne({where:{id}}))
        } else {
            res.json({message: 'Player not in the db'})
        }
    } catch(err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

async function getPlayers(req, res){
    try {
        const players = await Player.findAll()
        if(players.length === 0) {
            res.json({message: 'No players in the db'})
        } else {
        res.json(players.map(player => { return {id: player.id, name: player.name, "Success Rate": player.successRate}}))
        }
    } catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
}


module.exports = {
    createPlayer : createPlayer,
    changeName : changeName,
    getPlayers: getPlayers
}

































// async function createPlayer(req, res){
//     const { name } = req.body
//     console.log(name)

//     try {
//         const player = await Player.create({name})
//         return res.json(player)
//     }
//     catch(err){
//         console.log(err)
//         return res.status(500).json(err)
//     }
// }
