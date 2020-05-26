const {Schema, model} =require('mongoose');

const cotizacionSchema = new Schema({
   orden:{type:String},
   cantidad:{type:String},
   precioPz:{type:String},
   cliente:{type:String}

}, {
   timestamps:true
});

module.exports = model('Cotizacion',cotizacionSchema);