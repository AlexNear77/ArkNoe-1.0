const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const User = require('../models/User'); // sacamos el modelo de usuario-provedor
const UserCliente = require('../models/UserCliente'); // samos el modelo de usuario-Cliente

//Nota aqui todaviamos podemos validar si el correo realmente es un correo, etc.

passport.use(new localStrategy({ //'login', con eso cuando lo utilizemos en el controllador de users al requirir passoport podremos user passport.login pero el puto de fazt no lo hizo asi
   usernameField: 'email', // esta palabra clave sale del form de login en la hbs
   passwordField: 'password' // esta palabra clave sale del form de login en la hbs
}, async (email,password,done) => {
    //Comprobamos si el correo conicide con la del user registrado
    const user = await User.findOne({email}); 
    const userCliente = await UserCliente.findOne({email});
    if (!user && !userCliente) { // validamos si contiene algo las constantes prev definidas
       return done(null,false,{message: 'Usuario no encontrado'});
    }else if(!userCliente && user){
       //Ahora validamos la contraseña
       const match = await user.matchContraseña(password); //.matchContraseña es un metodo que creamos abajo de este para validar la comtraseña
       if (match) {
          return done(null,user);
       }else
         return done(null,false,{message: 'Contraseña incorrecta'});
    }else{
      const match = await userCliente.matchContraseña(password);
      if (match) {
         return done(null,userCliente);
      }else
        return done(null,false,{message: 'Contraseña incorrecta'});
    }

}));

passport.serializeUser((user,done) =>{ // con esta funcion serializa el login en todas las paginas para despues, con deserializeUser, verificar si esta en sesion o no el usario
   let type = user.isUser() ? 'user' : 'userCliente';// esta funcion la creamos dentro del modelo de usuarioCliente... esto realmente solo funciona con dos tipos de usuario ya que es un booleano, misma funcion la utilizamos en el hbs en partials.navigation
   done(null,{id: user.id, type: type});
}); // passport.serializeUser recibe una funcion y esa funcion resive un usario y una funciom callback, este callback lo utilizara deserialize para validar sesion, mandandole un id y un tipo de usario, NOTA: si solo es un tipo de usuario con user.id basta

passport.deserializeUser( (data, done) =>{
   if(data.type === 'user'){
      User.findById(data.id, (err,user) => {
         done(err,user); //si existe un error manda un error si existe un usuario manda el user
      });
   } else{
      UserCliente.findById(data.id, (err,user) => {
         done(err,user); //si existe un error manda un error si existe un usuario manda el user
      });
   }
   
});



