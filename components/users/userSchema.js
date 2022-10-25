const validator = require('joi');

// List of atributes for user model
const id = validator.string();
const email = validator.string().email();
const password = validator.string().min(7);
const role = validator.string().min(5);
const empleadoId = validator.string();
const clienteId = validator.string();
const tipo = validator.string().min(5);

const addUserSchema = validator.object({
  email: email.required(),
  password: password.required(),
  role: role.required(),
  tipo: tipo.required(),
});

const editUserSchema = validator.object({
  email: email,
  password: password,
  role: role,
  tipo: tipo,
});

const getUserSchema = validator.object({
  id: id.required(),
});

module.exports = {
  addUserSchema,
  editUserSchema,
  getUserSchema,
};
