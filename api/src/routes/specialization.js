import express from "express";
import db from "../models/specialization-model.js";
//import { use } from "passport";
// import multer from "multer";
// const upload = multer();
const router = express.Router();

// GET ALL SPECIALIZATION
router.get("/", async (req, res) => {
  try {
    const specialization = await db.find();
    res.status(200).json(specialization);
  } catch (err) {
    res.status(500).json({ err });
  }
});

// GET  BY ID
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const specialization = await db.findById(id);
    if (!specialization) {
      res.status(404).json({
        err: "The specialization with the specified id does not exist",
      });
    } else {
      res.status(200).json(specialization[0]);
    }
  } catch (err) {
    res.status({
      err: "The specialization information could not be retrieved",
    });
  }
});

// INSERT  INTO DB
router.post("/", async (req, res) => {
  const data = req.body.data;

  try {
    await db.addRow(data);
    res.status(201).json("ok");
  } catch (err) {
    console.log("err", err);
    res
      .status(500)
      .json({ err: "Error in adding specialization", message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const newChanges = req.body.data;

  try {
    const addChanges = await db.updateRow(id, newChanges);

    res.status(200).json(addChanges);
  } catch (err) {
    res
      .status(500)
      .json({ err: "Error in updating specialization", message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const deleting = await db.removeRow(id);
    console.log("deleting \n", deleting);
    res.status(204).json(deleting);
  } catch (err) {
    res
      .status(500)
      .json({ err: "Error in deleting specialization", message: err.message });
  }
});

module.exports = router;
