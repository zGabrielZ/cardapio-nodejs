const Sequelize = require('sequelize')
const conexao = require('../bancoDeDados/conexao')
const Usuario = require('../usuario/Usuario')

const Telefone = conexao.define('telefones', {
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    numero: {
        type: Sequelize.TEXT,
        allowNull: false
    }, usuarioId: {
        type: Sequelize.INTEGER,
        references: {
            model: Usuario,
            key: 'id'
        },onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT',
        allowNull: false,
    }
})


Telefone.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuarios' })
Usuario.hasMany(Telefone)


// Telefone.sync({ force: true })

module.exports = Telefone