const categoriasCtrl = {};
const Producto = require('../models/Producto');



categoriasCtrl.renderCategoria1 = async (req,res) =>{
   const productos = await Producto.find({"categoria": "Equipo medico"}).sort({createdAt:'desc'}); //Hacemos una peticion a la bd, lo filtramos segun si el usuario le pertenece y lo ordenamos por fecha de manera desendente
   var n = await Producto.count({"categoria": "Equipo medico"});//Algoritmo aleatorio
   var r = Math.floor(Math.random() * n);
   const productosA = await Producto.find({"categoria": "Equipo medico"}).limit(3).skip(r);

   res.render('categorias/equipoMedico' ,{productos,productosA});
};

categoriasCtrl.renderCategoria2 = async (req,res) =>{
   const productos = await Producto.find({"categoria": "Medio de contraste"}).sort({createdAt:'desc'}); //Hacemos una peticion a la bd, lo filtramos segun si el usuario le pertenece y lo ordenamos por fecha de manera desendent

   var n = await Producto.count({"categoria": "Medio de contraste"});//Algoritmo aleatorio
   var r = Math.floor(Math.random() * n);
   const productosA = await Producto.find({"categoria": "Medio de contraste"}).limit(3).skip(r);

   res.render('categorias/medioDeContraste', {productos,productosA});
};

categoriasCtrl.renderCategoria3 = async (req,res) =>{
   const productos = await Producto.find({"categoria": "Material radiologico"}).sort({createdAt:'desc'}); //Hacemos una peticion a la bd, lo filtramos segun si el usuario le pertenece y lo ordenamos por fecha de manera desendente
   var n = await Producto.count({"categoria": "Material radiologico"});//Algoritmo aleatorio
   var r = Math.floor(Math.random() * n);
   const productosA = await Producto.find({"categoria": "Material radiologico"}).limit(3).skip(r);

   res.render('categorias/materialRadiologico', {productos,productosA});
};

categoriasCtrl.renderCategoria4 = async (req,res) =>{
   const productos = await Producto.find({"categoria": "Material de curacion"}).sort({createdAt:'desc'});
   var n = await Producto.count({"categoria": "Material de curacion"});//Algoritmo aleatorio
   var r = Math.floor(Math.random() * n);
   const productosA = await Producto.find({"categoria": "Material de curacion"}).limit(3).skip(r);

   res.render('categorias/materialDeCuracion', {productos,productosA});
}


module.exports = categoriasCtrl;