require('dotenv').config()
const jwt = require('jsonwebtoken')

const express = require('express')
const router = express.Router()

router.post('/login', (req, res, next )=> {
    const token = jwt.sign({ }, process.env.JWTPRIVATEKEY)
    res.send({token})
    next()
})

module.exports = router