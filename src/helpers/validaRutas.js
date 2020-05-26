const helpers = {};

helpers.isAuthenticated = (req,res,next) => {
   if (req.isAuthenticated()) { // este isAuthenticated() es de passport no del de arriba
      return next(); // si esta autentivado que continue con el siguinte codigo que utilize esta funcion
   }
   req.flash('error_msg' , 'No estas autorizado');
   res.redirect('/usersClientes/signin');
}

module.exports = helpers; // cuando exportas una funcion o objeto, lo que hace es que te perite usarlo en otra parte de tu codigo