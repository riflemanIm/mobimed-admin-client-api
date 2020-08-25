import express from "express";
import db from "../models/clinic-model.js";
import { use } from "passport";
import multer from "multer";
const upload = multer();
const router = express.Router();

// GET ALL CLINICS
router.get("/", async (req, res) => {
  try {
    const clinics = await db.find();
    console.log("GET ALL CLINICS\n\n", clinics);
    res.status(200).json(clinics);
  } catch (err) {
    res.status(500).json({ err });
  }
});

// GET CLINIC BY ID
router.get("/:id", async (req, res) => {
  const clinicId = req.params.id;
  try {
    const clinic = await db.findById(clinicId);
    if (!clinic) {
      res
        .status(404)
        .json({ err: "The clinic with the specified id does not exist" });
    } else {
      res.status(200).json(clinic);
    }
  } catch (err) {
    res.status({ err: "The clinic information could not be retrieved" });
  }
});

// INSERT CLINIC INTO DB
router.post("/", async (req, res) => {
  const d = req.body.data;
  try {
    await db.addRow(d);
    res.status(201).json("ok");
  } catch (err) {
    console.log("err", err);
    res
      .status(500)
      .json({ err: "Error in adding Clinic", message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const clinic = await db.findById(id);
    if (!clinic) {
      res
        .status(404)
        .json({ err: "The clinic with the specified id does not exist" });
    } else {
      res.status(200).json(clinic);
    }
  } catch (err) {
    res.status({ err: "The clinic information could not be retrieved" });
  }
});

router.delete("/:id", async (req, res) => {
  const clinicId = req.params.id;
  try {
    const deleting = await db.removeRow(clinicId);
    console.log("deleting \n", deleting);
    res.status(204).json(deleting);
  } catch (err) {
    res.status(500).json({ err: "Error in deleting clinic" });
  }
});

module.exports = router;
