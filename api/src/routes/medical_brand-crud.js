import express from "express";
import db from "../models/medical_brand-model.js";
//import { use } from "passport";
// import multer from "multer";
// const upload = multer();
const router = express.Router();

// GET ALL MEDICAL_BRAND
router.get("/", async (req, res) => {
  try {
    const medical_brand = await db.find();
    res.status(200).json(medical_brand);
  } catch (err) {
    res.status(500).json({ err });
  }
});

// GET  BY ID
router.get("/:id", async (req, res) => {
  const medicalBrandId = req.params.id;
  try {
    const medical_brand = await db.findById(medicalBrandId);
    if (!medical_brand) {
      res
        .status(404)
        .json({
          err: "The medical_brand with the specified id does not exist",
        });
    } else {
      res.status(200).json(medical_brand[0]);
    }
  } catch (err) {
    res.status({ err: "The medical_brand information could not be retrieved" });
  }
});

// INSERT  INTO DB
router.post("/", async (req, res) => {
  const newMedicalBrand = req.body.data;

  try {
    await db.addRow(newMedicalBrand);
    res.status(201).json("ok");
  } catch (err) {
    console.log("err", err);
    res
      .status(500)
      .json({ err: "Error in adding medical_brand", message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const medicalBrandId = req.params.id;
  const newChanges = req.body.data;

  try {
    const addChanges = await db.updateRow(medicalBrandId, newChanges);
    console.log("\n addChanges\n", medicalBrandId, addChanges);
    res.status(200).json(addChanges);
  } catch (err) {
    res
      .status(500)
      .json({ err: "Error in updating medical_brand", message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const medicalBrandId = req.params.id;
  try {
    const deleting = await db.removeRow(medicalBrandId);
    console.log("deleting \n", deleting);
    res.status(204).json(deleting);
  } catch (err) {
    res
      .status(500)
      .json({ err: "Error in deleting medical_brand", message: err.message });
  }
});

module.exports = router;
