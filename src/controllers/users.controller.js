const usersCtrl = {};
const passport = require('passport');
const User = require('../models/User');

usersCtrl.renderSignUpForm = (req , res) => {
  res.render('users/signup'); 
};

usersCtrl.signup = async (req , res) => {
   const errors = [];
   const {nombre , email, password,confirm_password} = req.body;
   if (password != confirm_password) {
      errors.push({text: 'Las contraseñas no coinciden'});
   }
   if (password.length < 8) {
      errors.push({text: 'La contraseña debe obtener almenos 8 caracteres'});
   }
   if (errors.length > 0) {
      res.render('users/signup', {
         errors,
         nombre,
         email
      });
   } else{
      const emailUser =await User.findOne({email: email}); // aqui buscamos en la bd si ya existe este correo
      if (emailUser) { // si encontraste algo ose correo
         req.flash('error_msg', 'Este correo ya esta registrado');
         res.redirect('/users/signup');
      }else{
         const newUser = new User({nombre, email, password});
         newUser.password = await newUser.encryptContraseña(password);
         req.flash('success_msg', 'Registro completado correctamente');
         await newUser.save();
         res.redirect('/users/signin');
      }
   }
 };

 usersCtrl.renderSignipForm = (req , res) => {
   res.render('users/signin'); 
 };

 usersCtrl.signin = passport.authenticate('local',{
    failureRedirect: '/users/signin', // cuando algo falle lo direcionamos ahi
    successRedirect: '/productos', //si se loguea correctamente va a ahi
    failureFlash: true // si hhay un mensage de eroor utiliza flash
 }) // esta funcion se basa en el locale startegy que codificamos previamente

 usersCtrl.logout = (req , res) => {
   req.logout();
   req.flash('success_msg', 'Session cerrada correctamente');
   res.redirect('/users/signin');
 };

module.exports = usersCtrl;