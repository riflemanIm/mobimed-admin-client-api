import db from "../config/dbConfig.js";
import { getAllExcept } from "../helpers/helpers";
// GET ALL
const find = () => {
  const r = db
    .select(
      "specialization_name.specialization_id",
      "specialization_name.lang_code",
      "specialization_name.name",
      "specialization_name.description",
      "specialization.image"
    )
    .from("specialization_name")
    .leftJoin(
      "specialization",
      "specialization_name.specialization_id",
      "specialization.specialization_id"
    )
    .orderBy("specialization_name.name");
  return r;
};
// GET  BY ID
const findById = (id) => {
  return db
    .select(
      "specialization_name.specialization_id",
      "specialization_name.lang_code",
      "specialization_name.name",
      "specialization_name.description",
      "specialization.image"
    )
    .from("specialization_name")
    .leftJoin(
      "specialization",
      "specialization_name.specialization_id",
      "specialization.specialization_id"
    )
    .where("specialization_name.specialization_id", id);
};

// ADD
const addRow = (post) => {
  return db
    .transaction(function (trx) {
      return trx
        .insert(
          {
            code: post.name,
            image: post.image,
          },
          "specialization_id"
        )
        .into("specialization")
        .then((field) => {
          const data = getAllExcept(post, ["image"]);
          return trx("specialization_name").insert({
            ...data,
            specialization_id: field[0],
          });
        });
    })
    .catch(function (error) {
      // If we get here, that means that neither the 'Old Books' catalogues insert,
      // nor any of the books inserts will have taken place.
      console.error(error);
    });
};

// UPDATE
const updateRow = (id, post) => {
  const first = getAllExcept(post, ["image"]);
  return db("specialization_name")
    .where("specialization_id", id)
    .update(first)
    .then((ok) => {
      if (ok)
        return db("specialization")
          .where("specialization_id", id)
          .update({ image: post.image });
    });
};

// REMOVE
const removeRow = (id) => {
  return db("specialization").where("specialization_id", id).del();
};

module.exports = {
  find,
  findById,
  addRow,
  updateRow,
  removeRow,
};
