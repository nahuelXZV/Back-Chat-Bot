const usersRouter = require('../components/users/userRoute');
const authRouter = require('../components/auth/authRoute');
const webhookRoute = require('../components/webhook/webhookRoute');
const dialog_flowRoute = require('../components/dialog_flow/dialog_flowRoute');
const express = require('express');

function mainRouter(app) {
  // Lista de rutas
  const router = express.Router(); //create a router
  app.use('/api', router); //use the router
  router.use('/users', usersRouter); //use the usersRouter
  router.use('/auth', authRouter); //use the authRouter
  router.use('/webhook', webhookRoute); //use the webhookRoute
  router.use('/dialogflow', dialog_flowRoute); //use the dialog_flowRoute
}

module.exports = mainRouter;
 