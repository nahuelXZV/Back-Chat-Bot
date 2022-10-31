const boom = require('@hapi/boom');
const model = require('../models/prospectoModel');
const cliente = require('../models/clienteModel');
const prospectoIngreso = require('../models/prospecto_ingresoModel');
const contacto = require('../models/contactoModel');

class UserController {
  constructor() { }

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

  // obtener el prospecto por el cliente
  async getForCliente(id) {
    const person = await cliente.findOne({ _id: id });
    if (!person) {
      throw boom.notFound('Cliente not found');
    }
    const prospecto = await model.find({ _id: person.prospectoId });
    const ingresos = await prospectoIngreso.find({
      prospectoId: prospecto._id,
    });
    let ultimoIngreso = ingresos[ingresos.length - 1];
    let newProspecto = {
      cliente: person,
      prospecto: prospecto,
      ingresos: ingresos.length,
      ultimoIngreso: ultimoIngreso,
    };
    return newProspecto;
  }

  // optener un prospecto por id
  async find(id) {
    const ModelFound = await model.findOne({ _id: id });
    if (!ModelFound) {
      throw boom.notFound('Prospecto not found');
    }
    const ingresos = await prospectoIngreso.find({
      prospectoId: ModelFound._id,
    });
    let ultimoIngreso = ingresos[ingresos.length - 1];
    let newProspecto = {
      prospecto: ModelFound,
      ingresos: ingresos.length,
      ultimoIngreso: ultimoIngreso,
    };
    return newProspecto;
  }

  // obtener todos los datos de los prospectos
  async getAll() {
    let listaProspectos = [];
    const prospectos = await model.find({ tipo: 'prospecto' }).limit(10);
    for (let i = 0; i < prospectos.length; i++) {
      const prospecto = prospectos[i];
      const ingresos = await prospectoIngreso.find({
        prospectoId: prospecto._id,
      });
      let ultimoIngreso = ingresos[ingresos.length - 1];
      // obtener el tiempo entre el ultimo ingreso y la fecha actual
      const contactos = await contacto.find({ prospectoId: prospecto._id });
      let ultimoContacto = contactos[contactos.length - 1];
      let newProspecto = {
        prospecto: prospecto,
        ultimoIngreso: ultimoIngreso,
        ingresos: ingresos.length,
        ultimoContacto: ultimoContacto,
        contactos: contactos.length,
      };
      listaProspectos.push(newProspecto);
    }
    return listaProspectos;
  }

  // guardar contacto con el prospecto
  async addContacto(data) {
    const newContacto = new contacto(data);
    newContacto.save();
    return newContacto;
  }

  // obtener los contactos de un prospecto
  async getContactos(id) {
    const prospecto = await model.findOne({ _id: id });
    if (!prospecto) {
      throw boom.notFound('Prospecto not found');
    }
    const contactos = await contacto.find({ prospectoId: prospecto._id }).populate('prospectoId');
    return { contactos, prospecto };
  }
}

module.exports = UserController;
