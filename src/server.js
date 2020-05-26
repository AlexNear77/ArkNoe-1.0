const express = require('express');
const exphbs = require('express-handlebars'); 
const path = require('path');
const morgan = require('morgan');
const methodOverride = require('method-override'); //esto es un middleware y procesa algo cada vez que llega una peticion
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');



//------------------------------------------------------
//                      Initializations                |
//=====================================================
const app = express();
require('./config/passport'); 



//------------------------------------------------------
//                      Settings                      |
//=====================================================
app.set('port', process.env.PORT || 4000); // process.env.PORT hace referencia a una variable de entornno si no existe esa variable que utilize el puerto 4000
app.set('views', path.join(__dirname , 'views')); // establecemos en donde esta la carpeta views ya que node esta acostumbrado a leerlo desde la raiz del usuario por lo que le vamos a decir como llegar y como las rutas cambian dependiendo del sistema operativo se hace esto. NOTA: dirname te da la direcion de donde esta el archivo
const hbs = exphbs.create({ //  express handle se separa en dos conceptos,(partials y layouts) partials son pedasos de coidgo de html, en el cual se importan en otros html. colocanolas en views 
   defaultLayout: 'default', 
   layoutsDir: path.join(app.get('views') , 'layouts') , //express sabe que layouts esta aqui
   partialsDir: path.join(app.get('views') , 'partials'), //express sabe que partials esta aqui
   extname: '.hbs', //aqui le digo que nombre de extension que utilizo en esas carpetas es .hbs

   //creamos heleprs para ifs, ya que hbs solo soporta si es true o false de un valor
   helpers:{
      ifCond: function (v1, operator, v2, options){
         switch (operator) {
            case '==':
                return (v1 == v2) ? options.fn(this) : options.inverse(this);
            case '===':
                return (v1 === v2) ? options.fn(this) : options.inverse(this);
            case '!=':
                return (v1 != v2) ? options.fn(this) : options.inverse(this);
            case '!==':
                return (v1 !== v2) ? options.fn(this) : options.inverse(this);
            case '<':
                return (v1 < v2) ? options.fn(this) : options.inverse(this);
            case '<=':
                return (v1 <= v2) ? options.fn(this) : options.inverse(this);
            case '>':
                return (v1 > v2) ? options.fn(this) : options.inverse(this);
            case '>=':
                return (v1 >= v2) ? options.fn(this) : options.inverse(this);
            case '&&':
                return (v1 && v2) ? options.fn(this) : options.inverse(this);
            case '||':
                return (v1 || v2) ? options.fn(this) : options.inverse(this);
            default:
                return options.inverse(this);
        }
      }
   }
});
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs'); // definimos cual va a ser el motor de las vistas, el cual configuramos en la linea anterior.
//------------------------------------------------------
//                      Middlewares                    | un midd es una funcion que se ejec
//=====================================================  antes de llegar a otra.
app.use(morgan('dev'));//para ver errores http
app.use(express.json());//para que entienda express los json
app.use(express.urlencoded({extended:false}));// lo que hace es que cada vez que llegen datos de un formulario atravez de cualquier tipo de metodo, vamos a tratar de convertirlos a un objeto json, de esta manera sera facil su manipulacion
app.use(methodOverride('_method'));
app.use(session({ // Este modulo ayuda a gurdar los mensajes en el servidor
   secret: 'secret',
   resave:true,
   saveUninitialized: true
}))
app.use(passport.initialize());//estas dos funciones de passport debben de estar debajo de
app.use(passport.session());// session ya que en ese se basa pra funcionar
app.use(flash());


//------------------------------------------------------
//                   Global Variables                  |
//=====================================================
app.use((req, res, next) => { // el next es para que continue con las funciones q estan debajo
   res.locals.success_msg = req.flash('success_msg');
   res.locals.error_msg = req.flash('error_msg');
   res.locals.error = req.flash('error'); //para utilizar flash con passport
   res.locals.user= req.user || null; // guardamos la session que genera passport en una variable si no la hay guarda null esto es para hacer aparecer el Productos del navigation!
   next();
});
//------------------------------------------------------
//                         Rutas                       |
//=====================================================
app.use(require('./routes/index.routes')); // las rutas estan en esa ruta
app.use(require('./routes/productos.routes')); // las rutas estan en esa ruta
app.use(require('./routes/users.routes'));
app.use(require('./routes/categorias.routes'));
app.use(require('./routes/usersClientes.routes'));
//------------------------------------------------------
//                      Static Files                   |
//=====================================================
app.use(express.static(path.join(__dirname , 'public')));//le dice a node que ahi esta la carpeta public ya que vamos a agreagar rutas en sub carpetas para mas cordura


module.exports = app;


