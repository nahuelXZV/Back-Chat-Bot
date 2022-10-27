const model = require('./userModel');
const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');

class UserController {
  constructor() {}

  async add(data) {    
    const userexist = await this.findByEmailAuth(data.email);    
    if (!userexist) {      
      if(data.password.length < 8){
        return {error: "password"};
      }
      // encrypt password    
      const hash = await bcrypt.hash(data.password, 10);
      // creamos la estructura del usuario
      const user = {
        email: data.email,
        password: hash,      
      };
      // creamos el usuario
      const newUser = new model(user);
      newUser.save();    
      //sacamos el password y el recoveryToken del newUser
      const userCreated = {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt //,
        //tipo: newUser.tipo,
      };    
      return userCreated;
    } else {      
      return {error: "email"};
    }
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
    const rta = await model.findOne({ email });
    return rta;
  }

  async getAll() {
    const users = await model.find({}, { password: 0, recoveryToken: 0 });
    return users;
  }
}

module.exports = UserController;
