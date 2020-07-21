const Sequelize = require('sequelize')
const conexao = require('../bancoDeDados/conexao')
const Endereco = require('../endereco/Endereco')

const Usuario = conexao.define('usuarios',{
    nome:{
        type:Sequelize.STRING,
        allowNull:false
    },
    sobrenome:{
        type:Sequelize.STRING,
        allowNull:false
    },email:{
        type:Sequelize.STRING,
        allowNull:false
    },senha:{
        type:Sequelize.STRING,
        allowNull:false
    },cpf:{
        type:Sequelize.STRING,
        allowNull:false
    },enderecoId: {
        type: Sequelize.INTEGER,
        references: {
            model: Endereco,
            key: 'id'
        },
        allowNull: true
    }
})


Usuario.belongsTo(Endereco, { foreignKey: 'enderecoId',onDelete: 'cascade',hooks:true})
Endereco.hasOne(Usuario)

// Usuario.sync({force:true})



module.exports = Usuario