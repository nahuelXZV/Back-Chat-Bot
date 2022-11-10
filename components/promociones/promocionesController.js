const model = require('../models/promocionModel');
const detalle = require('../models/pizza_promoModel');
const pizza = require('../models/pizzaModel');
const prospectos = require('../models/prospectoModel');
const cliente = require('../models/clienteModel');
const boom = require('@hapi/boom');

class PromocionesController {
  constructor() { }

  async add(data) {
    /* {
        "promo": [],
        "detalles": []
    } */
    const newPromo = new model(data.promo);
    newPromo.save();
    if (data.detalles.length > 0) {
      for (let i = 0; i < data.detalles.length; i++) {
        const detalle_promo = data.detalles[i];
        let newDetalle = {
          pizzaId: detalle_promo.pizzaId,
          promocionId: newPromo._id,
          createdAt: new Date(),
        }
        new detalle(newDetalle).save();
      }
    }
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

  async notificar(id) {
    const ModelFound = await model.findOne({ _id: id });
    if (!ModelFound) {
      throw boom.notFound('Promo not found');
    }
    const detalles = await detalle
      .find({ promocionId: ModelFound._id })
      .populate('pizzaId');

    // recuperar los clientes que tengan correo
    const clientes = await cliente.find({ correo: { $ne: null } });
    let promocion = {
      promo: ModelFound,
      detalles: detalles,
      clientes: clientes,
    };
    return promocion;
  }
}

module.exports = PromocionesController;
