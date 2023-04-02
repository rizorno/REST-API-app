// const contacts = require("../models/contacts");

const { ctrlWrapper } = require("../utils");

const { Contact } = require("../models/contact");

const { HttpError } = require("../helpers");

const getAll = async (req, res) => {
  const result = await Contact.find();
  res.json(result);
};

// const getById = async (req, res) => {
//   const { id } = req.params;
//   const result = await contacts.getContactById(id);
//   if (!result) {
//     throw HttpError(404);
//   }
//   res.json(result);
// };

const add = async (req, res) => {
  const result = await Contact.create(req.body);
  res.status(201).json(result);
};

// const deleteById = async (req, res) => {
//   const { id } = req.params;
//   const result = await contacts.removeContact(id);
//   if (!result) {
//     throw HttpError(404);
//   }
//   res.json({ message: "Contact deleted" });
// };

// const updateById = async (req, res) => {
//   const { id } = req.params;
//   const result = await contacts.updateContact(id, req.body);
//   if (!result) {
//     throw HttpError(404);
//   }
//   res.json(result);
// };

// const upgrateById = async (req, res) => {
//   const { id } = req.params;
//   const result = await contacts.upgrateContact(id, req.body);
//   if (!result) {
//     throw HttpError(404);
//   }
//   res.json(result);
// };

module.exports = {
  getAll: ctrlWrapper(getAll),
  //   getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  //   deleteById: ctrlWrapper(deleteById),
  //   updateById: ctrlWrapper(updateById),
  //   upgrateById: ctrlWrapper(upgrateById),
};
