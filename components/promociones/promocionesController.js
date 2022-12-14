const model = require('../models/promocionModel');
const detalle = require('../models/pizza_promoModel');
const pizza = require('../models/pizzaModel');
const prospectos = require('../models/prospectoModel');
const cliente = require('../models/clienteModel');
const boom = require('@hapi/boom');
const notificar = require('../models/cliente_notificarModel');
const axios = require('axios');
const config = require('../../config/config');

class PromocionesController {
  constructor() { }

  async add(data) {
    /* {
        "promo": [],
        "detalles": []
    } */
    const newPromo = new model(data.promo);
    newPromo.save();
    let imagen = 'https://www.lavanguardia.com/files/og_thumbnail/files/fp/uploads/2021/03/30/6063031b90a87.r_d.1083-871-0.jpeg';
    const message = "NUEVA PROMOCION!!!\r\n" + data.promo.nombre + "\r\n" + data.promo.descripcion;
    if (data.detalles.length > 0) {
      for (let i = 0; i < data.detalles.length; i++) {
        const detalle_promo = data.detalles[i];
        let newDetalle = {
          pizzaId: detalle_promo.pizzaId,
          promocionId: newPromo._id,
          createdAt: new Date(),
        }
        new detalle(newDetalle).save();
        if (i === 0) {
          const pzz = await pizza.findOne({ _id: detalle_promo.pizzaId });
          imagen = pzz.imagen;
        }
      }
    }
    // publicar promocione en facebook mediiante la api de facebook
    const url = `https://graph.facebook.com/107564425413200/photos?message=${message}&access_token=${config.TOKEN_POST}&url=${imagen}`;
    await axios.post(url);
    return newPromo;
  }

  async edit(data, id) {
    /* {
      "promo": [],
      "detalles": []
    } */
    const promocion = await model.findOne({ _id: id });
    if (!promocion) {
      throw boom.notFound('Promocion not found');
    }
    const modelUpdated = await model.updateOne(
      { _id: id },
      {
        $set: {
          ...data.promo,
        },
      }
    );
    // eliminar detalles antes de agregar los nuevos
    const pizza_promo = await detalle.find({ promocionId: id });
    if (pizza_promo.length > 0) {
      for (let i = 0; i < pizza_promo.length; i++) {
        const detalle_promo = pizza_promo[i];
        await detalle.deleteOne({ _id: detalle_promo._id });
      }
    }

    // agregar nuevos detalles
    if (data.detalles.length > 0) {
      for (let i = 0; i < data.detalles.length; i++) {
        const detalle_promo = data.detalles[i];
        let newDetalle = {
          pizzaId: detalle_promo.pizzaId,
          promocionId: promocion._id,
          createdAt: new Date(),
        }
        new detalle(newDetalle).save();
      }
    }
    return modelUpdated;
  }

  async delete(id) {
    await model.deleteOne({ _id: id });
    return id;
  }

  // optener una promo por id
  async find(id) {
    const ModelFound = await model.findOne({ _id: id });
    if (!ModelFound) {
      throw boom.notFound('Promo not found');
    }
    const detalles = await detalle
      .find({ promocionId: ModelFound._id })
      .populate('pizzaId');

    let promocion = {
      promo: ModelFound,
      detalles: detalles,
    };
    return promocion;
  }

  async notificaciones(id) {
    const ModelFound = await notificar.find({ clienteId: id }).populate('promocionId');
    if (!ModelFound) {
      throw boom.notFound('Notificaciones not found');
    }

    let notificacion = {
      notificaciones: ModelFound,
    };
    return notificacion;
  }

  async getAll() {
    let listaPedido = [];
    const promos = await model.find();
    for (let i = 0; i < promos.length; i++) {
      const promocion = promos[i];
      const detalles = await detalle
        .find({ promocionId: promocion._id })
        .populate('pizzaId');
      let newPromo = {
        promocion: promocion,
        detalles: detalles,
      };
      listaPedido.push(newPromo);
    }
    return listaPedido;
  }

  async getAllPizzas() {
    const pizzas = await pizza.find();
    return pizzas;
  }

  async notificar() {
    const ModelFound = await model.findOne().sort({ _id: -1 });
    if (!ModelFound) {
      throw boom.notFound('Promo not found');
    }
    const detalles = await detalle
      .find({ promocionId: ModelFound._id })
      .populate('pizzaId');

    // recuperar los clientes que tengan correo
    const clientes = await cliente.find({ correo: { $ne: null } });

    // crear notificacion
    for (let i = 0; i < clientes.length; i++) {
      const cliente = clientes[i];
      await notificar.create({
        clienteId: cliente._id,
        promocionId: ModelFound._id,
        fecha: new Date().toLocaleString('es-ES', {
          timeZone: 'America/La_Paz',
        }),
      });
    };
    let promocion = {
      promo: ModelFound,
      detalles: detalles,
      clientes: clientes,
    };
    return promocion;
  }
}

module.exports = PromocionesController;
