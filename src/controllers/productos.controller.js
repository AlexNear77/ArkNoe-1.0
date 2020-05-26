const productsCtrl = {};
const Producto = require('../models/Producto');
const UserCliente = require('../models/UserCliente');
const Cotizacion = require('../models/Cotizacion');
const cloudinary = require('cloudinary');
const fs = require('fs-extra'); // este modulo  trabaja con los archivos , podemos buscar y eliminar archivos
const nodemailer = require('nodemailer');
// const {CLAVESTRIPE} = process.env;
// const stripe = require('stripe')(CLAVESTRIPE); //stripe

productsCtrl.renderProductForm = (req,res) =>{
   res.render('productos/new-product');
};

productsCtrl.createNewProduct = async (req,res) =>{
   const {titulo,descripcion,stock,precio,categoria} = req.body;
   const result = await cloudinary.v2.uploader.upload(req.file.path); // con esto mandamos la imagen almacenada temp de nuestro dicrectorio a claudinary y lo guardamos en una constante

   const newProducto = new Producto({titulo, descripcion,stock,precio,categoria});
   newProducto.user = req.user.id; 

//          -----------------------Code Claudinary------------------------------
   newProducto.imageURL = result.url; // Guardamos la propiedad url al objeto
   newProducto.public_id = result.public_id; // Guardamos la propiedad public_id al objeto
   await fs.unlink(req.file.path); // elimina el archivo ya que como ya lo subimos a laudinary no es necesario almacenarlo en nuestro servidor
//          -----------------------EndCode Claudi ------------------------------
   await newProducto.save(); 
   req.flash('success_msg','Producto agregado');         
   res.redirect('/productos');
};

productsCtrl.renderProductos = async (req,res) =>{
   const productos = await Producto.find({user: req.user.id}).sort({createdAt:'desc'}); //Hacemos una peticion a la bd, lo filtramos segun si el usuario le pertenece y lo ordenamos por fecha de manera desendente
   res.render('productos/all-products', {productos});
};

productsCtrl.renderEditForm = async (req,res) =>{
   const producto = await Producto.findById(req.params.id);
   if(producto.user != req.user.id){ // si el producto en su propiedad usuario es distinto al usuario actual...
      req.flash('error_msg', 'No autorizado');
      res.redirect('/productos');
   }
   res.render('productos/edit-product', {producto});
};

productsCtrl.updateProduct = async (req,res) =>{
   const {titulo,descripcion,stock,precio,categoria} = req.body;
   const producto = await Producto.findByIdAndUpdate(req.params.id, {titulo,descripcion,stock,precio,categoria});

//          -----------------------Code Claudinary------------------------------
   await cloudinary.v2.uploader.destroy(producto.public_id);
   const result = await cloudinary.v2.uploader.upload(req.file.path); // con esto mandamos la imagen almacenada temp de nuestro dicrectorio a claudinary y lo guardamos en una constante
   producto.imageURL = result.url; // Guardamos la propiedad url al objeto
   producto.public_id = result.public_id; // Guardamos la propiedad public_id al objeto
   await producto.save();
//          -----------------------EndCode Claudi ------------------------------

   req.flash('succes_msg','Producto actualializado correctamente');
   res.redirect('/productos');
};

productsCtrl.deleteProduct = async (req,res) =>{
   const producto= await Producto.findByIdAndDelete(req.params.id);

//          -----------------------Code Claudinary------------------------------
   await cloudinary.v2.uploader.destroy(producto.public_id);
//          -----------------------EndCode Claudi ------------------------------
   req.flash('success_msg','Producto eliminado satisfactoriamente');
   res.redirect('/productos');
};

productsCtrl.mostrarProducto = async (req,res) =>{
   const producto = await Producto.findById(req.params.id);
   // n es para hacer un random
   //var n = await Producto.count({"categoria": producto.categoria});
   //var r = Math.floor(Math.random() * n);

   const productos = await Producto.find({"categoria": producto.categoria}).limit(3); //Hacemos una peticion a la bd, lo filtramos segun si el usuario le pertenece y lo ordenamos por fecha de manera desendente
   res.render('productos/producto', {producto,productos});
}

productsCtrl.checkoutProduct = async (req,res) =>{
   // const customer = await stripe.customers.create({
   //    email: req.body.strispeEmail,
   //    source: req.body.stripeToken
   // });
   //guardamos id busacmos producto y lo guardamos en una orden
   const producto = await Producto.findById(req.body.id);
   
   const precioPz = producto.precio;
   const orden = producto.titulo;
   const cantidad = req.body.cantidad;
   const newOrden = new Cotizacion({orden, precioPz,cantidad});
   console.log(newOrden);
   newOrden.cliente = req.user.id;
   await newOrden.save();
   // Enviamos los datos a stripe
   // const charge = await stripe.charges.create({
   //    amount: precioPz*100,
   //    currency: 'MXN',
   //    customer: customer.id,
   //    description: producto.nombre
   // });
   req.flash('succes_msg','Producto agregado a la lista de cotizaciones');
   res.redirect('/usersClientes/mostrarPedidos');
};

productsCtrl.deleteCotizacion = async (req,res) =>{
   const cotizacion= await Cotizacion.findByIdAndDelete(req.params.id);

//          -----------------------EndCode Claudi ------------------------------
   req.flash('success_msg','eliminado satisfactoriamente');
   res.redirect('/usersClientes/mostrarPedidos');
};

productsCtrl.cotizar = async (req,res) =>{
   const user = await UserCliente.findById(req.params.id);//req.sessionID req.user._id
   const cotizaciones = await Cotizacion.find({cliente: user.id}).sort({createdAt:'desc'});
   
   // var cots = JSON.parse(cotizaciones);
    var cadena = ""
   // for(var i = 0; i < cots.length; i++ )
       

   for(var k in cotizaciones) {
      cadena += "Product: "+ cotizaciones[k].orden + " - cantidad: "+ cotizaciones[k].cantidad+ "<br>";
      const cotizacion= await Cotizacion.findByIdAndDelete(cotizaciones[k].id);
   }

   contentHTMl = `
      <h1>Cotizacion</h1>
      <h3>Cliente: ${user.nombre}</h3>
      <h3 >Correo: ${user.email}</h3>
      
      <ul>
         <li class="prettyprint">${cadena}</li>
      </ul>
   
   `;
   console.log(contentHTMl);
   // a donde lo enviamos
   const transporter = nodemailer.createTransport({
      host: 'mail.privateemail.com', // el host del correo
      port:465,
      secure:true, // es para cer si se envia con SSL o sin SSl
      auth:{
         user: 'cotizaciones@arknoe.store', // La cuenta a donde lo va a enviar
         pass: ':77Arknoe77:' // contraseña esto lo creas en el host
      },
      tls:{ // con esto fazt pudo hacer que se enviara el correo desde local host
         rejectUnauthorized: false
      }
   });
   // datos de ese correo
   const info = await transporter.sendMail({ // lo enviamos a shel hostin y el shel hostin lo envia al correo email, aqui si van los datos de walas Ulises
      from: "'ArcaNoe Server' <cotizaciones@arknoe.store> ",
      to:'alexgomeznear@gmail.com',
      subject: 'Cotizacion',
      html: contentHTMl
   });

   const cotizacion= await Cotizacion.findByIdAndDelete(cotizaciones.id);

   req.flash('success_msg','Cotizacion enviada satisfactoriamente');
   res.redirect('/usersClientes/mostrarPedidos');
};

module.exports = productsCtrl;