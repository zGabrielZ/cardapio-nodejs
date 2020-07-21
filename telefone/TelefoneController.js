const express = require('express')
const rota = express.Router()
const Usuario = require('../usuario/Usuario')
const Telefone = require('./Telefone')
const adminAuth = require('../middleware/adminAuth')

// ver form e lista de telefones 

rota.get('/admin/telefone/criar/:id',adminAuth,(req,res)=>{

    let id = req.params.id
    
    if(isNaN(id)){
        res.redirect('/admin/usuario/lista')
    }

    Usuario.findOne({
        where:{id:id},
        include:[{model:Telefone}]
    }).then(usuario=>{
        Telefone.findAll({
            where: { usuarioId: usuario.id }, raw: true, order: [
                ['createdAt', 'DESC']
            ]
        }).then(telefones=>{
            if(usuario != undefined){
                res.render('admin/telefone/cadastro',{
                    usuario:usuario,
                    telefones:telefones,
                    erros:{}
                })
            } else{
                res.redirect('/admin/usuario/lista')
            }
        })
    }).catch(erro=>{
        res.redirect('/admin/usuario/lista')
    })

})

// cadastrar telefone do usuario 

rota.post('/admin/telefone/salvar',adminAuth,(req,res)=>{
    
    let {id,nome,numero,usuarioId} = req.body

    req.assert('nome','O nome é obrigatório').notEmpty()
    req.assert('numero','O número é obrigatório').notEmpty()

    let erros =  req.validationErrors()

    if(erros){
        Usuario.findOne({
            where:{id:usuarioId},
            include:[{model:Telefone}]
        }).then(usuario=>{
            Telefone.findAll({
                where: { usuarioId: usuario.id }, raw: true, order: [
                    ['createdAt', 'DESC']
                ]
            }).then(telefones=>{
                if(usuario != undefined){
                    res.render('admin/telefone/cadastro',{
                        usuario:usuario,
                        telefones:telefones,
                        erros:erros
                    })
                } else{
                    res.redirect('/admin/usuario/lista')
                }
            })
        })
    } else {
        Telefone.create({
            nome:nome,
            numero:numero,
            usuarioId:usuarioId
        }).then(()=>{
            req.flash('msg_sucesso','Cadastrado com sucesso !!')
            res.redirect('/admin/telefone/criar/' + usuarioId)
        }).catch(erro => {
            req.flash('msg_erro','Houve um erro na hora de cadastrar')
            res.redirect('/admin/telefone/criar/' + usuarioId)
        })
    }

})

// rota para deletar telefone 

rota.post('/admin/telefone/deletar',adminAuth,(req,res)=>{
    
    let id = req.body.id

    if(id!=undefined){
        if(!isNaN(id)){
            Telefone.destroy({
                where:{id:id}
            }).then(()=>{
                req.flash('msg_sucesso', 'Deletado com sucesso !!')
                res.redirect('/admin/usuario/lista')
            }).catch(erro=>{
                req.flash('msg_erro', 'Não é possivel deletar')
                res.redirect('/admin/usuario/lista')
            })
        } else {
            res.redirect('/admin/usuario/lista')
        }
    } else{
        res.redirect('/admin/usuario/lista')
    }
})

// ver formulario da edicao

rota.get('/admin/telefone/editar/:id',adminAuth,(req,res)=>{
    let id = req.params.id

    if(isNaN(id)){
        res.redirect('/admin/usuario/lista')
    }

    Telefone.findOne({
        where:{id:id}
    }).then(telefone=>{
        if(telefone != undefined){
            Usuario.findOne({
                where:{id:id}
            }).then(usuario=>{
                res.render('admin/telefone/editar',{
                    telefone:telefone,
                    usuario:usuario,
                    erros:{}
                })
            })
        } else{
            res.redirect('/admin/usuario/lista')
        }
    }).catch(erro=>{
        console.log(erro)
        res.redirect('/admin/usuario/lista')
    })

})

// rota para atualizar telefone

rota.post('/admin/telefone/atualizar',adminAuth,(req,res)=>{
    
    let{id,nome,numero,usuario} = req.body

    req.assert('nome', 'O campo nome é obrigatório').notEmpty()
    req.assert('numero', 'O campo número é obrigatório').notEmpty()

    let erros = req.validationErrors()

    if(erros){
        res.render('admin/telefone/editar', {
            erros: erros
        })
    } else{
        Telefone.update({
            nome: nome,
            numero:numero,
            usuarioId:usuario
        },{
            where:{
                id:id
            }
        }).then(() => {
            req.flash('msg_sucesso', 'Atualizado com sucesso !!')
            res.redirect('/admin/telefone/criar/'+id)
        }).catch((erro) => {
            req.flash('msg_erro', 'Houve um erro na hora de atualizar')
            res.redirect('/admin/telefone/criar/'+id)
            console.log(erro)
        })
    }

})

module.exports = rota