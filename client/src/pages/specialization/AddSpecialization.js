import React from "react";
import { useHistory } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import useStyles from "./styles";
import { toast } from "react-toastify";
import { Typography, Button } from "../../components/Wrappers/Wrappers";
import Widget from "../../components/Widget/Widget";
import Notification from "../../components/Notification/Notification";

import { actions } from "../../context/SpecializationContext";
import { useSpecializationDispatch } from "../../context/SpecializationContext";

import useForm from "../../hooks/useForm";
import { resizeImageBase64 } from "../../helpers/base64";
import validate from "./validation";

const AddSpecialization = () => {
  const classes = useStyles();

  function sendNotification(errorMessage = null) {
    const componentProps = {
      type: "feedback",
      message: errorMessage != null ? errorMessage : "Промо добавлен!",
      variant: "contained",
      color: errorMessage != null ? "warning" : "success",
    };
    const options = {
      type: errorMessage != null ? "defence" : "info",
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

  const managementDispatch = useSpecializationDispatch();
  const history = useHistory();

  const saveData = () => {
    actions.doCreate(values, sendNotification)(managementDispatch, history);
  };

  const { values, errors, handleChange, handleSubmit, setValues } = useForm(
    saveData,
    validate
  );

  const fileInput = React.useRef(null);

  const deleteOneImage = () => {
    setValues({
      ...values,
      image: "",
    });
  };

  const handleFile = async (event) => {
    event.preventDefault();
    const filedata = event.target.files[0];
    const base64result = await resizeImageBase64(filedata, 610, 610);
    const image = base64result.split(",")[1];
    console.log("image", image);
    setValues({
      ...values,
      image,
    });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Widget>
          <Grid item justify={"center"} container>
            <Box display={"flex"} flexDirection={"column"} width={600}>
              <TextField
                variant="outlined"
                value={values?.name || ""}
                name="name"
                onChange={handleChange}
                style={{ marginBottom: 35 }}
                placeholder="Специализация"
                label="Специализация"
                multiline
                rows={4}
                type="text"
                fullWidth
                required
                error={errors?.name != null}
                helperText={errors?.name != null && errors?.name}
              />
              <TextField
                variant="outlined"
                value={values?.description || ""}
                name="description"
                onChange={handleChange}
                style={{ marginBottom: 35 }}
                placeholder="Описание"
                label="Описание"
                multiline
                rows={4}
                type="text"
                fullWidth
                required
                error={errors?.description != null}
                helperText={errors?.description != null && errors?.description}
              />

              <FormControl variant="outlined" style={{ marginBottom: 35 }}>
                <InputLabel htmlFor="lang_code-native-required">
                  Язык
                </InputLabel>
                <Select
                  native
                  value={values?.lang_code}
                  onChange={handleChange}
                  label="Язык"
                  inputProps={{
                    name: "lang_code",
                    id: "outlined-lang_code-native-simple",
                  }}
                >
                  <option value="rus">Русский</option>
                  <option value="fra">Французский</option>
                  <option value="eng">Английский</option>
                </Select>
              </FormControl>

              {values.image != null && (
                <div className={classes.galleryWrap}>
                  <div className={classes.imgWrap}>
                    <span
                      className={classes.deleteImageX}
                      onClick={() => deleteOneImage()}
                    >
                      ×
                    </span>
                    <img
                      src={`data:image/jpeg;base64,${values.image}`}
                      alt=""
                      height={"100%"}
                    />
                  </div>
                </div>
              )}

              <label
                className={classes.uploadLabel}
                style={{ cursor: "pointer" }}
              >
                Выбрать файл
                <input
                  style={{ display: "none" }}
                  accept="image/*"
                  type="file"
                  ref={fileInput}
                  onChange={handleFile}
                />
              </label>
              <Typography size={"sm"} style={{ marginBottom: 35 }}>
                .PNG, .JPG, .JPEG
              </Typography>
            </Box>
            <Grid item justify={"center"} container style={{ marginTop: 35 }}>
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                width={600}
              >
                <>
                  <Button
                    variant={"outlined"}
                    color={"primary"}
                    onClick={() => history.push("/app/specialization/list")}
                  >
                    Отмена
                  </Button>
                  <Button
                    variant={"contained"}
                    color={"success"}
                    onClick={handleSubmit}
                  >
                    Сохранить
                  </Button>
                </>
              </Box>
            </Grid>
          </Grid>
        </Widget>
      </Grid>
    </Grid>
  );
};

export default AddSpecialization;
