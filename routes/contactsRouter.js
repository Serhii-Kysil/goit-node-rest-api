import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";
import isValidId from "../middlewares/isValidId.js";
import {
  checkCreateUser,
  checkUpdateUserData,
} from "../middlewares/checkUserData.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", isValidId, getOneContact);

contactsRouter.delete("/:id", isValidId, deleteContact);

contactsRouter.post("/", checkCreateUser, createContact);

contactsRouter.put("/:id", isValidId, checkUpdateUserData, updateContact);

contactsRouter.patch("/:id/favorite", isValidId, updateStatusContact);

export default contactsRouter;
