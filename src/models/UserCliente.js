const {Schema, model} =require('mongoose');
const bcrypt = require('bcryptjs');
const UserClienteSchema = new Schema({
   nombre:{
      type: String,
      required: true
   },
   email:{
      type:String,
      required:true,
      unique: true
   },
   password:{
      type: String,
      required: true
   }
   ,
   tipoUser:{
      type: String , default: 'cliente'
   }
}, {
   timestamps:true
});

UserClienteSchema.methods.encryptContraseña = async password =>{
    const salt = await bcrypt.genSalt(10); // salt se ocupa para generar la encriptacion en este caso se eject 10 veces entres mas veces mas segura pero gastas mas recursos de sys
    return await bcrypt.hash(password,salt); // esto nos devuelve la contra cifraada
 };

 UserClienteSchema.methods.matchContraseña = async function(password){
    return await bcrypt.compare(password, this.password);
 }

 UserClienteSchema.methods.isUser = function(){
   return false;
}

module.exports = model('UserCliente',UserClienteSchema);