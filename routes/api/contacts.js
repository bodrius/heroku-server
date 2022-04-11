const express = require("express");
const router = express.Router();

const {
  addContact,
  listContacts,
  removeContact,
  updateContact,
  getContactById,
} = require("../../src/functions");
const { createContactSchema } = require("../schemas/createContactSchema");

router.get("/", async (req, res, next) => {
  try {
    const usersList = await listContacts();

    res.status(200).json({ data: usersList });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const user = await getContactById(req.params.contactId);

    if (user) {
      res.status(200).json({ data: user });
    } else {
      res.status(404).json({ data: "USER NOT FOUND" });
    }
  } catch (error) {
    res.status(501).json({ message: "internal server error" });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    await createContactSchema.validateAsync({
      name: name,
      email: email,
      phone: phone,
    });
    await addContact(name, email, phone);

    res.status(201).json({ data: "USER CREATED" });
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const success = await removeContact(req.params.contactId);

    if (success) {
      res.status(201).json({ data: "OK" });
    } else {
      res.status(400).json({ message: "USER NOT FOUND" });
    }
  } catch (error) {
    res.status(501).json({ message: "internal server error" });
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { name, email, phone } = req.body;

    if (contactId) {
      await updateContact(contactId, name, email, phone);
      res.status(201).json({ data: "USER UPDATED" });
    }
  } catch (error) {
    res.status(501).json({ message: "internal server error" });
  }
});

module.exports = router;
