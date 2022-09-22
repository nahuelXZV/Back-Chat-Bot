const pizza = require('../components/models/pizzaModel');
const cliente = require('../components/models/clienteModel');
const Satisfaccion = require('../components/models/satisfaccionModel');
const pizzeria = require('../components/models/pizzeriaModel');
const cliente_pizza = require('../components/models/cliente_pizzaModel');
const promocion = require('../components/models/promocionModel');

async function intentController(result, senderId, idUser) {
  let request_body = {};
  switch (result.intent.displayName) {
    // depende del intent que se detecte se ejecutara una funcion
    case 'catalogo':
      res = await catalogo(result.fulfillmentText); // buscar en la base de datos las pizzas y crear un array con los nombres de las pizzas y sus precios
      request_body = await request(res, senderId); // enviar el array de pizzas
      break;
    case 'ubicacion - yes':
      res = await catalogo(result.fulfillmentText); // buscar en la base de datos las pizzas y crear un array con los nombres de las pizzas y sus precios
      request_body = await request(res, senderId); // enviar el array de pizzas
      break;
    case 'Default Welcome Intent - custom':
      res = await catalogo(result.fulfillmentText); // buscar en la base de datos las pizzas y crear un array con los nombres de las pizzas y sus precios
      request_body = await request(res, senderId); // enviar el array de pizzas
      break;
    case 'datos':
      res = await datos(result, senderId); // guardar en la base de datos el nombre y el telefono del cliente
      request_body = await request(res, senderId);
      break;
    case 'correo':
      res = await correos(result, senderId); // guardar en la base de datos el nombre y el telefono del cliente
      request_body = await request(res, senderId);
      break;
    case 'Satisfaccion':
      res = await satisfaccion(result, senderId); // guardar la satisfaccion del cliente
      request_body = await request(res, senderId);
      break;
    case 'pizzaEspecifica':
      res = await pizzaEspecifica(result, senderId); // guardar en la base de datos el nombre y el telefono del cliente
      request_body = await request(res, senderId);
      break;
    case 'precios':
      res = await precios(result, senderId); // precios de una pizza especifica
      request_body = await request(res, senderId);
      break;
    case 'ubicacion':
      res = await ubicacion(result.fulfillmentText); // ubicacion de la pizzeria
      request_body = await request(res, senderId);
      break;
    case 'promociones':
      res = await promociones(result.fulfillmentText); // busca en la BD las promociones y crea un array con los datos
      request_body = await request(res, senderId); // envia el array de promociones
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
async function promociones(response) {
  // buscar en la base de datos mongoose las promociones
  const dataDB = await promocion.find();
  let promos = '';
  dataDB.forEach((promo) => {
    promos += `\r\n *${promo.nombre}.* \r\n - ${promo.descripcion} \r\n.`;
  });
  const res = response.replace('[x]', promos + '\r\n');
  return res;
}
async function datos(response, idUser) {
  const name =
    response.parameters?.fields?.person?.structValue?.fields?.name?.stringValue; // nombre del cliente
  const phone = response.parameters?.fields?.phone?.stringValue; // telefono del cliente
  const person = await cliente.findOne({ idUser: idUser }); // buscar en la base de datos si el cliente ya existe

  if (name && phone) {
    if (person) {
      // si existe actualizar el telefono
      await person.updateOne({ telefono: phone, nombre: name });
    } else {
      // si no existe crear un nuevo cliente
      await cliente.create({
        nombre: name,
        telefono: phone,
        idUser: idUser,
      });
    }
  }
  return response.fulfillmentText; // enviar el mensaje de respuesta
}
async function correos(response, idUser) {
  const email = response.parameters?.fields?.email?.stringValue; // nombre del cliente
  const person = await cliente.findOne({ idUser: idUser }); // buscar en la base de datos si el cliente ya existe
  if (email) {
    if (person) {
      // si existe actualizar el telefono
      await person.updateOne({ correo: email }).catch(() => {
        return 'puedes proporcionarnos otro correo?';
      });
    } else {
      await cliente.create({
        // guardar en la base de datos el nombre y el telefono del cliente
        correo: email,
        idUser: idUser,
      });
    }
  }
  return response.fulfillmentText; // enviar el mensaje de respuesta
}
async function satisfaccion(response, idUser) {
  const satisfaccionDF = await response.parameters?.fields?.satisfaccion
    ?.stringValue; // nombre del cliente
  const person = await cliente.findOne({ idUser: idUser }); // buscar en la base de datos si el cliente ya existe
  if (satisfaccionDF) {
    if (person) {
      await Satisfaccion.create({
        opinion: satisfaccionDF,
        cliente_id: person._id,
      });
    } else {
      await Satisfaccion.create({
        // guardar en la base de datos el nombre y el telefono del cliente
        opinion: satisfaccionDF,
      });
    }
  }
  return response.fulfillmentText; // enviar el mensaje de respuesta
}
async function ubicacion(response) {
  // encontrar la priemra pizzeria
  const pizzeriaDB = await pizzeria.findOne();
  console.log(pizzeriaDB);
  let detalle = `\r\n📍 *${pizzeriaDB.direccion}* \r\n ubicación gps: ${pizzeriaDB.url}`;
  const res = response.replace('[x]', detalle + '\r\n');
  return res;
}
async function pizzaEspecifica(response, idUser) {
  const pizzaDF = await response.parameters?.fields?.TipoPizza?.stringValue;
  const pizzaDB = await pizza.findOne({ nombre: pizzaDF });
  const person = await cliente.findOne({ idUser: idUser });

  // guardar la pizza buscada en la base de datos
  if (person && pizzaDB) {
    await cliente_pizza.create({
      cliente_id: person._id,
      pizza_id: pizzaDB._id,
    });
  }

  let detalle;
  if (pizzaDB) {
    detalle = `\r\nDescripción: ${pizzaDB.descripcion} \r\nTamaño: ${pizzaDB.tamano} \r\nPrecio: ${pizzaDB.precio}Bs.`;
  } else {
    return 'Lo siento, no tenemos esa pizza';
  }
  const res = response.fulfillmentText.replace('[x]', detalle + '\r\n');
  return res;
}
async function precios(response, idUser) {
  const pizzaDF = await response.parameters?.fields?.TipoPizza?.stringValue;
  const pizzaDB = await pizza.findOne({ nombre: pizzaDF });
  const person = await cliente.findOne({ idUser: idUser });

  // guardar la pizza buscada en la base de datos
  if (person && pizzaDB) {
    await cliente_pizza.create({
      cliente_id: person._id,
      pizza_id: pizzaDB._id,
    });
  }

  let detalle;
  if (pizzaDB) {
    detalle = `${pizzaDB.precio}Bs.`;
  } else {
    return 'Lo siento, no tenemos esa pizza';
  }
  const res = response.fulfillmentText.replace('[x]', detalle + '\r\n');
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
