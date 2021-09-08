`npm install`

and then 

`node app`

to run the API. Before running the app, follow these instruction to set up the .env variables.

Create a .env file with the following details, and give the parameters the correct values according to your configuration.
The value in BBDD must be either "sql" or "mongo" to choose the database you wish to work with.

For example: <br>
`PORT = 5000` <br>
`BBDD = sql` or `BBDD = mongo` 


Sample parameters for Sequelize (change them according to your configuration): <br>
`DATABASE = diceGame` <br>
`USERNAME_SQL = root` <br>
`PASSWORD_SQL = 1234` <br>
`HOST_SQL = 127.0.0.1` <br>

Sample parameters for Mongo (change them according to your configuration)

`CONNECTIONURL = mongodb://localhost:27017/diceGame`

And finally, write some text for the JWT private Key: <br>
`JWTPRIVATEKEY = someRandomText`


The JWT is generated by the http://localhost:PORT/login route; copy it from the response body and add it to the preset header key "x-auth-token" in each route.

Use the attached Postman Collection to use the API.

