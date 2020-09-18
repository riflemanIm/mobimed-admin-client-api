import { merge } from "lodash";
import localJson from "./translations/ru.json";
const LANG = "ru";
const PROJECT_NAME = "test";
const url = `http://localhost:8000/api/translations/download/${LANG}/${PROJECT_NAME}`;
const urlUpload = "http://localhost:8000/api/translations/import-file";

const request = require("request-promise");

const fs = require("fs");

/**  GET REMOTE JSON  */
request({
  url,
  method: "GET",
  headers: {
    Accept: "application/json",
  },
})
  .then((remoteJson) => {
    // const mergedJson = merge(JSON.parse(remoteJson), localJson);
    console.log(" \n\n\n---\n\n\n ", remoteJson);
    return;
    // return new Promise(function (resolve, reject) {
    //   fs.writeFile(
    //     `${__dirname}/translations/ru.json`,
    //     JSON.stringify(mergedJson, null, 2),
    //     (err) => {
    //       if (err) reject(err);
    //       else resolve("saved");
    //     }
    //   );
    // });
  })
  .then((res) => {
    if (res === "saved") {
      console.log("sssssss");
      // setTimeout(() => {
      //   const req = request.put(urlUpload).then((res) => console.log(res));
      //   const form = req.form();
      //   form.append(
      //     "filedata",
      //     fs.createReadStream(`${__dirname}/translations/ru.json`)
      //   );
      //   form.append("filename", `${LANG}.json`);
      //   form.append("account_id", "1");
      //   form.append("pname", "test");
      //   form.append("deleteOldKeys", "false");
      //   form.append("doBackup", "true");
      // }, 3000);
    }
  });
