const pizza = require('../components/models/pizzaModel');
const cliente = require('../components/models/clienteModel');
const Satisfaccion = require('../components/models/satisfaccionModel');

async function intentController(result, senderId) {
  let request_body = {};
  switch (result.intent.displayName) {
    // depende del intent que se detecte se ejecutara una funcion
    case 'catalogo':
      res = await catalogo(result.fulfillmentText); // buscar en la base de datos las pizzas y crear un array con los nombres de las pizzas y sus precios
      request_body = await request(res, senderId); // enviar el array de pizzas
      break;
    case 'datos':
      res = await datos(result, senderId);
      request_body = await request(res, senderId);
      break;
    case 'correo':
      res = await correos(result, senderId);
      request_body = await request(res, senderId);
      break;
    case 'Satisfaccion':
      res = await satisfaccion(result, senderId);
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

async function datos(response, senderId) {
  const name =
    response.parameters?.fields?.person?.structValue?.fields?.name?.stringValue; // nombre del cliente
  const phone = response.parameters?.fields?.phone?.stringValue; // telefono del cliente
  const person = await cliente.findOne({ senderId }); // buscar en la base de datos si el cliente ya existe

  if (name && phone) {
    if (person) {
      // si existe actualizar el telefono
      await cliente.updateOne({ telefono: phone, senderId: senderId });
    } else {
      // si no existe crear un nuevo cliente
      await cliente.create({
        nombre: name,
        telefono: phone,
        senderId: senderId,
      });
    }
  }
  return response.fulfillmentText; // enviar el mensaje de respuesta
}

async function correos(response, senderId) {
  const email = response.parameters?.fields?.email?.stringValue; // nombre del cliente
  const person = await cliente.findOne({ senderId }); // buscar en la base de datos si el cliente ya existe
  if (email) {
    if (person) {
      // si existe actualizar el telefono
      await cliente.updateOne({ correo: email });
    } else {
      await cliente.create({
        // guardar en la base de datos el nombre y el telefono del cliente
        correo: email,
        senderId: senderId,
      });
    }
  }
  return response.fulfillmentText; // enviar el mensaje de respuesta
}

async function satisfaccion(response, senderId) {
  const satisfaccion = response.parameters?.fields?.satisfaccion?.stringValue; // nombre del cliente
  const person = await cliente.findOne({ senderId }); // buscar en la base de datos si el cliente ya existe
  if (satisfaccion) {
    if (person) {
      await Satisfaccion.create({
        opinion: satisfaccion,
        cliente_id: person._id,
      });
    } else {
      await Satisfaccion.create({
        // guardar en la base de datos el nombre y el telefono del cliente
        opinion: email,
      });
    }
  }
  return response.fulfillmentText; // enviar el mensaje de respuesta
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
