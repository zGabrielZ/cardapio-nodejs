function adminAuth(req,res,next){
    if(req.session.usuario != undefined){
        next()
    } else{
        res.redirect('/usuario/criar')
    }
}

module.exports = adminAuth