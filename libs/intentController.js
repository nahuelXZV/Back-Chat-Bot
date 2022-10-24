const prospecto_ingreso = require('../components/models/prospecto_ingresoModel');
const prospecto_pizza = require('../components/models/prospecto_pizzaModel');
const Satisfaccion = require('../components/models/satisfaccionModel');
const promocion = require('../components/models/promocionModel');
const prospecto = require('../components/models/prospectoModel');
const pizzeria = require('../components/models/pizzeriaModel');
const cliente = require('../components/models/clienteModel');
const pizza = require('../components/models/pizzaModel');
const carrito = require('../components/models/carritoModel');
const detalle_carrito = require('../components/models/carrito_pizzaModel');
const pedidos = require('../components/models/pedidoModel');
const detalle_pedido = require('../components/models/pedido_pizzaModel');
const config = require('../config/config');
const request = require('request');
const axios = require('axios');

async function intentController(result, facebookId) {
  let request_body = {};
  await getPerfil(facebookId);
  switch (result.intent.displayName) {
    // depende del intent que se detecte se ejecutara una funcion
    case 'catalogo':
      res = await catalogo(result.fulfillmentText, facebookId); // buscar en la base de datos las pizzas y crear un array con los nombres de las pizzas y sus precios
      request_body = await requestM(res, facebookId); // enviar el array de pizzas
      break;
    case 'ubicacion - yes':
      res = await catalogo(result.fulfillmentText, facebookId); // buscar en la base de datos las pizzas y crear un array con los nombres de las pizzas y sus precios
      request_body = await requestM(res, facebookId); // enviar el array de pizzas
      break;
    case 'Default Welcome Intent - custom':
      res = await catalogo(result.fulfillmentText, facebookId); // buscar en la base de datos las pizzas y crear un array con los nombres de las pizzas y sus precios
      request_body = await requestM(res, facebookId); // enviar el array de pizzas
      break;
    case 'Default Welcome Intent':
      res = await welcome(result.fulfillmentText, facebookId); // buscar en la base de datos las pizzas y crear un array con los nombres de las pizzas y sus precios
      request_body = await requestM(res, facebookId); // enviar el array de pizzas
      break;
    case 'datos':
      res = await datos(result, facebookId); // guardar en la base de datos el nombre y el telefono del cliente
      request_body = await requestM(res, facebookId);
      break;
    case 'correo':
      res = await correos(result, facebookId); // guardar en la base de datos el nombre y el telefono del cliente
      request_body = await requestM(res, facebookId);
      break;
    case 'promociones - custom':
      res = await correos(result, facebookId); // guardar en la base de datos el nombre y el telefono del cliente
      request_body = await requestM(res, facebookId);
      break;
    case 'Satisfaccion':
      res = await satisfaccion(result, facebookId); // guardar la satisfaccion del cliente
      request_body = await requestM(res, facebookId);
      break;
    case 'datos - custom':
      res = await satisfaccion(result, facebookId); // guardar la satisfaccion del cliente
      request_body = await requestM(res, facebookId);
      break;
    case 'pizzaEspecifica':
      res = await pizzaEspecifica(result, facebookId); // guardar en la base de datos el nombre y el telefono del cliente
      request_body = await requestM(res, facebookId);
      break;
    case 'pedido':
      res = await pedido(result, facebookId);
      request_body = await requestM(res, facebookId);
      break;
    case 'precios':
      res = await precios(result, facebookId); // precios de una pizza especifica
      request_body = await requestM(res, facebookId);
      break;
    case 'ubicacion':
      res = await ubicacion(result.fulfillmentText); // ubicacion de la pizzeria
      request_body = await requestM(res, facebookId);
      break;
    case 'promociones':
      res = await promociones(result.fulfillmentText); // busca en la BD las promociones y crea un array con los datos
      request_body = await requestM(res, facebookId); // envia el array de promociones
      break;
    case 'restaurante':
      res = await restaurante(result.fulfillmentText);
      request_body = await requestM(res, facebookId);
      break;
    case 'confirmacion - yes':
      res = await confirmacion(result.fulfillmentText);
      request_body = await requestM(res, facebookId);
      break;
    case 'carrito':
      res = await confirmacion(result.fulfillmentText);
      request_body = await requestM(res, facebookId);
      break;
    default: // enviar el mensaje de respuesta
      request_body = await requestM(result.fulfillmentText, facebookId);
      break;
  }
  console.log(request_body);
  return request_body;
}

