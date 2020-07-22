const express = require('express')
const rota = express.Router()
const Usuario = require('./Usuario')
const Endereco = require('../endereco/Endereco')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const bcrypt = require('bcryptjs')
const validarCpf = require('validar-cpf')
const adminAuth = require('../middleware/adminAuth')

// rota para pagina de listagem de usuarios

rota.get('/admin/usuario/lista',adminAuth ,(req, res) => {
    let pesquisar = req.query.nome
    let query = '%' + pesquisar + '%'

    if(!pesquisar){
        Usuario.findAll({
            raw: true, order: [
                ['createdAt', 'DESC']
            ]
        })
        .then(usuarios => {
            res.render('admin/usuario/listagem', {
                nome:pesquisar,
                usuarios: usuarios
            })
        })
    } else{
        Usuario.findAll({
            where: { nome: { [Op.like]: query } }, raw: true, order: [
                ['createdAt', 'DESC']
            ]
        }).then(usuarios => {
            res.render('admin/usuario/listagem', {
                nome:pesquisar,
                usuarios: usuarios
            })
        })
    }

})


// rota para formulario de criacao de usuario

rota.get('/usuario/criar' ,(req, res) => {
    res.render('admin/usuario/formulario', {
        erros: {}
    })
})

// rota para cadastrar usuario

rota.post('/usuario/salvar' ,(req, res) => {

    let { nome, sobrenome, email, senha, cpf, cep, rua, bairro, numero } = req.body

    let salt = bcrypt.genSaltSync(10)
    let hash = bcrypt.hashSync(senha,salt)

    let endereco = {
        cep: cep,
        numero: numero,
        bairro: bairro,
        rua: rua
    }

    req.assert('nome', 'O campo nome é obrigatório').notEmpty()
    req.assert('sobrenome', 'O campo sobrenome é obrigatório').notEmpty()
    req.assert('email', 'O campo email é obrigatório').notEmpty()
    req.assert('senha', 'O campo senha é obrigatório').notEmpty()
    req.assert('cpf', 'O campo cpf é obrigatório').notEmpty()
    req.assert('cep', 'O campo cep é obrigatório').notEmpty()
    req.assert('rua', 'O campo rua é obrigatório').notEmpty()
    req.assert('bairro', 'O campo bairro é obrigatório').notEmpty()
    req.assert('numero', 'O campo número é obrigatório').notEmpty()

    let erros = req.validationErrors()

    if(validarCpf(cpf) == false){
        req.flash('msg_erro', 'CPF inválido')
        res.redirect('/admin/usuario/lista')
    }

    if (erros) {
        res.render('admin/usuario/formulario', {
            erros: erros
        })
    } else {
        Usuario.findOne({where:{email:email}})
            .then(usuario=>{
                if(usuario == undefined){

                    if(validarCpf(cpf) == false){
                        req.flash('msg_erro', 'CPF inválido')
                        res.redirect('/admin/usuario/lista')
                    }

                    Usuario.create({
                        nome: nome,
                        cpf: cpf,
                        sobrenome: sobrenome,
                        email: email,
                        senha: hash,
                        endereco:endereco
                    }, {
                        include: [{ model: Endereco}]
                    }
            
                    ).then(() => {
                        req.flash('msg_sucesso', 'Cadastrado com sucesso !!')
                        res.redirect('/login')
                    }).catch((erro) => {
                        req.flash('msg_erro', 'Houve um erro na hora de cadastrar')
                        res.redirect('/login')
                    })
                } else {
                    req.flash('msg_erro', 'Já existe este email cadastrado')
                    res.redirect('/login')
                }
            })
    }

})

// rota para visualizar endereco 
rota.get('/admin/usuario/endereco/:id',adminAuth,(req,res)=>{
    let id = req.params.id

    if(isNaN(id)){
        res.redirect('/admin/usuario/lista')
    } 

    Usuario.findOne({
        where:{id:id},
        include:[{model:Endereco}]
    }).then(usuario=>{
        res.render('admin/endereco/listagem',{
            usuario:usuario,
            enderecos:usuario.endereco
        })
    }).catch(erro=>{
        res.redirect('/admin/usuario/lista')
    })

})


//rota para ver login 

rota.get('/login',(req,res)=>{
    res.render('admin/usuario/login')
})

// rota para autenticar

rota.post('/autenticar',(req,res)=>{
    let {email,senha} = req.body

    Usuario.findOne({
        where:{email:email}
    }).then(usuario=>{
        if(usuario != undefined){ // se ele existir
            // validar senha 
            let senhaCorreta = bcrypt.compareSync(senha,usuario.senha)
            if(senhaCorreta){
                req.session.usuario = {
                    id:usuario.id,
                    email:usuario.email
                }
                res.redirect('/admin/categoria/lista')
            } else{
                res.redirect('/login')
            }
        } else{
            req.flash('msg_erro', 'Não existe este email')
            res.redirect('/login')
        }
    })

})

rota.get('/logout',(req,res)=>{
    req.session.usuario = undefined
    res.redirect('/login')
})




module.exports = rota