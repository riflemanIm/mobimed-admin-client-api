import merge from "lodash.merge";
import localJson from "./translations/ru.json";
import requestPromise from "request-promise";
import request from "request";
import fs from "fs";

const LANG = "ru";
const PROJECT_NAME = "test";
const url = `http://localhost:8000/api/translations/download/${LANG}/${PROJECT_NAME}`;
const urlUpload = "http://localhost:8000/api/translations/import-file";
const distFile = `${__dirname}/translations/${LANG}.json`;

/**  GET REMOTE JSON  */
requestPromise({
  url,
  method: "GET",
  json: true,
})
  .then((remoteJson) => {
    /**  MERGE LOCAL AND REMOTE  */
    const mergedJson = merge(remoteJson, localJson);

    /**  SAVE mergedJson TO LOCAL  */
    return new Promise(function (resolve, reject) {
      fs.writeFile(distFile, JSON.stringify(mergedJson, null, 2), (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  })
  .then((saved) => {
    if (saved) {
      setTimeout(() => {
        /** UPLOAD */
        const req = request.put(urlUpload, function (err, resp, body) {
          if (err) {
            console.error("Error!", err.message);
          } else {
            console.log("Result: " + body);
          }
        });
        const form = req.form();
        form.append("filedata", fs.createReadStream(distFile));
        form.append("filename", `${LANG}.json`);
        form.append("account_id", "1");
        form.append("pname", "test");
        form.append("deleteOldKeys", "false");
        form.append("doBackup", "true");
      }, 2000);
    }
  })
  .catch((err) => console.error(err.message));
