import React from "react";
import {
  Grid,
  Box,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField as Input,
} from "@material-ui/core";

import Widget from "../../components/Widget/Widget";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

import DownloadIcon from "@material-ui/icons/GetApp";
import DeleteIcon from "@material-ui/icons/DeleteOutlined";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import RestoreIcon from "@material-ui/icons/Restore";

import Notification from "../../components/Notification/Notification";

import { toast } from "react-toastify";
import config from "../../config";
import { Typography, Link, Button } from "../../components/Wrappers/Wrappers";
import {
  useTranslationDispatch,
  useTranslationState,
} from "../../context/TranslationContext";
import { useUserState } from "../../context/UserContext";

import useStyles from "./styles";
// Icons
import {
  LabelImportant as LabelImportantIcon,
  Search as SearchIcon,
  CreateOutlined as CreateIcon,
} from "@material-ui/icons";

import { actions } from "../../context/TranslationContext";
import moment from "moment/moment";
import isEmpty from "../../helpers/isEmpty";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "num",
    status: ["admin"],
    align: "left",
    disablePadding: false,
    label: "ID",
  },

  { id: "actions", align: "left", disablePadding: false, label: "Actions" },
  //{ id: "id", align: "left", disablePadding: true, label: "ID" },
  //{ id: "pname", align: "left", disablePadding: false, label: "Project" },
  {
    id: "gkey",
    status: ["admin"],
    align: "left",
    disablePadding: false,
    label: "Group",
  },
  {
    id: "tkey",
    status: ["admin"],
    align: "left",
    disablePadding: false,
    label: "Key",
  },
  { id: "lang_ru", align: "left", disablePadding: false, label: "Russian" },
  { id: "lang_en", align: "left", disablePadding: false, label: "English" },
  { id: "lang_fr", align: "left", disablePadding: false, label: "Franch" },
  { id: "created_at", align: "left", disablePadding: false, label: "Created" },
  { id: "updated_at", align: "left", disablePadding: false, label: "Changed" },
  { id: "email", align: "left", disablePadding: false, label: "By" },
];

function EnhancedTableHead(props) {
  const {
    currentUser: { status },
  } = useUserState();

  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {status === "interpreter" && (
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{ "aria-label": "select all desserts" }}
            />
          </TableCell>
        )}
        {headCells
          .filter(
            (item) =>
              item?.status == null ||
              (item?.status != null && item?.status.includes(status))
          )
          .map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.align}
              padding={headCell.disablePadding ? "none" : "default"}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                <Typography noWrap weight={"medium"} variant={"body2"}>
                  {headCell.label}
                </Typography>
              </TableSortLabel>
            </TableCell>
          ))}
      </TableRow>
    </TableHead>
  );
}

