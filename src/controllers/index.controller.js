const indexCtrl = {};
const Producto = require('../models/Producto');

indexCtrl.renderIndex = async (req,res) =>{
   // var n = await Producto.count({});
   // var r = Math.floor(Math.random() * n);

   const productos = await Producto.find({}).limit(6);
   res.render('index',{productos});
};

indexCtrl.renderAbout = (req,res) =>{
   res.render('about');
};

indexCtrl.renderPoliticas = (req,res) =>{
   res.render('politicas');
};

indexCtrl.renderTipoUser = (req,res) =>{
   res.render('tipoUser');
};

indexCtrl.renderTipoUserSignin = (req,res) =>{
   res.render('tipoUserSignin');
};


module.exports = indexCtrl;