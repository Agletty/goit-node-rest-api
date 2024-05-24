import express from "express";
import validateBody from "../helpers/validateBody.js";
import validateObjectId from "../helpers/validateObjectId.js";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../schemas/contactsSchemas.js";
import { authenticate } from "../middlewares/authenticate.js";

const contactsRouter = express.Router();

contactsRouter.get("/", authenticate, getAllContacts);

contactsRouter.get("/:id", authenticate, validateObjectId, getOneContact);

contactsRouter.delete("/:id", authenticate, validateObjectId, deleteContact);

contactsRouter.post(
  "/",
  authenticate,
  validateBody(createContactSchema),
  createContact
);

contactsRouter.put(
  "/:id",
  authenticate,
  validateObjectId,
  validateBody(updateContactSchema),
  updateContact
);
contactsRouter.patch(
  "/:id/favorite",
  authenticate,
  validateObjectId,
  validateBody(updateFavoriteSchema),
  updateStatusContact
);

export default contactsRouter;
