const pizza = require('../components/models/pizzaModel');
const cliente = require('../components/models/clienteModel');
const pizzeria = require('../components/models/pizzeriaModel');

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
    case 'pizzaEspecifica':
      res = await pizzaEspecifica(result);
      request_body = await request(res, senderId);
      break;
    case 'ubicacion':
      res = await ubicacion(result);
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
  console.log(response.parameters);
  console.log(
    response.parameters?.fields?.person?.structValue?.fields?.name?.stringValue
  );
  console.log(response.parameters?.fields?.phone?.stringValue);
  if (
    response.parameters?.fields?.person?.structValue?.fields?.name
      ?.stringValue &&
    response.parameters?.fields?.phone?.stringValue
  ) {
    await cliente.create({
      nombre:
        response.parameters?.fields?.person?.structValue?.fields?.name
          ?.stringValue,
      telefono: response.parameters?.fields?.phone?.stringValue,
    });
  }
  return response.fulfillmentText;
}

async function ubicacion(response) {
  const p = await pizzeria.find({ nombre: 'Pizzaria' });
  let detalle = `\r\n📍 *${p.direccion}* \r\n ubicacion gps: ${p.url}`;
  const res = response.replace('[x]', detalle + '\r\n');
  return res;
}

async function pizzaEspecifica(response) {
  let nombrep = response.substring(response.lastIndexOf("+") + 1, response.lastIndexOf("+"));
  const p = await pizza.find({ nombre: nombrep });
  let detalle = `\r\n Descripcion: ${p.detalle} \r\n Tamano: ${p.tamano}`;
  const res = response.replace('[x]', detalle + '\r\n');

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
