const webhookRoute = require('../components/webhook/webhookRoute');
// const authRouter = require('../components/auth/authRoute');
const usersRouter = require('../components/users/userRoute');
const express = require('express');

function mainRouter(app) {
  // Lista de rutas
  const router = express.Router(); //create a router
  app.use('/api', router); //use the router
  router.use('/users', usersRouter); //use the usersRouter
  //router.use('/auth', authRouter); //use the authRouter
  router.use('/webhook', webhookRoute); //use the webhookRoute
}

module.exports = mainRouter;
