const clienteController = require('./clienteController');
const response = require('../../network/response');
const express = require('express');
const router = express.Router();
const controller = new clienteController();

router.get('/', async (req, res, next) => {
  try {
    const model = await controller.getAll();
    response.success(req, res, model, 200);
  } catch (error) {
    next(error);
  }
});

router.get('/frecuentes', async (req, res, next) => {
  try {
    const model = await controller.getClientesFrecuentes();
    response.success(req, res, model, 200);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params; //used for getting the parameter
  await controller
    .find(id)
    .then((data) => {
      response.success(req, res, data, 200);
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/', async (req, res, next) => {
  try {
    const body = req.body; //used for getting the body
    const rest = await controller.add(body);
    response.success(req, res, rest, 201);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const body = req.body; //used for getting the body
  await controller
    .edit(body, id)
    .then((data) => {
      response.success(req, res, data, 201);
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  await controller
    .delete(id)
    .then((data) => {
      response.success(req, res, data, 201);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
