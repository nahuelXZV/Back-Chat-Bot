const model = require('../models/pedidoModel');
const detalle = require('../models/pedido_pizzaModel');
const boom = require('@hapi/boom');

class UserController {
  constructor() {}

  async add(data) {
    const newPedido = new model(data);
    newPedido.save();
    return newPedido;
  }

  async addDetalle(data) {
    const newDetalle = new detalle(data);
    newDetalle.save();
    return newDetalle;
  }

  async edit(data, id) {
    const model = await model.findOne({ _id: id });
    if (!model) {
      throw boom.notFound('Model not found');
    }
    const modelUpdated = await model.updateOne(
      { _id: id },
      {
        $set: {
          ...data,
        },
      }
    );
    return modelUpdated;
  }

  async delete(id) {
    await model.deleteOne({ _id: id });
    return id;
  }

  // obtener todos los pedidos de un cliente
  async getForCliente(id) {
    let listaPedido = [];
    const pedidos = await model.find({ clienteId: id }).populate('clienteId');
    if (!pedidos) {
      throw boom.notFound('Pedido not found');
    }
    // por cada pedido buscar todos los detalles y agregarlos a la lista
    for (let i = 0; i < pedidos.length; i++) {
      const pedido = pedidos[i];
      const detalles = await detalle
        .find({ pedidoId: pedido._id })
        .populate('pizzaId');
      let newPedido = {
        pedido: pedido,
        detalles: detalles,
      };
      listaPedido.push(newPedido);
    }
    return listaPedido;
  }

  // optener un pedido por id
  async find(id) {
    let pedidoDetalle = [];
    const ModelFound = await model.findOne({ _id: id }).populate('clienteId');
    if (!ModelFound) {
      throw boom.notFound('Pedido not found');
    }
    const detalles = await detalle
      .find({ pedidoId: ModelFound._id })
      .populate('pizzaId');
    let newPedido = {
      pedido: ModelFound,
      detalles: detalles,
    };
    pedidoDetalle.push(newPedido);
    return pedidoDetalle;
  }

  // obtener todos los datos del pedido (detalles, pizzas y cliente)
  async getAll() {
    let listaPedido = [];
    const pedidos = await model.find().populate('clienteId');
    // por cada pedido buscar todos los detalles y agregarlos a la lista
    for (let i = 0; i < pedidos.length; i++) {
      const pedido = pedidos[i];
      const detalles = await detalle
        .find({ pedidoId: pedido._id })
        .populate('pizzaId');
      let newPedido = {
        pedido: pedido,
        detalles: detalles,
      };
      listaPedido.push(newPedido);
    }
    return listaPedido;
  }
}

module.exports = UserController;
