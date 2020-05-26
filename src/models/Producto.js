
const {Schema, model} =require('mongoose');

const ProductSchema = new Schema({
   descripcion:{
      type:String,
      required:true
   },
   titulo:{
      type:String,
      required:true
   },
   stock:{
      type:String,
      required: true
   },
   precio:{
      type: String,
      required: true
   },
   categoria:{
      type: String,
      required: true
   },
   user: {
      type: String,
      required:true
   },
   imageURL:{
      type:String,
   },
   public_id:{
      type: String //Claudinary no lo guarda con el numbre original, le da un id
   }
   //FALTA IMAGEN
}, {
   timestamps:true
});

module.exports = model('Producto',ProductSchema);