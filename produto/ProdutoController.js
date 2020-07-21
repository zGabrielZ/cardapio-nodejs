const express = require('express')
const rota = express.Router()
const Categoria = require('./../categoria/Categoria')
const Produto = require('./Produto')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const adminAuth = require('../middleware/adminAuth')

// rota para pagina de listagem de categoria

rota.get('/admin/produto/lista',adminAuth ,(req, res) => {
    let pesquisar = req.query.nome
    let query = '%' + pesquisar + '%'

    if(!pesquisar){
        Produto.findAll({
            raw: true, order: [
                ['createdAt', 'DESC']
            ],
            include:[{model: Categoria,as:'categorias'}]
        })
        .then(produtos => {
            res.render('admin/produto/listagem', {
                nome:pesquisar,
                produtos: produtos
            })
        })
    } else{
        Produto.findAll({
            where: { nome: { [Op.like]: query } }, raw: true, order: [
                ['createdAt', 'DESC']
            ],
            include:[{model: Categoria,as:'categorias'}]
        }).then(produtos => {
            res.render('admin/produto/listagem', {
                nome:pesquisar,
                produtos: produtos
            })
        })
    }

})


// rota para formulario de criacao de produto e combobox de categoria

rota.get('/admin/produto/criar',adminAuth ,(req, res) => {
    Categoria.findAll({
        raw: true, order: [
            ['createdAt', 'DESC']
        ]
    }).then(categorias=>{
        res.render('admin/produto/formulario', {
            categorias:categorias,
            erros: {}
        })
    })
})

// rota para cadastrar produto

rota.post('/admin/produto/salvar',adminAuth,(req,res)=>{
    
    let nome = req.body.nome
    let descricao = req.body.descricao
    let preco = req.body.preco
    let categoria = req.body.categoria

    req.assert('nome', 'O campo nome é obrigatório').notEmpty()
    req.assert('descricao', 'O campo descrição é obrigatório').notEmpty()
    req.assert('preco', 'O campo preço é obrigatório').notEmpty()
    req.assert('categoria', 'O campo categoria é obrigatório').notEmpty()

    let erros = req.validationErrors()

    if(erros){
        Categoria.findAll({
            raw: true, order: [
                ['createdAt', 'DESC']
            ]
        }).then(categorias=>{
            res.render('admin/produto/formulario', {
                categorias:categorias,
                erros: erros
            })
        })
    } else{
        Produto.create({
            nome: nome,
            descricao: descricao,
            preco:preco,
            categoriaId:categoria
        }).then(() => {
            req.flash('msg_sucesso', 'Cadastrado com sucesso !!')
            res.redirect('/admin/produto/lista')
        }).catch(() => {
            req.flash('msg_erro', 'Houve um erro na hora de cadastrar')
            res.redirect('/admin/produto/lista')
        })
    }

})

// rota para deletar produto

rota.post('/admin/produto/deletar',adminAuth,(req,res)=>{
    let id = req.body.id
    if(id!=undefined){
        if(!isNaN(id)){
            Produto.destroy({
                where:{id:id}
            }).then(()=>{
                req.flash('msg_sucesso', 'Deletado com sucesso !!')
                res.redirect('/admin/produto/lista')
            }).catch(erro=>{
                req.flash('msg_erro', 'Não é possivel deletar')
                res.redirect('/admin/produto/lista')
            })
        } else {
            res.redirect('/admin/produto/lista')
        }
    } else{
        res.redirect('/admin/produto/lista')
    }
})

// ver formulario da edicao

rota.get('/admin/produto/editar/:id',adminAuth,(req,res)=>{
    let id = req.params.id

    if(isNaN(id)){
        res.redirect('/admin/produto/lista')
    }

    Produto.findOne({
        where:{id:id}
    }).then(produto=>{
        if(produto != undefined){
            Categoria.findAll({
                raw: true, order: [
                    ['createdAt', 'DESC']
                ]
            }).then(categorias=>{
                    res.render('admin/produto/editar',{
                        categorias:categorias,
                        produto:produto,
                        erros:{}
                    })
                })
        } else{
            res.redirect('/admin/produto/lista')
        }
    }).catch(erro=>{
        res.redirect('/admin/produto/lista')
    })

})

// rota para atualizar produto

rota.post('/admin/produto/atualizar',adminAuth,(req,res)=>{
    
    let id = req.body.id
    let nome = req.body.nome
    let descricao = req.body.descricao
    let preco = req.body.preco
    let categoria = req.body.categoria

    req.assert('nome', 'O campo nome é obrigatório').notEmpty()
    req.assert('descricao', 'O campo descrição é obrigatório').notEmpty()
    req.assert('preco', 'O campo preço é obrigatório').notEmpty()

    let erros = req.validationErrors()

    if(erros){
        Categoria.findAll({
            raw: true, order: [
                ['createdAt', 'DESC']
            ]
        }).then(categorias=>{
            res.render('admin/produto/editar', {
                categorias:categorias,
                erros: erros
            })
        })
    } else{
        Produto.update({
            nome: nome,
            descricao: descricao,
            preco:preco,
            categoriaId:categoria
        },{
            where:{
                id:id
            }
        }).then(() => {
            req.flash('msg_sucesso', 'Atualizado com sucesso !!')
            res.redirect('/admin/produto/lista')
        }).catch(() => {
            req.flash('msg_erro', 'Houve um erro na hora de atualizar')
            res.redirect('/admin/produto/lista')
        })
    }

})


module.exports = rota