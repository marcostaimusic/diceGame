require('dotenv').config()
const bbdd = process.env.BBDD;
// const config = require('./config/config.json')[env];
var mysql = require('mysql2');
const { Sequelize } = require('sequelize')
const { Umzug, SequelizeStorage } = require('umzug')
const { connect, connection } = require('mongoose')
const mongoose = require('mongoose'), Admin = mongoose.mongo.Admin;
console.log(bbdd)

const config = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}


function checkAndCreateSQL (){
        var con = mysql.createConnection({
          host: process.env.HOST_SQL,
          user: process.env.USERNAME_SQL,
          password: process.env.PASSWORD_SQL,

        });

        const sequelize = new Sequelize(
          process.env.DATABASE,
          process.env.HOST_SQL,
          process.env.PASSWORD_SQL,
          {
              host: process.env.HOST_SQL,
              dialect: 'mysql',
          }
        )

        con.connect(function(err) {
          
          if (err) throw err;
          
          con.query(`CREATE DATABASE ${process.env.DATABASE}`, function (err) {
            
            if (err) return;
              
            const {sequelize} = require('./sequelize/models')
            
              async function main (){
              await sequelize.sync({ force: true })
              }

              async function defineUmzug(){
                try {
              
                  const umzug = new Umzug({
                      migrations: {
                          glob: './sequelize/migrations/*.js',
                          resolve: ({ name, path, context }) => {
                              // adjust the migration parameters Umzug will
                              // pass to migration methods, this is done because 
                              // Sequilize-CLI generates migrations that require 
                              // two parameters be passed to the up and down methods
                              // but by default Umzug will only pass the first
                              const migration = require(path || '')
                              return {
                                  name,
                                  up: async () => migration.up(context, Sequelize),
                                  down: async () => migration.down(context, Sequelize),
                              }
                          },
                      },
                      context: sequelize.getQueryInterface(),
                      storage: new SequelizeStorage({ sequelize }),
                      logger: console,
                  });
                  return umzug
                } catch(err){
                  console.log(err)
                }
              }
              
              async function executeUmzug () {
                  try {
                      await main() //il problema è la lentezza nella chiusura della connessione, risolto incapsulando 
                                   //tutto nella stessa sessione di connessione, che si chiude alla fine di questo
                                   //codice con con.end() dopo aver eseguito anche le migrazioni di umzug 
                      const umzug = await defineUmzug()
                      await sequelize.authenticate()
                      await umzug.up()
                      console.log('Connection established and migrations run.')
                  } catch (error) {
                      console.error('Unable to connect to the database:', error)
                      
                  }
              }
              
              
              executeUmzug()

            // console.log(result);
            con.end()
          });
        });
}

function checkAndCreateMONGO(){
 /// create a connection to the DB    
  var connection = mongoose.createConnection(process.env.CONNECTIONURL, config);
  
  connection.on('open', function() {
  // connection established
  new Admin(connection.db).listDatabases(function(err, result) {
      console.log('listDatabases succeeded');
      // database list stored in result.databases
      var allDatabases = result.databases; 
      console.log(allDatabases)      

      var dbName = process.env.DATABASE
    
      for(i=0; i<allDatabases.length; i++){
        if (allDatabases[i].name.toLowerCase() === dbName.toLowerCase()){
            console.log(allDatabases[i].name)
            var newConn = mongoose.createConnection(process.env.CONNECTIONURL+allDatabases[i].name)
            newConn.dropDatabase()
            // newConn.close() // throws connection error
        }
      }
      
  });
  
})

}




module.exports = {
  checkAndCreateSQL: checkAndCreateSQL, 
  checkAndCreateMONGO: checkAndCreateMONGO
}














































// async function checkDB (db) {
//   do {
//       var http = new XMLHttpRequest();
//       http.open('HEAD', config.data, false);
//       http.send();
//   } while (err)

// }



// async function defineSequelize(){
//       return sequelize = new Sequelize(
//         config.database,
//         config.username,
//         config.password,
//         {
//             host: config.host,
//             dialect: 'mysql',
//         }
//       )
      
// }

// async function defineUmzug(){
//   try {

//     const sequelize = await defineSequelize()
//     const umzug = new Umzug({
//         migrations: {
//             glob: './migrations/*.js',
//             resolve: ({ name, path, context }) => {
//                 // adjust the migration parameters Umzug will
//                 // pass to migration methods, this is done because 
//                 // Sequilize-CLI generates migrations that require 
//                 // two parameters be passed to the up and down methods
//                 // but by default Umzug will only pass the first
//                 const migration = require(path || '')
//                 return {
//                     name,
//                     up: async () => migration.up(context, Sequelize),
//                     down: async () => migration.down(context, Sequelize),
//                 }
//             },
//         },
//         context: sequelize.getQueryInterface(),
//         storage: new SequelizeStorage({ sequelize }),
//         logger: console,
//     });
//     return umzug
//   } catch(err){
//     console.log(err)
//   }
// }

// async function executeUmzug () {
//     try {
//         await checkAndCreate() //il problema è la lentezza nella chiusura della connessione
//         const sequelize = await defineSequelize()
//         const umzug = await defineUmzug()
//         await sequelize.authenticate()
//         await umzug.up()
//         console.log('Connection established and migrations run.')
//     } catch (error) {
//         console.error('Unable to connect to the database:', error)
        
//     }
// }
 

// executeUmzug()

// SECONDA VERSIONE CON CHILD PROCESS
// const env = process.env.NODE_ENV || 'development';;
// const config = require('./config/config.json')[env];
// console.log(config.host)
// var mysql = require('mysql2');


// var con = mysql.createConnection({
//   host: config.host,
//   user: config.username,
//   password: config.password,

// });

// con.connect(function(err) {
//   if (err) throw err;
//   con.query(`CREATE DATABASE ${config.database}`, function (err, result, fields) {
//     if (err) throw err;
//       const {sequelize} = require('./models')
//       const main = async () =>{
//       await sequelize.sync({ force: true })
//       }
//       main()
//     console.log(result);
//     con.close()
//   });
// });

// const {exec} = require('child_process');
// async function create () {
// await new Promise((resolve, reject) => {
//   const migrate = exec(
//     'sequelize db:migrate',
//     {env: process.env},
//     err => (err ? reject(err): resolve())
//   );

//   // Forward stdout+stderr to this process
//   migrate.stdout.pipe(process.stdout);
//   migrate.stderr.pipe(process.stderr);
// });
// }

// create()

















// function dbExists(db)
// {
//     var http = new XMLHttpRequest();
//     http.open('HEAD', db, false);
//     http.send();
//     return http.status!=404;
// }

// var db=config.database;
// dbExists(db);