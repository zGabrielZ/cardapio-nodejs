const express = require('express')
const rota = express.Router()
const Categoria = require('./Categoria')
const Sequelize = require('sequelize')
const e = require('express')
const Op = Sequelize.Op
const adminAuth = require('../middleware/adminAuth')

// rota para pagina de listagem de categoria

rota.get('/admin/categoria/lista',adminAuth ,(req, res) => {
    let pesquisar = req.query.nome
    let query = '%' + pesquisar + '%'

    if(!pesquisar){
        Categoria.findAll({
            raw: true, order: [
                ['createdAt', 'DESC']
            ]
        })
        .then(categorias => {
            res.render('admin/categoria/listagem', {
                nome:pesquisar,
                categorias: categorias,
                email:req.session.usuario.email
            })
        })
    } else{
        Categoria.findAll({
            where: { nome: { [Op.like]: query } }, raw: true, order: [
                ['createdAt', 'DESC']
            ]
        }).then(categorias => {
            res.render('admin/categoria/listagem', {
                nome:pesquisar,
                categorias: categorias,
                email:req.session.usuario.email
            })
        })
    }

})

// rota para formulario de criacao de categoria

rota.get('/admin/categoria/criar',adminAuth ,(req, res) => {
    res.render('admin/categoria/formulario', {
        erros: {}
    })
})

// rota para criar categoria

rota.post('/admin/categoria/salvar',adminAuth ,(req, res) => {

    let nome = req.body.nome
    let descricao = req.body.descricao

    req.assert('nome', 'O campo nome é obrigatório').notEmpty()
    req.assert('descricao', 'O campo descrição é obrigatório').notEmpty()

    let erros = req.validationErrors()

    if (erros) {
        res.render('admin/categoria/formulario', {
            erros: erros
        })
    } else {
        Categoria.findOne({
            where:{nome:nome}
        }).then(categoria => {
            if (categoria == undefined) { // se nao existir 
                Categoria.create({
                    nome: nome,
                    descricao: descricao
                }).then(() => {
                    req.flash('msg_sucesso', 'Cadastrado com sucesso !!')
                    res.redirect('/admin/categoria/lista')
                }).catch(() => {
                    req.flash('msg_erro', 'Houve um erro na hora de cadastrar')
                    res.redirect('/admin/categoria/criar')
                })
            } else { // se existir
                req.flash('msg_erro', 'Não é possivel cadastrar, pois já existe cadastrado')
                res.redirect('/admin/categoria/lista')
            }
        })
    }
})

// rota para deletar categoria

rota.post('/admin/categoria/deletar',adminAuth,(req,res)=>{
    let id = req.body.id
    if(id!=undefined){
        if(!isNaN(id)){
            Categoria.destroy({
                where:{id:id}
            }).then(()=>{
                req.flash('msg_sucesso', 'Deletado com sucesso !!')
                res.redirect('/admin/categoria/lista')
            }).catch(erro=>{
                req.flash('msg_erro', 'Não é possivel deletar, pois está relacionada com algum produto')
                res.redirect('/admin/categoria/lista')
            })
        } else {
            res.redirect('/admin/categoria/lista')
        }
    } else{
        res.redirect('/admin/categoria/lista')
    }
})

// ver formulario da edicao

rota.get('/admin/categoria/editar/:id',adminAuth,(req,res)=>{
    let id = req.params.id

    if(isNaN(id)){
        res.redirect('/admin/categoria/lista')
    }

    Categoria.findOne({
        where:{id:id}
    }).then(categoria=>{
        if(categoria != undefined){
            res.render('admin/categoria/editar',{
                categoria:categoria,
                erros:{}
            })
        } else{
            res.redirect('/admin/categoria/lista')
        }
    }).catch(erro=>{
        res.redirect('/admin/categoria/lista')
    })

})

// atualizar categoria 

rota.post('/admin/categoria/atualizar',adminAuth,(req,res)=>{
    
    let id = req.body.id
    let nome = req.body.nome
    let descricao = req.body.descricao

    req.assert('nome', 'O campo nome é obrigatório').notEmpty()
    req.assert('descricao', 'O campo descrição é obrigatório').notEmpty()

    let erros = req.validationErrors()

    if (erros) {
        res.render('admin/categoria/formulario', {
            erros: erros
        })
    } else {
        Categoria.findOne({
            where: {
                [Op.and]: [
                  { nome: nome },
                  {
                      id:{
                          [Op.ne]:id
                      }
                  }
                ]
              }
        }).then(categoria => {
            if (categoria == undefined) { // se nao existir 
                Categoria.update({
                    nome: nome,
                    descricao: descricao
                },{
                    where:{
                        id:id
                    }
                }).then(() => {
                    req.flash('msg_sucesso', 'Atualizado com sucesso !!')
                    res.redirect('/admin/categoria/lista')
                }).catch(() => {
                    req.flash('msg_erro', 'Houve um erro na hora de atualizar')
                    res.redirect('/admin/categoria/lista')
                })
            }  else { 
                req.flash('msg_erro', 'Houve um erro na hora de atualizar')
                res.redirect('/admin/categoria/lista')
            }
        })
    }

})

module.exports = rota