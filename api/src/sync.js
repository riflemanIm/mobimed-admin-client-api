import { /*transform, isEqual, isObject,*/ merge } from "lodash";
import localJson from "./translations/ru.json";

const request = require("request");
const LANG = "ru";
const PROJECT_NAME = "test";
const url = `http://localhost:8000/api/translations/download/${LANG}/${PROJECT_NAME}`;

// console.log(url);
const options = {
  url,
  method: "GET",
  headers: {
    Accept: "application/json",
    "Accept-Charset": "utf-8",
    "User-Agent": "my-node-script",
  },
};

/**  GET REMOTE JSON  */
request(options, function (err, res, body) {
  const remoteJson = JSON.parse(body);
  const mergedJson = merge(remoteJson, localJson);
  console.log(
    " \n\n\n---\n\n\n ",
    // JSON.stringify(difference(remoteJson, localJson), null, 2)
    JSON.stringify(mergedJson, null, 2)
  );
});

/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 
function difference(object, base) {
  return transform(object, (result, value, key) => {
    if (!isEqual(value, base[key])) {
      result[key] =
        isObject(value) && isObject(base[key])
          ? difference(value, base[key])
          : value;
    }
  });
}
*/
