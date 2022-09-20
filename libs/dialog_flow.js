const dialogflow = require('@google-cloud/dialogflow');
const { listenerCount } = require('nodemailer/lib/xoauth2');
const uuid = require('uuid');
const config = require('../config/config');

const PROYECT_ID = config.PROYECT_ID;

async function detectIntent(
  projectId = PROYECT_ID,
  sessionId = uuid.v4(),
  query = '',
  contexts,
  languageCode = 'es'
) {
  const sessionClient = new dialogflow.SessionsClient();
  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: query,
        // The language used by the client (en-US)
        languageCode: languageCode,
      },
    },
  };
  if (contexts && contexts.length > 0) {
    request.queryParams = {
      contexts: contexts,
    };
  }

  const responses = await sessionClient.detectIntent(request);
  const result = responses[0].queryResult;

  if (result.intent) {
    console.log(`Intent: ${result.intent.displayName}`);
  } else {
    console.log(`No intent matched.`);
  }
  return result;
}

async function executeQueries(projectId, sessionId, queries, languageCode) {
  // Keeping the context across queries let's us simulate an ongoing conversation with the bot
  let context;
  let intentResponse;
  for (const query of queries) {
    try {
      console.log(`Sending Query: ${query}`);
      intentResponse = await detectIntent(
        projectId,
        sessionId,
        query,
        context,
        languageCode
      );
      console.log('Detected intent');
      console.log(
        `Fulfillment Text: ${intentResponse.queryResult.fulfillmentText}`
      );
      // Use the context from this response for next queries
      context = intentResponse.queryResult.outputContexts;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = {
  detectIntent,
  executeQueries,
};
