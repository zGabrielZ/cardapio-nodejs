const express = require('express')
const app = express()
const porta = 3000
const bodyParser = require('body-parser')
const bancoDeDados = require('./bancoDeDados/conexao')
const Categoria = require('./categoria/Categoria')
const Produto = require('./produto/Produto')
const Usuario = require('./usuario/Usuario')
const Endereco = require('./endereco/Endereco')
const Telefone = require('./telefone/Telefone')
const CategoriaController = require('./categoria/CategoriaController')
const ProdutoController = require('./produto/ProdutoController')
const UsuarioController = require('./usuario/UsuarioController')
const TelefoneController = require('./telefone/TelefoneController')
const expressValidator = require('express-validator')
const expressSession = require('express-session')
const flash = require('connect-flash')

// configurando bodyParser 
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

// configurando ejs 
app.set('view engine','ejs')
// configurando arquivo estaticos 
app.use(express.static('public'))

// configurando express validator
app.use(expressValidator())

// configurando session
app.use(expressSession({
    secret:'gabriel',
    cookie:{
        maxAge:3000000
    },resave:true,
    saveUninitialized:true
}))

// configurando flash
app.use(flash())
app.use((req,res,next)=>{
    res.locals.msg_sucesso = req.flash('msg_sucesso')
    res.locals.msg_erro = req.flash('msg_erro')
    next()
})


// configurando banco de dados 
bancoDeDados.authenticate()
    .then(()=>{
        console.log('Conectado no banco de dados')
    }).catch(erro=>{
        console.log('Erro no banco de dados : '+erro)
    })

//configurando as rotas dos controller
app.use('/',CategoriaController)
//configurando as rotas dos controller
app.use('/',ProdutoController)
//configurando as rotas dos controller
app.use('/',UsuarioController)
//configurando as rotas dos controller
app.use('/',TelefoneController)



// conectando na porta 3000
app.listen(porta,()=>{
    console.log('Conectado na porta '+porta)
})