const TranslationList = () => {
  const {
    currentUser: { status, account_id },
  } = useUserState();

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("pname");
  const [page, setPage] = React.useState(0);
  const translationRowsPerPage = localStorage.getItem("translationRowsPerPage");

  const [rowsPerPage, setRowsPerPage] = React.useState(
    translationRowsPerPage != null ? parseInt(translationRowsPerPage, 10) : 5
  );
  const [translationsRows, setTranslationsRows] = React.useState([]);

  const translationDispatch = useTranslationDispatch();
  const {
    rows,
    idToDelete,
    modalOpenConfirm,
    selected,
    modalOpenCheched,
    checked,
    filterVals,
  } = useTranslationState();

  //const pNames = [...new Set(rows.map((item) => item.pname))];
  const pNames = config.pNames;
  const gKeys = [
    ...new Set(
      rows
        .filter(
          (item) => item.pname === filterVals.pname || filterVals.pname === ""
        )
        .map((item) => item.gkey)
    ),
  ].sort();

  const openModalConfirm = (cell) => {
    actions.doOpenConfirm(cell)(translationDispatch);
  };

  const closeModalConfirm = () => {
    actions.doCloseConfirm()(translationDispatch);
  };

  const closeModalCheched = () => {
    translationDispatch({
      type: "TRANSLATIONS_CHECKED_CLOSE",
    });
  };

  const openModalCheched = () => {
    translationDispatch({
      type: "TRANSLATIONS_CHECKED_OPEN",
    });
  };

  const handleDelete = () => {
    actions.doDelete(idToDelete)(translationDispatch);
    sendNotification("Translation deleted");
  };
  function fetchAll() {
    actions.doFetch({}, false)(translationDispatch);
  }

  React.useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const classes = useStyles();

  function sendNotification(text, isWarning = false) {
    const componentProps = {
      type: "feedback",
      message: text,
      variant: "contained",
      color: isWarning ? "warning" : "success",
    };
    const options = {
      type: isWarning ? "warning" : "info",
      position: toast.POSITION.TOP_RIGHT,
      progressClassName: classes.progress,
      className: classes.notification,
      timeOut: 1000,
    };
    return toast(
      <Notification
        {...componentProps}
        className={classes.notificationComponent}
      />,
      options
    );
  }

  React.useEffect(() => {
    //setTranslationsRows(rows);
    if (!isEmpty(rows)) doFilter(filterVals);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = translationsRows.map((n) => n.id);
      translationDispatch({
        type: "TRANSLATIONS_SET_SELECTED",
        payload: newSelected,
      });
      return;
    }

    translationDispatch({
      type: "TRANSLATIONS_SET_SELECTED",
      payload: [],
    });
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    translationDispatch({
      type: "TRANSLATIONS_SET_SELECTED",
      payload: newSelected,
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const rowsPerPage = parseInt(event.target.value, 10);
    localStorage.setItem("translationRowsPerPage", rowsPerPage);

    setRowsPerPage(parseInt(rowsPerPage, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, translationsRows.length - page * rowsPerPage);

  const handleChangeFilter = (e, curKey = null) => {
    const newFilterVals = { ...filterVals };

    if (curKey != null) {
      newFilterVals[curKey] = e.target.value;
    } else {
      newFilterVals.lang_value = e.target.value;
    }

    translationDispatch({
      type: "TRANSLATIONS_SET_FILTERS",
      payload: { ...newFilterVals },
    });

    doFilter(newFilterVals);
    setPage(0);
  };

  const doFilter = (params) => {
    let newArr = [...rows];
    Object.keys(params)
      .filter((item) => item === "pname" || item === "gkey")
      .forEach((fkey) => {
        if (params[fkey] !== "") {
          newArr = newArr.filter((c) => c[fkey] === params[fkey]);
        }
      });

    if (params.checked === "checked_all") {
      newArr = newArr.filter(
        (row) => row.checked_en && row.checked_ru && row.checked_fr
      );
    }
    if (params.checked === "not_checked_all") {
      newArr = newArr.filter(
        (row) => !row.checked_en || !row.checked_ru || !row.checked_fr
      );
    }
    if (["ru", "en", "fr"].includes(params.checked)) {
      const lang = params.checked;
      newArr = newArr.filter((row) => !row[`checked_${lang}`]);
    }

    if (params.lang_value !== "")
      newArr = newArr.filter((c) => {
        return `${c.tkey}${c.lang_ru}${c.lang_en}${c.lang_fr}`
          .toLowerCase()
          .includes(params.lang_value.toLowerCase());
      });

    //    console.log("params", params, "newArr", newArr);
    setTranslationsRows(newArr);
  };

  const needCheck = (row, lang) => {
    const {
      lang_ru,
      lang_en,
      lang_fr,
      checked_ru,
      checked_en,
      checked_fr,
    } = row;
    let val = "";
    let checked = null;
    if (lang === "ru") {
      val = lang_ru;
      checked = checked_ru;
    }
    if (lang === "en") {
      val = lang_en;
      checked = checked_en;
    }
    if (lang === "fr") {
      val = lang_fr;
      checked = checked_fr;
    }

    return (
      <Typography variant="body2" color={!checked ? "info" : ""} block={true}>
        {val}
      </Typography>
    );
  };

  const handleChecked = (lang) => {
    const newChecked = {};

    newChecked[`checked_${lang}`] = !checked[`checked_${lang}`];
    translationDispatch({
      type: "TRANSLATIONS_SELECTED_CHECKED",
      payload: { ...checked, ...newChecked },
    });
  };

  const saveChecked = () => {
    if (isEmpty(selected)) sendNotification("Строки не выбраны");
    else
      actions.doUpdateChecked({
        selected,
        ...checked,
        account_id,
      })(translationDispatch, sendNotification, fetchAll);
  };

  return (
    <Grid container spacing={3}>
      <Dialog
        open={modalOpenConfirm}
        onClose={closeModalConfirm}
        scroll={"body"}
        aria-labelledby="scroll-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to delete tarnslation?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            The translation will be deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModalConfirm} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="success" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={modalOpenCheched}
        onClose={closeModalCheched}
        scroll={"body"}
        aria-labelledby="scroll-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">
          Select language(s) and confirm
        </DialogTitle>
        <DialogContent>
          <Grid justify={"center"} container>
            <Box display={"flex"} flexDirection={"column"} width={600}>
              <FormControlLabel
                style={{ marginBottom: 35 }}
                control={
                  <Switch
                    checked={checked.checked_ru}
                    onChange={() => handleChecked("ru")}
                    value={true}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="h6" color="textSecondary">
                    Russian
                  </Typography>
                }
              />

              <FormControlLabel
                style={{ marginBottom: 35 }}
                control={
                  <Switch
                    checked={checked.checked_en}
                    onChange={() => handleChecked("en")}
                    value={true}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="h6" color="textSecondary">
                    English
                  </Typography>
                }
              />

              <FormControlLabel
                style={{ marginBottom: 35 }}
                control={
                  <Switch
                    checked={checked.checked_fr}
                    onChange={() => handleChecked("fr")}
                    value={true}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="h6" color="textSecondary">
                    Franch
                  </Typography>
                }
              />
            </Box>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={closeModalCheched}>
            Cancel
          </Button>
          <Button color="success" onClick={saveChecked} autoFocus>
            Save selected
          </Button>
        </DialogActions>
      </Dialog>

      <Grid item xs={12}>
        <Widget inheritHeight>
          <Box
            justifyContent={"space-between"}
            display={"flex"}
            alignItems={"flex-start"}
          >
            <Box>
              {status === "admin" && (
                <>
                  <Link
                    href="#/app/translation/import"
                    underline="none"
                    color="#fff"
                  >
                    <Button variant={"contained"} color={"success"}>
                      <Box mr={1} display={"flex"}>
                        <LabelImportantIcon />
                      </Box>
                      Import
                    </Button>
                  </Link>

                  <Link
                    href="#/app/translation/backups"
                    underline="none"
                    color="#fff"
                  >
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
                </>
              )}
              {status === "interpreter" && (
                <Button
                  variant={"contained"}
                  color={"success"}
                  onClick={() => {
                    if (isEmpty(selected)) {
                      console.log("selected", selected);
                      sendNotification("No rows selected", true);
                    } else {
                      openModalCheched();
                    }
                  }}
                >
                  <Box mr={1} display={"flex"}>
                    <DoneAllIcon />
                  </Box>
                  Mark verified
                </Button>
              )}
              {status === "admin" && (
                <>
                  <Link
                    href={`${config.baseURLApi}/translations/download/ru/${filterVals.pname}`}
                    underline="none"
                    color="#fff"
                  >
                    <Button
                      variant={"outlined"}
                      color={"secondary"}
                      style={{ marginLeft: 16 }}
                    >
                      <Box display={"flex"} mr={1}>
                        <DownloadIcon />
                      </Box>
                      ru
                    </Button>
                  </Link>
                  <Link
                    href={`${config.baseURLApi}/translations/download/en/${filterVals.pname}`}
                    underline="none"
                    color="#fff"
                  >
                    <Button
                      variant={"outlined"}
                      color={"secondary"}
                      style={{ marginLeft: 16 }}
                    >
                      <Box display={"flex"} mr={1}>
                        <DownloadIcon />
                      </Box>
                      en
                    </Button>
                  </Link>
                  <Link
                    href={`${config.baseURLApi}/translations/download/fr/${filterVals.pname}`}
                    underline="none"
                    color="#fff"
                  >
                    <Button
                      variant={"outlined"}
                      color={"secondary"}
                      style={{ marginLeft: 16 }}
                    >
                      <Box display={"flex"} mr={1}>
                        <DownloadIcon />
                      </Box>
                      fr
                    </Button>
                  </Link>
                </>
              )}
            </Box>
            <Box display={"flex"}>
              <Box style={{ minWidth: 150 }}>
                <FormControl variant="outlined" margin="dense" fullWidth>
                  <InputLabel id="id-pname-label">Name of project</InputLabel>
                  <Select
                    labelId="id-pname-label"
                    id="id-pname-select"
                    label="Name of project"
                    onChange={(e) => handleChangeFilter(e, "pname")}
                    value={filterVals.pname}
                  >
                    <MenuItem value="">
                      <em>All</em>
                    </MenuItem>
                    {pNames.map((item) => (
                      <MenuItem value={item} key={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box style={{ marginLeft: 16 }}>
                <FormControl variant="outlined" margin="dense" fullWidth>
                  <InputLabel id="id-gkey-select-label">Status</InputLabel>
                  <Select
                    labelId="id-gkey-select-label"
                    id="id-gkey-select"
                    label="Status"
                    onChange={(e) => handleChangeFilter(e, "checked")}
                    value={filterVals.checked}
                  >
                    <MenuItem value="">
                      <em>All</em>
                    </MenuItem>
                    <MenuItem value="checked_all">Verified</MenuItem>
                    <MenuItem value="not_checked_all">Not verified</MenuItem>
                    <MenuItem value="ru">Not Verified RU</MenuItem>
                    <MenuItem value="en">Not Verified EN</MenuItem>
                    <MenuItem value="fr">Not Verified FR</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box style={{ marginLeft: 16, minWidth: 100 }}>
                <FormControl variant="outlined" margin="dense" fullWidth>
                  <InputLabel id="id-gkey-select-label">Group</InputLabel>
                  <Select
                    labelId="id-gkey-select-label"
                    id="id-gkey-select"
                    label="Group"
                    onChange={(e) => handleChangeFilter(e, "gkey")}
                    value={filterVals.gkey}
                  >
                    <MenuItem value="">
                      <em>All</em>
                    </MenuItem>
                    {gKeys.map((item) => (
                      <MenuItem value={item} key={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box style={{ marginLeft: 16 }}>
                <Input
                  id="search-field"
                  label="Search by Key and/or Value"
                  margin="dense"
                  variant="outlined"
                  value={filterVals.lang_value}
                  onChange={(e) => handleChangeFilter(e)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Widget>
      </Grid>
      <Grid item xs={12}>
        <Widget inheritHeight noBodyPadding>
          <TableContainer>
            <Table
              aria-labelledby="tableTitle"
              size="medium"
              aria-label="enhanced table"
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={translationsRows.length}
              />
              <TableBody>
                {stableSort(translationsRows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                      >
                        {status === "interpreter" && (
                          <TableCell padding="checkbox" style={{ width: "5%" }}>
                            <Checkbox
                              checked={isItemSelected}
                              inputProps={{
                                "aria-labelledby": labelId,
                              }}
                            />
                          </TableCell>
                        )}
                        {status === "admin" && (
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            style={{ width: "5%" }}
                          >
                            <Typography variant={"body2"}>{row.id}</Typography>
                          </TableCell>
                        )}
                        <TableCell align="left" style={{ width: "5%" }}>
                          <Box
                            display={"flex"}
                            style={{
                              marginLeft: -12,
                              width: 100,
                            }}
                          >
                            <IconButton color={"primary"}>
                              <Link
                                href={`#app/Translation/${row.id}/edit`}
                                color="#fff"
                              >
                                <CreateIcon />
                              </Link>
                            </IconButton>
                            {status === "admin" && (
                              <IconButton
                                onClick={() => openModalConfirm(row.id)}
                                color={"primary"}
                              >
                                <DeleteIcon />
                              </IconButton>
                            )}
                          </Box>
                        </TableCell>

                        {headCells
                          .filter(
                            (item) =>
                              item?.status == null ||
                              (item?.status != null &&
                                item?.status.includes(status))
                          )
                          .map(
                            (item, inx) =>
                              (status === "admin" ? inx > 1 : inx >= 1) && (
                                <TableCell
                                  align="left"
                                  key={item.id}
                                  size={
                                    ["lang_ru", "lang_en", "lang_fr"].includes(
                                      item.id
                                    )
                                      ? "medium"
                                      : "small"
                                  }
                                  style={
                                    ["lang_ru", "lang_en", "lang_fr"].includes(
                                      item.id
                                    )
                                      ? { width: "30%" }
                                      : { width: "10%" }
                                  }
                                >
                                  {["created_at", "updated_at"].includes(
                                    item.id
                                  ) ? (
                                    <Typography
                                      variant={"body2"}
                                      block={true}
                                      size="small"
                                    >
                                      {moment(row[item.id]).format(
                                        "DD.MM.YYYY HH:mm"
                                      )}{" "}
                                    </Typography>
                                  ) : item.id === "lang_ru" ? (
                                    needCheck(row, "ru")
                                  ) : item.id === "lang_en" ? (
                                    needCheck(row, "en")
                                  ) : item.id === "lang_fr" ? (
                                    needCheck(row, "fr")
                                  ) : item.id === "tkey" ? (
                                    <Typography
                                      variant={"body2"}
                                      color="secondary"
                                      weight="medium"
                                      block={true}
                                      size="small"
                                    >
                                      {row[item.id]}
                                    </Typography>
                                  ) : (
                                    <Typography
                                      size="small"
                                      variant={"body2"}
                                      block={true}
                                    >
                                      {row[item.id]}
                                    </Typography>
                                  )}
                                </TableCell>
                              )
                          )}
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50, 100, 1000]}
            component="div"
            count={translationsRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Widget>
      </Grid>
    </Grid>
  );
};

export default TranslationList;
