import { merge } from "lodash";
import localJson from "./translations/ru.json";
const LANG = "ru";
const PROJECT_NAME = "test";
const url = `http://localhost:8000/api/translations/download/${LANG}/${PROJECT_NAME}`;
const urlUpload = "http://localhost:8000/api/translations/import-file";

const requestPromise = require("request-promise");
const request = require("request");

const fs = require("fs");

/**  GET REMOTE JSON  */
requestPromise({
  url,
  method: "GET",
  json: true,
})
  .then((remoteJson) => {
    /**  MERGE LOCAL AND REMOTE  */
    const mergedJson = merge(remoteJson, localJson);

    /**  SAVE TO LOCAL  */

    return new Promise(function (resolve, reject) {
      fs.writeFile(
        `${__dirname}/translations/ru.json`,
        JSON.stringify(mergedJson, null, 2),
        (err) => {
          if (err) reject(err);
          else resolve(true);
        }
      );
    });
  })
  .then((saved) => {
    if (saved) {
      setTimeout(() => {
        const req = request.put(urlUpload, function (err, resp, body) {
          if (err) {
            console.error("Error!", err.message);
          } else {
            console.log("Result: " + body);
          }
        });
        const form = req.form();
        form.append(
          "filedata",
          fs.createReadStream(`${__dirname}/translations/ru.json`)
        );
        form.append("filename", `${LANG}.json`);
        form.append("account_id", "1");
        form.append("pname", "test");
        form.append("deleteOldKeys", "false");
        form.append("doBackup", "true");
      }, 2000);
    }
  })
  .catch((err) => console.error(err.message));
