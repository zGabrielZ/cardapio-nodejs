const Sequelize = require('sequelize')
const conexao = new Sequelize('lojanode','gabriel','palmeiras12',{
    host:'mysql669.umbler.com',
    dialect:'mysql',
    timezone:'-03:00'
})

module.exports = conexao