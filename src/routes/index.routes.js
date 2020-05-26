// IMPORTACIONES MODULS //
const {Router} = require('express');
const router = Router();
const cloudinary = require('cloudinary');
cloudinary.config({
   cloud_name: process.env.CLOUDINARY_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET
});

// IMPORTACIONES PROPIAS //
const { renderAbout, renderIndex, renderTipoUser, renderTipoUserSignin, renderPoliticas} = require('../controllers/index.controller');

router.get('/',  renderIndex);

router.get('/about', renderAbout);

router.get('/politicas', renderPoliticas);

router.get('/tipoUser', renderTipoUser);

router.get('/tipoUserSignin', renderTipoUserSignin);

module.exports = router;