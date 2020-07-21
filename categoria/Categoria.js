const Sequelize = require('sequelize')
const conexao = require('../bancoDeDados/conexao')

const Categoria = conexao.define('categorias',{
    nome:{
        type:Sequelize.STRING,
        allowNull:false
    },
    descricao:{
        type:Sequelize.TEXT,
        allowNull:false
    }
})


// Categoria.sync({force:true})

module.exports = Categoria