async function catalogo(response, facebookId) {
  const dataDB = await pizza.find().limit(5);
  let pizzas = '';
  let images = [];
  dataDB.forEach((pizza) => {
    pizzas += `\r\n🍕 *${pizza.nombre}* ${pizza.tamano} a ${pizza.precio}Bs. `;
    images.push({ url: pizza.imagen, is_reusable: true });
  });
  const res = response.replace('[x]', pizzas + '\r\n');
  await sendImages(images, facebookId).catch((err) => {
    console.log(err);
    return res;
  });
  return res;
}

async function promociones(response) {
  const dataDB = await promocion.find().limit(5);
  let promos = '';
  dataDB.forEach((promo) => {
    promos += `\r\n*✨${promo.nombre}*\r\n-${promo.descripcion}. \r\n`;
  });
  const res = response.replace('[x]', promos);
  return res;
}

async function restaurante(response) {
  const pizzeriaDB = await pizzeria.findOne();
  let detalle = `${pizzeriaDB.celular}`;
  const res = response.replace('[x]', detalle + '\r\n');
  return res;
}

async function datos(response, facebookId) {
  const name =
    response.parameters?.fields?.person?.structValue?.fields?.name?.stringValue; // nombre del cliente
  const phone = response.parameters?.fields?.phone?.stringValue; // telefono del cliente
  const person = await cliente.findOne({ facebookId: facebookId }); // buscar en la base de datos si el cliente ya existe

  if (name && phone) {
    if (person) {
      // si existe actualizar el telefono
      await person.updateOne({ telefono: phone, nombre: name });
    } else {
      // si no existe crear un nuevo cliente
      const $prosp = await prospecto.findOne({ facebookId: facebookId });
      await cliente
        .create({
          nombre: name,
          telefono: phone,
          facebookId: facebookId,
          prospectoId: $prosp._id,
          createdAt: new Date().toLocaleString('es-ES', {
            timeZone: 'America/La_Paz',
          }),
        })
        .catch((err) => {
          return response.fulfillmentText;
        });
    }
  }
  return response.fulfillmentText; // enviar el mensaje de respuesta
}

async function correos(response, facebookId) {
  const email = response.parameters?.fields?.email?.stringValue; // nombre del cliente
  const person = await cliente.findOne({ facebookId: facebookId }); // buscar en la base de datos si el cliente ya existe
  if (email) {
    if (person) {
      // si existe actualizar el correo
      await person.updateOne({ correo: email }).catch(() => {
        return 'puedes proporcionarnos otro correo?';
      });
    } else {
      const $prosp = await prospecto.findOne({ facebookId: facebookId });
      await cliente
        .create({
          nombre: $prosp.nombre,
          correo: email,
          facebookId: facebookId,
          prospectoId: $prosp._id,
          createdAt: new Date().toLocaleString('es-ES', {
            timeZone: 'America/La_Paz',
          }),
        })
        .catch((err) => {
          return response.fulfillmentText;
        });
    }
  }
  return response.fulfillmentText; // enviar el mensaje de respuesta
}

async function satisfaccion(response, facebookId) {
  const satisfaccionDF = await response.parameters?.fields?.satisfaccion
    ?.stringValue; // nombre del cliente
  const person = await cliente.findOne({ facebookId: facebookId }); // buscar en la base de datos si el cliente ya existe
  if (satisfaccionDF) {
    if (person) {
      await Satisfaccion.create({
        opinion: satisfaccionDF,
        clienteId: person._id,
        fecha: new Date().toLocaleString('es-ES', {
          timeZone: 'America/La_Paz',
        }),
      });
    } else {
      await Satisfaccion.create({
        opinion: satisfaccionDF,
        fecha: new Date().toLocaleString('es-ES', {
          timeZone: 'America/La_Paz',
        }),
      });
    }
  }
  return response.fulfillmentText; // enviar el mensaje de respuesta
}

