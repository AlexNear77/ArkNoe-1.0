// IMPORTACIONES MODULS //
const {Router} = require('express');
const router = Router();

//Modulos para agregar y guardar imagenes
const multer = require('multer');
const path = require('path');
const uuid = require('uuid/v4'); // para generar un id unico

const storage = multer.diskStorage({// CONFIGURAMOS a multer para que guarde el archivo para que lo guarde con el numbre original y no con un hasg(id unico) y lo guardamos en una varuable para despues utilizarlo
   destination: path.join(__dirname, '/public/img'), // donde lo bamos a guardar
   filename: (req, file ,cb) =>{ // esta funcion lo que hace es que cada vez que subimos una imagen, esta funcion puede sacar o modificar la info de esa img
       cb(null, uuid()+ path.extname(file.originalname).toLocaleLowerCase());
   }
});
const upload = multer({
   storage: storage,
   dest: path.join(__dirname, '/public/img'), // como lo vamos a subir
   fileFilter:(req,file,cb) =>{
      const  filetypes = /jpeg|jpg|png/; //expresion regular
      const mimetype = filetypes.test(file.mimetype); // con teste checamos que concidan con esos valores ¨] poer lo los mete sin mjigrar los datos.._
      const extname = filetypes.test(path.extname(file.originalname));
      if(mimetype && extname){ // lsolo po___ lll
         return cb(null,true);
      }else{
         cb("error: Archivo no valido, solo imagenes .jpg, jpeg y png...");
      }
   }
}).single('imagen'); 



const { renderProductForm, 
   createNewProduct ,
   renderProductos,
   renderEditForm, 
   updateProduct, 
   deleteProduct,
   checkoutProduct,
   mostrarProducto,
   deleteCotizacion,
   cotizar
} = require('../controllers/productos.controller');

const { isAuthenticated } = require('../helpers/validaRutas');

// Nuevo Producto
router.get('/productos/add', isAuthenticated, renderProductForm);
router.post('/productos/new-product', isAuthenticated, upload,createNewProduct);

//Obtener Todas los productos
router.get('/productos', isAuthenticated,renderProductos);

//editar Productos
router.get('/productos/edit/:id', isAuthenticated,renderEditForm);
router.put('/productos/edit/:id', isAuthenticated, upload,updateProduct);

//Eliminar Producto
router.delete('/productos/delete/:id',isAuthenticated, deleteProduct);
router.delete('/productos/cotizacion/delete/:id',isAuthenticated, deleteCotizacion);

//Mostrar Producto
router.get('/productos/producto/:id',mostrarProducto);
//Comprar Producto
router.post('/productos/checkout', isAuthenticated,checkoutProduct);
//cotizar Productos
router.post('/send-email/:id',cotizar);

module.exports = router;