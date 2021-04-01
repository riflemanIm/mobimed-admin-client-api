import React, { useEffect } from "react";
import { useParams } from "react-router";
import { Grid, Box, TextField } from "@material-ui/core";

import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import { useHistory } from "react-router-dom";
import useStyles from "./styles";
import { toast } from "react-toastify";
import Widget from "../../components/Widget/Widget";
import { Typography, Button } from "../../components/Wrappers/Wrappers";
import Notification from "../../components/Notification/Notification";

import { actions } from "../../context/SpecializationContext";
import {
  useSpecializationDispatch,
  useSpecializationState,
} from "../../context/SpecializationContext";

import useForm from "../../hooks/useForm";
import { resizeImageBase64 } from "../../helpers/base64";
import validate from "./validation";

const EditSpecialization = () => {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();

  const managementDispatch = useSpecializationDispatch();
  const { currentSpecialization } = useSpecializationState();
  const fileInput = React.useRef(null);

  function sendNotification(errorMessage) {
    const componentProps = {
      type: "feedback",
      message: errorMessage != null ? errorMessage : "Промо отредактированна!",
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

  useEffect(() => {
    if (id) {
      console.log("id", id);
      actions.doFind(id)(managementDispatch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setValues({
      ...currentSpecialization,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSpecialization, id]);

  const saveData = () => {
    actions.doUpdate(id, values, sendNotification)(managementDispatch, history);
  };

  const { values, errors, handleChange, handleSubmit, setValues } = useForm(
    saveData,
    validate
  );

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

export default EditSpecialization;
