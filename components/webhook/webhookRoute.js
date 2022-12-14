const webhookController = require('./webhookController');
const response = require('../../network/response');
const config = require('../../config/config');
const express = require('express');

const router = express.Router();
const controller = new webhookController();

router.get('/', async (req, res, next) => {
  try {
    if (req.query['hub.verify_token'] === config.KEY_VALIDATION) {
      res.status(200).send(req.query['hub.challenge']);
    } else {
      res.status(403).send('Error, wrong validation token');
    }
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    if (req.body.object === 'page') {
      req.body.entry.forEach(async (entry) => {
        const idUser = entry.id;
        entry.messaging.forEach(async (event) => {
          if (event.message) {
            await controller.process_event(event, idUser).catch((error) => {
              next(error);
            });
          }
        });
      });
      res.status(200).send('EVENT_RECEIVED');
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
