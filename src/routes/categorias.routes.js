// IMPORTACIONES MODULS //
const {Router} = require('express');
const router = Router();

const { renderCategoria1, renderCategoria2, renderCategoria3, renderCategoria4
} = require('../controllers/categorias.controller');

router.get('/categorias/equipoMedico', renderCategoria1 );

router.get('/categorias/medioDeContraste', renderCategoria2 );

router.get('/categorias/materialRadiologico', renderCategoria3 );

router.get('/categorias/materialDeCuracion', renderCategoria4);

module.exports = router;