import HttpError from "../helpers/HttpError.js";

import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

export const checkUpdateUserData = (req, res, next) => {
  const { error } = updateContactSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }

  if (Object.keys(req.body).length === 0) {
    throw HttpError(400, "Body must have at least one field");
  }
  next();
};

export const checkCreateUser = (req, res, next) => {
  const { error } = createContactSchema.validate(req.body);
  if (error) throw HttpError(400, error.message);

  if (Object.keys(req.body).length === 0) {
    throw HttpError(400, "Body must have at least one field");
  }
  next();
};
