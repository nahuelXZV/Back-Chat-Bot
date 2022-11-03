const model = require('./userModel');
const empleado = require('../models/empleadoModel');
const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');

class UserController {
  constructor() { }

  async add(data) {
    console.log(data);
    // encrypt password
    const hash = await bcrypt.hash(data.password, 10);
    // creamos la estructura del usuario
    const emplead = new empleado({
      nombre: data.nombre,
      direccion: data.direccion,
      telefono: data.telefono,
      createdAt: new Date(),
    });
    // guardamos el empleado
    const empleadoSaved = await emplead.save();
    const user = {
      email: data.email,
      password: hash,
      empleadoId: emplead._id,
      clienteId: null,
      tipo: 'empleado',
      createdAt: new Date(),
    };
    // creamos el usuario
    const newUser = new model(user);
    newUser.save();

    //sacamos el password y el recoveryToken del newUser
    const userCreated = {
      id: newUser._id,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
      tipo: newUser.tipo,
      empleadoId: empleadoSaved,
    };
    return userCreated;
  }

  async edit(data, id) {
    const hash = await bcrypt.hash(data.password, 10);

    const user = await model.findOne({ _id: id });
    if (!user) {
      throw boom.notFound('User not found');
    }
    const userUpdated = await model.updateOne(
      { _id: id },
      {
        $set: {
          ...data,
          password: hash,
        },
      }
    );
    return userUpdated;
  }

  async delete(id) {
    await model.deleteOne({ _id: id });
    return id;
  }

  async find(id) {
    const UserFound = await model.findOne(
      { _id: id },
      { password: 0, recoveryToken: 0 }
    );
    if (!UserFound) {
      throw boom.notFound('User not found');
    }
    return UserFound;
  }

  async findByEmail(email) {
    const rta = await model.findOne({ email });
    return rta;
  }

  async findByEmailAuth(email) {
    const rta = await model.findOne({ email: email });
    return rta;
  }

  async getAll() {
    const users = await model.find({}, { password: 0, recoveryToken: 0 });
    return users;
  }
}

module.exports = UserController;
