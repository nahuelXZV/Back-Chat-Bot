const pizza = require('../components/models/pizzaModel');

async function intentController(result, senderId) {
  switch (result.intent.displayName) {
    // depende del intent que se detecte se ejecutara una funcion
    case 'catalogo':
      const res = await catalogo(); // buscar en la base de datos las pizzas y crear un array con los nombres de las pizzas y sus precios
      return request(res, senderId, 'card'); // enviar el array de pizzas

    default:
      return request(result.fulfillmentText, senderId, 'card'); // enviar el mensaje de respuesta
  }
}

async function catalogo() {
  // buscar en la base de datos mongoose las pizzas
  const dataDB = await pizza.find();
  // crear un array con los nombres de las pizzas y sus precios
  const data = [];
  dataDB.forEach((pizza) => {
    data.push({
      title: pizza.nombre,
      subtitle: pizza.precio,
      image_url: pizza.imagen,
      default_action: {
        type: 'web_url',
        url: 'https://www.facebook.com/pizzaspizzariasc',
        messenger_extensions: true,
        webview_height_ratio: 'tall',
        fallback_url: 'https://www.facebook.com/pizzaspizzariasc',
      },
    });
  });
  // const res = response.replace('[x]', data.toString());
  return data;
}

function request(res, senderId, type) {
  switch (type) {
    case 'card':
      return (request_body = {
        recipient: {
          id: senderId,
        },
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'generic',
              elements: res,
            },
          },
        },
      });
      break;

    default:
      return (request_body = {
        recipient: {
          id: senderId,
        },
        message: {
          text: res,
        },
      });
      break;
  }
}

module.exports = intentController;
