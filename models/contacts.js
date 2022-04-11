const fs = require("fs").promises;
const path = require("path");
const shortid = require("shortid");

const contactsPath = path.resolve("models", "contacts.json");

async function listContacts() {
  try {
    const contacts = await fs.readFile(contactsPath, "utf8");

    return JSON.parse(contacts);
  } catch (error) {
    console.log("ERROR listContacts->", error);
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await listContacts();

    const findContact = contacts.find(
      (element) => element.id === contactId.toString()
    );

    return findContact;
  } catch (error) {
    console.log("ERROR getContactById->", error);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await listContacts();

    const removeContact = contacts.find(
      (element) => element.id === contactId.toString()
    );

    if (removeContact) {
      const newContactList = contacts.filter(
        (element) => element.id !== contactId.toString()
      );
      await fs.writeFile(contactsPath, JSON.stringify(newContactList));

      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("ERROR removeContact->", error);
  }
}

async function addContact(name, email, phone) {
  const newContact = {
    id: shortid.generate(),
    name,
    email,
    phone,
  };
  try {
    const list = await listContacts();

    list.push(newContact);

    await fs.writeFile(contactsPath, JSON.stringify(list));

    console.log("CONTACT SUCCESSFULLY ADDED!");
  } catch (error) {
    console.log("ERROR addContact->", error);
  }
}

async function updateContact(id, name, email, phone) {
  try {
    const list = await listContacts();

    const updateContact = list.map((element) => {
      if (element.id === id.toString()) {
        return {
          ...element,
          name: name || element.name,
          email: email || element.email,
          phone: phone || element.phone,
        };
      } else {
        return element;
      }
    });

    await fs.writeFile(contactsPath, JSON.stringify(updateContact));

    console.log("CONTACT SUCCESSFULLY UPDATED!");
  } catch (error) {
    console.log("ERROR addContact->", error);
  }
}

module.exports = {
  addContact,
  removeContact,
  listContacts,
  getContactById,
  updateContact,
};
