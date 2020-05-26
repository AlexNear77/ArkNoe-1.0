// IMPORTACIONES MODULS //
const {Router} = require('express');
const router = Router();

const {renderSignUpForm, 
   renderSignipForm,
   signup,
   signin,
   logout,
   renderPedidos
} = require('../controllers/usersClientes.controller');


const { isAuthenticated } = require('../helpers/validaRutas');

router.get('/usersClientes/signup', renderSignUpForm );

router.post('/usersClientes/signup', signup );

router.get('/usersClientes/signin', renderSignipForm );

router.post('/usersClientes/signin', signin );

router.get('/usersClientes/logout', logout );

router.get('/usersClientes/mostrarPedidos',isAuthenticated, renderPedidos);

module.exports = router;