const webhookRoute = require('../components/webhook/webhookRoute');
const authRouter = require('../components/auth/authRoute');
const usersRouter = require('../components/users/userRoute');
const testRouter = require('../components/test/testRoute');
const pedidoRouter = require('../components/pedidos/pedidoRoute');
const prospectoRouter = require('../components/prospecto/prospectoRoute');
const clienteRouter = require('../components/clientes/clienteRoute');
const promoRouter = require('../components/promociones/promocionesRoute');
const express = require('express');

function mainRouter(app) {
  // Lista de rutas
  const router = express.Router(); //create a router
  app.use('/api', router); //use the router
  router.use('/users', usersRouter); //use the usersRouter
  router.use('/auth', authRouter); //use the authRouter
  router.use('/webhook', webhookRoute); //use the webhookRoute
  router.use('/test', testRouter); //use the testRouter
  router.use('/pedidos', pedidoRouter); //use the pedidoRouter
  router.use('/prospectos', prospectoRouter); //use the prospectoRouter
  router.use('/clientes', clienteRouter); //use the clienteRouter
  router.use('/promociones', promoRouter); //use the promoRouter
}

module.exports = mainRouter;
