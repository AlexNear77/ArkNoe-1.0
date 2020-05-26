if(process.env.NODE_ENV !== 'production'){// si no estoy en produccion voy a utilizar ...process.env.NODE_ENV nos da el entorno actual del proyecto (dev o produccion)

   require('dotenv').config(); // lo que hace es que si existe un archivo al inicio del proyecto llamdo .env va a leer lo que tiene dentro y lo asignara a las variables de entorno
   //console.log(process.env.TESTING); //process.env es una variable que tiene acceso al sistema
}



const app = require('./server');
require('./database');

app.listen(app.get('port'),() => { // app.get('port') obtienne el puerto de settings en server.js
   console.log('Corriendo en el server port', app.get('port'));
   console.log('Entorno:', process.env.NODE_ENV); 
})