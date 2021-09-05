const sql = {
    gameController : require('./sequelize/controllers/game.controller'),
    playerController : require('./sequelize/controllers/player.controller'),
    rankingController: require('./sequelize/controllers/ranking.controller')
}

const mongo = {
    gameController : require('./mongo/controllers/game.controller'),
    playerController : require('./mongo/controllers/player.controllers'),
    rankingController: require('./mongo/controllers/ranking.controller')
}

module.exports = { sql, mongo }

