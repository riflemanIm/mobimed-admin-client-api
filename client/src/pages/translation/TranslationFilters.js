import React from "react";
import Box from "@material-ui/core/Box";
import DownloadIcon from "@material-ui/icons/GetApp";
import RestoreIcon from "@material-ui/icons/Restore";
import LabelImportantIcon from "@material-ui/icons/LabelImportant";

import { Link, Button } from "../../components/Wrappers/Wrappers";
import config from "../../config";

const TranslationAdminActions = ({ pname }) => {
  const langs = ["ru", "en", "fr"];
  return (
    <>
      <Link href="#/app/translation/import" underline="none" color="#fff">
        <Button variant={"contained"} color={"success"}>
          <Box mr={1} display={"flex"}>
            <LabelImportantIcon />
          </Box>
          Import
        </Button>
      </Link>

      <Link href="#/app/translation/backups" underline="none" color="#fff">
        <Button
          variant={"contained"}
          color={"success"}
          style={{ marginLeft: 16 }}
        >
          <Box mr={1} display={"flex"}>
            <RestoreIcon />
          </Box>
          Restore
        </Button>
      </Link>
      {langs.map((lang) => (
        <Link
          href={`${config.baseURLApi}/translations/download/ru/${pname}`}
          underline="none"
          color="#fff"
          key={lang}
        >
          <Button
            variant={"outlined"}
            color={"secondary"}
            style={{ marginLeft: 16 }}
          >
            <Box display={"flex"} mr={1}>
              <DownloadIcon />
            </Box>
            {lang}
          </Button>
        </Link>
      ))}
    </>
  );
};
export default TranslationAdminActions;