async function ubicacion(response) {
  // encontrar la priemra pizzeria
  const pizzeriaDB = await pizzeria.findOne();
  let detalle = `\r\n📍 *${pizzeriaDB.direccion}* \r\n📍 *Ubicación gps*: ${pizzeriaDB.url}`;
  const res = response.replace('[x]', detalle + '\r\n');
  return res;
}

async function welcome(response, facebookId) {
  // encontrar la primera pizzeria
  const person = await prospecto.findOne({ facebookId: facebookId });
  // substring antes del espacio
  const name = person.nombre.substring(0, person.nombre.indexOf(' '));
  const res = response.replace('[x]', name);
  return res;
}

async function pizzaEspecifica(response, facebookId) {
  const pizzaDF = await response.parameters?.fields?.TipoPizza?.stringValue;
  const pizzaDB = await pizza.findOne({ nombre: pizzaDF });
  const person = await prospecto.findOne({ facebookId: facebookId });

  // guardar la pizza buscada en la base de datos
  if (person && pizzaDB) {
    await prospecto_pizza.create({
      prospectoId: person._id,
      pizzaId: pizzaDB._id,
      fecha: new Date().toLocaleString('es-ES', {
        timeZone: 'America/La_Paz',
      }),
    });
  }

  let detalle;
  if (pizzaDB) {
    detalle = `\r\n🧾Descripción: ${pizzaDB.descripcion} \r\n🍕Tamaño: *${pizzaDB.tamano}* \r\n💵Precio: *${pizzaDB.precio}Bs*.`;
  } else {
    return 'Lo siento, no tenemos esa pizza';
  }
  const res = response.fulfillmentText.replace('[x]', detalle + '\r\n');
  return res;
}

async function pedido(response, facebookId) {
  const pizzaDF = await response.parameters?.fields?.TipoPizza?.stringValue;
  let cantidad = await response.parameters?.fields?.number?.stringValue;
  if (!isNaN(cantidad)) {
    cantidad = parseInt(cantidad);
  }
  // validar que exista la pizza
  const pizzaDB = await pizza.findOne({ nombre: pizzaDF });
  const person = await prospecto.findOne({ facebookId: facebookId });
  let cesta = await carrito.findOne({ clienteId: facebookId });

  if (person && pizzaDB) {//Existe pizza y prospecto
    const clienteDB = await cliente.findOne({ prospectoId: person._id });
    if (!cesta) {//no existe el carrito
      if (clienteDB) {//es cliente
        cesta = await carrito.create({
          montoTotal: 0,
          fecha: new Date().toLocaleString('es-ES', {
            timeZone: 'America/La_Paz',
          }),
          clienteId: clienteDB._id,
        });
      } else {//es prospecto
        cesta = await carrito.create({
          montoTotal: 0,
          fecha: new Date().toLocaleString('es-ES', {
            timeZone: 'America/La_Paz',
          }),
          prospectoId: person._id,
        });
      }
    }
    //creando el detalle
    let precio = cantidad * pizzaDB.precio;
    await detalle_carrito.create({
      cantidad: cantidad,
      precio: precio,
      pizzaId: pizzaDB._id,
      carritoId: cesta._id,
      createdAt: new Date().toLocaleString('es-ES', {
        timeZone: 'America/La_Paz',
      }),
    });
    //actualizando monto carrito
    let monto = cesta.montoTotal + precio;
    cesta.updateOne({ montoTotal: monto });

  } else {//no existe pizza
    return 'Lo sentimos no tenemos esa pizza';
  }
  return response.fulfillmentText;
}

