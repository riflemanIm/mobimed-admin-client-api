import { merge } from "lodash";
import localJson from "./translations/ru.json";
const axios = require("axios");
const request = require("request");
const LANG = "ru";
const PROJECT_NAME = "test";
const url = `http://localhost:8000/api/translations/download/${LANG}/${PROJECT_NAME}`;

const fs = require("fs");
const FormData = require("form-data");

/**  GET REMOTE JSON  */
request(
  {
    url,
    method: "GET",
    headers: {
      Accept: "application/json",
      "Accept-Charset": "utf-8",
      "User-Agent": "my-node-script",
    },
  },
  (err, res, body) => {
    const remoteJson = JSON.parse(body);
    const mergedJson = merge(remoteJson, localJson);
    // console.log(
    //   " \n\n\n---\n\n\n ",
    //   JSON.stringify(mergedJson, null, 2)
    // );

    fs.writeFile(
      `${__dirname}/translations/ru.json`,
      JSON.stringify(mergedJson, null, 2),
      (err) => {
        if (err) throw err;
        console.log("Data written to file");

        const form = new FormData();

        form.append(
          "filedata",
          fs.createReadStream(`${__dirname}/translations/ru.json`)
        );
        form.append("filename", `${LANG}.json`);
        form.append("account_id", 1);
        form.append("pname", "test");
        form.append("deleteOldKeys", false);
        form.append("doBackup", true);

        const formHeaders = form.getHeaders();

        axios
          .put("http://localhost:8000/api/translations/import-file", form, {
            headers: {
              ...formHeaders,
            },
          })
          .then((response) => response)
          .catch((error) => error);
      }
    );
  }
);
