import Contact from "../models/Contact.js";

export const listContacts = (ownerId) => {
  return Contact.find({ owner: ownerId });
};

export async function getContactById(id, ownerId) {
  return Contact.findOne({ _id: id, owner: ownerId });
}

export async function removeContact(id, ownerId) {
  return Contact.findOneAndDelete({ _id: id, owner: ownerId });
}

export async function addContact(body, ownerId) {
  return Contact.create({ ...body, owner: ownerId });
}

export async function updateContact(id, body, ownerId) {
  return Contact.findOneAndUpdate({ _id: id, owner: ownerId }, body, {
    new: true,
  });
}

export async function updateStatus(id, body, ownerId) {
  return Contact.findOneAndUpdate({ _id: id, owner: ownerId }, body, {
    new: true,
  });
}
