const Sequelize = require('sequelize')
const conexao = require('../bancoDeDados/conexao')
const Usuario = require('../usuario/Usuario')

const Endereco = conexao.define('enderecos',{
    rua:{
        type:Sequelize.STRING,
        allowNull:false
    },
    numero:{
        type:Sequelize.STRING,
        allowNull:false
    },bairro:{
        type:Sequelize.STRING,
        allowNull:false
    },cep:{
        type:Sequelize.STRING,
        allowNull:false
    }
})




// Endereco.sync({force:true})

module.exports = Endereco