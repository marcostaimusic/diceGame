require('dotenv').config()
const { BBDD } = process.env
const { createPlayer, changeName, getPlayers } = require('../routeSwitch')[BBDD].playerController


const express = require('express')
const router = express.Router()


router.post('/players', createPlayer)
router.put('/players', changeName)
router.get('/players', getPlayers)

module.exports = router









//originali senza dotenv, con require dei controller
// const express = require('express')
// const playerController = require('../controllers/player.controller')
// const router = express.Router()


// router.post('/players', playerController.createPlayer)
// router.put('/players', playerController.changeName)
// router.get('/players', playerController.getPlayers)

// module.exports = router
