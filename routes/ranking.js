require('dotenv').config()
const { BBDD } = process.env
const { getAverageRate, getLoser, getWinner} = require('../routeSwitch')[BBDD].rankingController
const express = require('express')
const router = express.Router()

router.get('/players/ranking', getAverageRate)
router.get('/players/ranking/loser', getLoser)
router.get('/players/ranking/winner', getWinner)

module.exports = router








//originali senza dotenv, con require dei controller
// const express = require('express')
// const rankingController = require ('../controllers/ranking.controller')
// const router = express.Router()

// router.get('/players/ranking', rankingController.getAverageRate)
// router.get('/players/ranking/loser', rankingController.getLoser)
// router.get('/players/ranking/winner', rankingController.getWinner)

// module.exports = router


