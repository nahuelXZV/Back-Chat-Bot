const boom = require('@hapi/boom');
const config = require('../../config/config');
const request = require('request');

class UserController {
  constructor() {}

  process_event(event) {
    // Capturamos los datos del que genera el evento y el mensaje
    const senderId = event.sender.id;
    const message = event.message;
    const messageAttachments = event.attachments;

    if (message.text) {
      var response = {
        text: 'Enviaste este mensaje: ' + message.text,
      };
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

module.exports = UserController;
