const model = require('../models/pizzaModel');
const boom = require('@hapi/boom');

class UserController {
  constructor() {}

  async add(data) {
    const newUser = new model(data);
    newUser.save();
    return newUser;
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

  async find(id) {
    const ModelFound = await model.findOne({ _id: id });
    if (!ModelFound) {
      throw boom.notFound('User not found');
    }
    return ModelFound;
  }

  async getAll() {
    const models = await model.find();
    return models;
  }
}

module.exports = UserController;
