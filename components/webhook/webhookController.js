const boom = require('@hapi/boom');
const config = require('../../config/config');

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
    try {
      await axios({
        url: 'https://graph.facebook.com/v14.0/me/messages',
        params: {
          access_token: config.KEY_FACEBOOK,
        },
        method: 'POST',
        data: request_body,
      });
    } catch (error) {
      boom.badImplementation(error);
    }
  }
}

module.exports = UserController;
