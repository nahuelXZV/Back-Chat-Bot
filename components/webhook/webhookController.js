const boom = require('@hapi/boom');
const config = require('../../config/config');
const request = require('request');
const dialogflow = require('../../libs/dialog_flow');
const { error } = require('../../network/response');

class webhookController {
  constructor() {}

  async process_event(event) {
    // Capturamos los datos del que genera el evento y el mensaje
    const senderId = event.sender.id;
    const message = event.message;
    const messageAttachments = event.attachments;
    if (message.text) {
      console.log('Mensaje recibido: ' + message.text);

      // Enviando el mensaje al dialogflow
      const res = await dialogflow
        .detectIntent(config.PROYECT_ID, senderId, message.text, '', 'es')
        .catch((error) => {
          console.log(error);
        });

      // aqui editaremos el mensaje de respuesta

      console.log('Respuesta:  ', res);

      //------------------------------------------------
      if (res) {
        var response = {
          text: res,
        };
      } else {
        var response = {
          text: 'Puedes reescribir tu pregunta?',
        };
      }
    } else if (messageAttachments) {
      var response = {
        text: 'Enviaste un adjunto',
      };
    } else {
      var response = {
        text: 'No entiendo el mensaje',
      };
    }
    this.sendMessage(senderId, response.text);
  }

  async sendMessage(senderId, messageText) {
    const request_body = {
      recipient: {
        id: senderId,
      },
      message: {
        text: messageText,
      },
    };

    request(
      {
        uri: 'https://graph.facebook.com/v14.0/me/messages',
        qs: { access_token: config.KEY_FACEBOOK },
        method: 'POST',
        json: request_body,
      },
      (err, res, body) => {
        if (!err) {
          console.log('Mensaje enviado!');
        } else {
          console.error('No se puedo enviar el mensaje:' + err);
          boom.badImplementation(error);
        }
      }
    );
  }
}

module.exports = webhookController;
