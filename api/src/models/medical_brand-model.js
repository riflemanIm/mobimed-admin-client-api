import db from "../config/dbConfig.js";

// GET ALL
const find = () => {
  const r = db("medical_brand").orderBy("title");
  return r;
};
// GET  BY ID
const findById = (id) => {
  return db
    .select("code", "title", "logo", "email", "phone")
    .from("medical_brand")
    .where("medical_brand_id", id);
};

// ADD
const addRow = (row) => {
  return db("medical_brand").insert(row);
};

// UPDATE
const updateRow = (id, post) => {
  return db("medical_brand").where("medical_brand_id", id).update(post);
};

// REMOVE
const removeRow = (id) => {
  return db("medical_brand").where("medical_brand_id", id).del();
};

module.exports = {
  find,
  findById,
  addRow,
  updateRow,
  removeRow,
};
