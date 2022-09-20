const pizza = require('../components/models/pizzaModel');
const cliente = require('../components/models/clienteModel');

async function intentController(result, senderId) {
  let request_body = {};
  switch (result.intent.displayName) {
    // depende del intent que se detecte se ejecutara una funcion
    case 'catalogo':
      res = await catalogo(result.fulfillmentText); // buscar en la base de datos las pizzas y crear un array con los nombres de las pizzas y sus precios
      request_body = await request(res, senderId); // enviar el array de pizzas
      break;
    case 'datos':
      res = await datos(result);
      request_body = await request(res, senderId);
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
  let pizzas = '';
  dataDB.forEach((pizza) => {
    pizzas += `\r\n🍕 *${pizza.nombre}* ${pizza.tamano} a ${pizza.precio}Bs. `;
  });
  const res = response.replace('[x]', pizzas + '\r\n');
  return res;
}

async function datos(response) {
  if (response.parameters?.person?.name && response.parameters?.phone) {
    await cliente.create({
      nombre: response.parameters.person.name.stringValue,
      telefono: response.parameters.phone.stringValue,
    });
  }
  return response.fulfillmentText;
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
