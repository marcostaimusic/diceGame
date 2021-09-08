require('dotenv').config()
const {checkAndCreate} = require('./dbCreate')
const express = require('express')
const app = express()
const port = process.env.PORT
const playerRoute = require('./routes/player')
const gameRoute = require('./routes/game')
const rankingRoute = require ('./routes/ranking')
const authenticateJWT = require('./middleware/authJWT')
const loginRoute = require('./routes/login')




if (process.env.BBDD === 'sql') {checkAndCreate()} 



app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use('/', loginRoute)
app.use('/', authenticateJWT)


app.use('/', playerRoute)
app.use('/', gameRoute)
app.use('/', rankingRoute)





app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})
