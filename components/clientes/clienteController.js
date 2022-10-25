const boom = require('@hapi/boom');
const model = require('../models/clienteModel');
const pedido = require('../models/pedidoModel');
const prospectoIngreso = require('../models/prospecto_ingresoModel');
const pedidoPizza = require('../models/pedido_pizzaModel');

class UserController {
  constructor() {}

  async add(data) {
    const newPedido = new model(data);
    newPedido.save();
    return newPedido;
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

  // optener un cliente por id
  async find(id) {
    const ModelFound = await model.findOne({ _id: id });
    if (!ModelFound) {
      throw boom.notFound('Cliente not found');
    }
    const ingresos = await prospectoIngreso.find({
      prospectoId: ModelFound.prospectoId,
    });
    let ultimoIngreso = ingresos[ingresos.length - 1];
    let newCliente = {
      prospecto: ModelFound,
      ingresos: ingresos.length,
      ultimoIngreso: ultimoIngreso,
    };
    return newCliente;
  }

  // obtener todos los datos de los prospectos
  async getAll() {
    let listaClientes = [];
    const clientes = await model.find().populate('prospectoId').limit(10);
    for (let i = 0; i < clientes.length; i++) {
      const person = clientes[i];
      const pedidos = await pedido.find({
        clienteId: person._id,
      });
      let ultimoPedido = pedidos[pedidos.length - 1];

      const ingresos = await prospectoIngreso.find({
        prospectoId: person.prospectoId,
      });
      let ultimoIngreso = ingresos[ingresos.length - 1];

      let newCliente = {
        cliente: person,
        ultimoPedido: ultimoPedido,
        pedidos: pedidos.length,
        ultimoIngreso: ultimoIngreso,
        ingresos: ingresos.length,
      };
      listaClientes.push(newCliente);
    }
    return listaClientes;
  }

  async getClientesFrecuentes() {
    let listaClientes = [];
    const clientes = await model
      .find({ tipo: 'frecuente' })
      .populate('prospectoId');
    for (let i = 0; i < clientes.length; i++) {
      const person = clientes[i];
      const pedidos = await pedido.find({
        clienteId: person._id,
      });
      let montoCompra = 0;
      let diasAcumulados = 0;
      for (let j = 0; j < pedidos.length; j++) {
        const element = pedidos[j];
        montoCompra += element.montoTotal;
        if (j < pedidos.length - 1) {
          // obtener los dias entre dos fechas
          let fecha1 = new Date(element.fecha);
          let fecha2 = new Date(pedidos[j + 1].fecha);
          // obtenemos los milisegundos de cada fecha
          let diff = Math.abs(fecha1.getTime() - fecha2.getTime());
          // obtenemos los dias
          let dias = Math.ceil(diff / (1000 * 3600 * 24));
          diasAcumulados += dias;
        }
      }
      const promedioCompra = montoCompra / pedidos.length;
      console.log('promedioCompra', promedioCompra);
      const promedioDias = diasAcumulados / pedidos.length;
      console.log('promedioDias', diasAcumulados);

      let newCliente = {
        cliente: person,
        pedidos: pedidos.length,
        promedioCompra: promedioCompra,
        frecuencia: promedioDias,
        notificaciones: 0,
      };
      listaClientes.push(newCliente);
    }
    return listaClientes;
  }
}

module.exports = UserController;
