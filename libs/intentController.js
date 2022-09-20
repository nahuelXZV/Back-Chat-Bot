const pizza = require('../components/models/pizzaModel');

async function intentController(result, senderId) {
  let request_body = {};
  switch (result.intent.displayName) {
    // depende del intent que se detecte se ejecutara una funcion
    case 'catalogo':
      const res = await catalogo(result.fulfillmentText); // buscar en la base de datos las pizzas y crear un array con los nombres de las pizzas y sus precios
      request_body = await request(res, senderId); // enviar el array de pizzas
      break;
    default: // enviar el mensaje de respuesta
      request_body = await request(result.fulfillmentText, senderId);
      break;
  }
  console.log(request_body);
  return request_body;
}

async function catalogo(response) {
  // buscar en la base de datos mongoose las pizzas
  const dataDB = await pizza.find();
  // crear un array con los nombres de las pizzas y sus precios
  const data = [];
  /* dataDB.forEach((pizza) => {
    data.push({
      title: pizza.nombre,
      subtitle: pizza.precio,
      image_url: pizza.imagen,
      default_action: {
        type: 'web_url',
        url: 'https://www.facebook.com/pizzaspizzariasc',
        messenger_extensions: false,
        webview_height_ratio: 'tall',
        fallback_url: 'https://www.facebook.com/pizzaspizzariasc',
      },
    });
    return data;
  }); */
  dataDB.forEach((pizza) => {
    data.push(`\r\n -${pizza.nombre} a ${pizza.precio}Bs`);
  });
  const res = response.replace('[x]', data.toString() + '\r\n');
  return res;
}

async function request(res, senderId, type = 'text') {
  let request_body = {};
  switch (type) {
    case 'card':
      request_body = {
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
      };
      break;

    default:
      request_body = {
        recipient: {
          id: senderId,
        },
        message: {
          text: res,
        },
      };
      break;
  }
  return request_body;
}

module.exports = intentController;
