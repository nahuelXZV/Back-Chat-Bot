//const response = require('../../network/response');
const express = require('express');
const config = require('../../config/config');

//const functions = require('firebase-functions');
//const { WebhookClient } = require('dialogflow-fulfillment');

const router = express.Router();

/* exports.dialogflowFirebaseFulfillment = functions.https.onRequest(
router.post('/', async (request, response, next) => {
  try {
    console.log(
      'Dialogflow Request headers: ' + JSON.stringify(request.headers)
    );
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

    const agent = new WebhookClient({ request, response });
    function welcome(agent) {
      agent.add(`Welcome to my agent!`);
    }

    function fallback(agent) {
      agent.add(`I didn't understand`);
      agent.add(`I'm sorry, can you try again?`);
    }
    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Default Fallback Intent', fallback);
    agent.handleRequest(intentMap);
  } catch (error) {
    next(error);
  }
});
//); */

router.post('/', async (request, res, next) => {
  try {
    console.log(request.body);
    const tag = request.body.queryResult.intent.displayName;
    let jsonResponse = {};
    if (tag === 'Default Welcome Intent') {
      //fulfillment response to be sent to the agent if the request tag is equal to "welcome tag"
      jsonResponse = {
        fulfillment_messages: [
          {
            text: {
              //fulfillment text response to be sent to the agent
              text: ['Hello from a GCF Webhook'],
            },
          },
        ],
      };
    } else if (tag === 'get-name') {
      //fulfillment response to be sent to the agent if the request tag is equal to "welcome tag"
      jsonResponse = {
        fulfillment_messages: [
          {
            text: {
              //fulfillment text response to be sent to the agent
              text: ['My name is Flowhook'],
            },
          },
        ],
      };
    } else {
      jsonResponse = {
        //fulfillment text response to be sent to the agent if there are no defined responses for the specified tag
        fulfillment_messages: [
          {
            text: {
              ////fulfillment text response to be sent to the agent
              text: [
                `There are no fulfillment responses defined for "${tag}"" tag`,
              ],
            },
          },
        ],
      };
    }
    res.send(jsonResponse);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
