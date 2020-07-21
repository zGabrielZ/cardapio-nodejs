const Sequelize = require('sequelize')
const conexao = require('../bancoDeDados/conexao')
const Categoria = require('../categoria/Categoria')

const Produto = conexao.define('produtos', {
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: Sequelize.TEXT,
        allowNull: false
    }, preco: {
        type: Sequelize.DOUBLE,
        allowNull: false
    }, categoriaId: {
        type: Sequelize.INTEGER,
        references: {
            model: Categoria,
            key: 'id'
        },onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT',
        allowNull: true,
    }
})


Produto.belongsTo(Categoria, { foreignKey: 'categoriaId', as: 'categorias' })
Categoria.hasMany(Produto)


// Produto.sync({ force: true })

module.exports = Produto