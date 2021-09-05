require('dotenv').config()
const { BBDD } = process.env
const { playGame, deleteGames, getGames } = require('../routeSwitch')[BBDD].gameController

const express = require('express')
const router = express.Router()


router.post('/players/:id/games', playGame)
router.delete('/players/:id/games', deleteGames)
router.get('/players/:id/games', getGames)
module.exports = router 







// originali senza dotenv, con require dei controller
// const express = require('express')
// const gameController = require('../controllers/game.controller')
// const router = express.Router()


// router.post('/players/:id/games', gameController.playGame)
// router.delete('/players/:id/games', gameController.deleteGames)
// router.get('/players/:id/games', gameController.getGames)
// module.exports = router 