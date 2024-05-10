import * as fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const contactsPath = path.resolve("db", "contacts.json");

async function listContacts() {
  const dataContacts = await fs.readFile(contactsPath, { encoding: "utf-8" });
  return JSON.parse(dataContacts);
}

async function getContactById(contactId) {
  const dataContacts = await listContacts();
  const result = dataContacts.find((contact) => contact.id === contactId);
  return result || null;
}

async function removeContact(contactId) {
  const dataContacts = await listContacts();
  const index = dataContacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  const [result] = dataContacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(dataContacts, null, 2));
  return result;
}

async function addContact(name, email, phone) {
  const dataContacts = await listContacts();
  const newContact = {
    id: crypto.randomUUID(),
    name,
    email,
    phone,
  };
  dataContacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(dataContacts, null, 2));
  return newContact;
}

async function updateContact(contactId, body) {
  const dataContacts = await listContacts();
  const index = dataContacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  dataContacts[index] = {
    ...dataContacts[index],
    ...body,
  };
  await fs.writeFile(contactsPath, JSON.stringify(dataContacts, null, 2));
  return dataContacts[index];
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
