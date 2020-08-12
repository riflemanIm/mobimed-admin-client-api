import en from "./translations/en.js";
import db from "./config/dbConfig.js";

const tryInsert = async (d) => {
  try {
    const res = await db("translations").insert(d);
    console.log("\n res:", res);
  } catch (e) {
    console.error("\n\n err", e);
  }
};

for (const [gkey, obj] of Object.entries(en.translations)) {
  //  console.log(`${gkey}: `);
  //console.log(Object.entries(value));
  for (const [tkey, lang_en] of Object.entries(obj)) {
    //console.log(`${gkey}:  ${tkey}:${tvalue}`);
    //console.log("\n");
    const dbDate = {
      account_id: 1,
      pname: "mobimed_site",
      gkey,
      tkey,
      lang_en,
    };
    tryInsert(dbDate);
  }
}
