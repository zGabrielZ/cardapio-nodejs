const Sequelize = require('sequelize')
const conexao = new Sequelize('lojinha_node','root','gabriel',{
    host:'localhost',
    dialect:'mysql',
    timezone:'-03:00'
})

module.exports = conexao