import express from "express";
//import db from "../models/service-model.js";
//import { use } from "passport";
//import multer from "multer";
//const upload = multer();
const router = express.Router();
const util = require("util");
const exec = util.promisify(require("child_process").exec);

async function folderSize(path) {
  try {
    if (path != null && path !== "") {
      const { stdout, stderr } = await exec(
        `sudo du -c ${path} -h --max-depth=1`
      );
      //console.log("stdout:", stdout);

      if (stderr !== "") console.log("stderr:", stderr);
      else return stdout;
    }

    return "";
  } catch (err) {
    console.error(err);
  }
}

function getJSON(users) {
  const json = [];
  users.map((item) => {
    const user = item.split(":");
    const folders = folderSize(user[5]);
    if (user[0] !== "")
      json.push({
        username: user[0],
        homepath: user[5],
        folders,
      });
  });
  return json;
}

// GET ALL Alex USERs
router.get("/", async (req, res) => {
  try {
    //    const filter = req.params.filter;
    const filter = "/home/testuser";
    const commmand =
      filter !== "" ? `cat /etc/passwd | grep ${filter}` : "cat /etc/passwd";
    const { stdout, stderr } = await exec(commmand);

    if (stdout !== "") {
      const users = stdout.split("\n");
      const json = [];

      for (const item of users) {
        const user = item.split(":");
        const username = user[0];
        const homepath = user[5];

        if (username !== "" && homepath != null && homepath !== "") {
          const resExec = await exec(`sudo du -c ${homepath} -h --max-depth=1`);
          //console.log(res.stdout);

          json.push({
            username,
            homepath,
            folders: resExec.stdout,
          });
          if (resExec.stderr !== "") {
            res.status(500).json({ stderr: resExec.stderr });
          }
        }
      }

      //const json = await getJSON(users);
      //console.log("users:", json);
      res.status(200).json(json);
    }
    if (stderr !== "") {
      res.status(500).json({ stderr });
    }
  } catch (err) {
    res.status(500).json({ err });
    console.error(err);
  }

  //     try {
  //     console.log("alsex");
  //     const services = await db.find();
  //     res.status(200).json(services);

  //     res.status(200).json({ hello: "Hi alsex" });
  //   } catch (err) {
  //     res.status(500).json({ err });
  //   }
});

// GET  BY ID
router.get("/:id", async (req, res) => {
  const serviceId = req.params.id;
  try {
    const service = await db.findById(serviceId);
    if (!service) {
      res
        .status(404)
        .json({ err: "The service with the specified id does not exist" });
    } else {
      res.status(200).json(service[0]);
    }
  } catch (err) {
    res.status({ err: "The service information could not be retrieved" });
  }
});

// INSERT  INTO DB
router.post("/", async (req, res) => {
  const newService = req.body.data;

  try {
    await db.addRow(newService);
    res.status(201).json("ok");
  } catch (err) {
    console.log("err", err);
    res
      .status(500)
      .json({ err: "Error in adding service", message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const serviceId = req.params.id;
  const newChanges = req.body.data;

  try {
    const addChanges = await db.updateRow(serviceId, newChanges);
    console.log("\n addChanges\n", serviceId, addChanges);
    res.status(200).json(addChanges);
  } catch (err) {
    res
      .status(500)
      .json({ err: "Error in updating service", message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const serviceId = req.params.id;
  try {
    const deleting = await db.removeRow(serviceId);
    console.log("deleting \n", deleting);
    res.status(204).json(deleting);
  } catch (err) {
    res
      .status(500)
      .json({ err: "Error in deleting service", message: err.message });
  }
});

module.exports = router;