async function confirmacion(response, facebookId) {
  const pros = await prospecto.findOne({ facebookId: facebookId });
  let client = await cliente.findOne({ facebookId: facebookId });

  if (client || pros) {
    if (!client) {
      client = await cliente.create({
        nombre: pros.nombre,
        facebookId: facebookId,
        prospectoId: pros._id,
        createdAt: new Date().toLocaleString('es-ES', {
          timeZone: 'America/La_Paz',
        }),
      });
      await carrito.findOneAndUpdate({ prospectoId: pros._id }, { clienteId: client._id });
    }
    const cest = await carrito.findOne({ clienteId: client._id });
    if (cest) {
      const pedidoc = await pedidos.create({
        montoTotal: cest.montoTotal,
        fecha: new Date().toLocaleString('es-ES', {
          timeZone: 'America/La_Paz',
        }),
        clienteId: client._id,
      });
      const detalleDB = await detalle_carrito.findOne({ carritoId: cest._id });
      detalleDB.forEach((detalle) => {
        detalle_pedido.create({
          pedidoId: pedidoc._id,
          cantidad: detalle.cantidad,
          precio: detalle.precio,
          pizzaId: detalle.pizzaId,
          createdAt: new Date().toLocaleString('es-ES', {
            timeZone: 'America/La_Paz',
          }),
        });
      });
      await detalle_carrito.remove({ carritoId: cest._id });
      await carrito.remove({ _id: cest._id }, { justOne: true });
    } else {
      return 'Su carrito se encuentra vacio';
    }
  }
  return response.fulfillmentText;
}

async function precios(response, facebookId) {
  const pizzaDF = await response.parameters?.fields?.TipoPizza?.stringValue;
  const pizzaDB = await pizza.findOne({ nombre: pizzaDF });
  const person = await prospecto.findOne({ facebookId: facebookId });

  // guardar la pizza buscada en la base de datos
  if (person && pizzaDB) {
    await prospecto_pizza.create({
      prospectoId: person._id,
      pizzaId: pizzaDB._id,
      fecha: new Date().toLocaleString('es-ES', {
        timeZone: 'America/La_Paz',
      }),
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

async function requestM(res, facebookId, type = 'text') {
  let request_body = {};
  switch (type) {
    case 'card':
      request_body = {
        recipient: {
          id: facebookId,
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
          id: facebookId,
        },
        message: {
          text: res,
        },
      };
      break;
  }
  return request_body;
}

async function sendImages(request_body, facebookId) {
  await request_body.forEach((element) => {
    request(
      {
        uri: 'https://graph.facebook.com/v14.0/me/messages',
        qs: { access_token: config.KEY_FACEBOOK },
        method: 'POST',
        json: {
          recipient: {
            id: facebookId,
          },
          message: {
            attachment: {
              type: 'image',
              payload: {
                url: element.url,
                is_reusable: true,
              },
            },
          },
        },
      },
      (err, res, body) => {
        if (!err) {
          console.log('Imagen enviado!');
        } else {
          console.error('No se puedo enviar la Imagen:' + err);
          boom.badImplementation(error);
        }
      }
    );
  });
}

async function getPerfil(facebookId) {
  // obtener datos del perfil de facebook
  const url = `https://graph.facebook.com/v14.0/${facebookId}?fields=first_name,last_name,profile_pic&access_token=${config.KEY_FACEBOOK}`;
  const perfil = await axios.get(url);

  user = await prospecto.findOne({ facebookId: facebookId });
  if (!user) {
    await prospecto.create({
      facebookId: facebookId,
      nombre: perfil.data.first_name + ' ' + perfil.data.last_name,
      foto: perfil.data.profile_pic,
      fecha: new Date().toLocaleString('es-ES', {
        timeZone: 'America/La_Paz',
      }),
    });
  } else {
    // buscar en prospecto_ingreso si hay una fecha de ingreso y solo hora de hoy bolivia
    const date =
      new Date()
        .toLocaleString('es-ES', {
          timeZone: 'America/La_Paz',
        })
        .slice(0, 14) + ':00:00';
    console.log(date);
    const ingreso = await prospecto_ingreso.findOne({
      prospectoId: user._id,
      fecha: date,
    });
    if (!ingreso) {
      await prospecto_ingreso.create({
        prospectoId: user._id,
        fecha: date,
      });
    }
  }
}

module.exports = intentController;
