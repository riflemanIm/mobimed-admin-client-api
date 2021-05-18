import React, { useEffect } from "react";
import { Grid, Box, TextField } from "@material-ui/core";
import { useParams } from "react-router";

import { useHistory } from "react-router-dom";
import useStyles from "./styles";

import Widget from "../../components/Widget/Widget";
import { toast } from "react-toastify";

import Notification from "../../components/Notification/Notification";
import {
  useMedicalBrandDispatch,
  useMedicalBrandState,
} from "../../context/MedicalBrandContext";

import { actions } from "../../context/MedicalBrandContext";

import useForm from "../../hooks/useForm";
import validate from "./validation";
import { Button, Typography } from "../../components/Wrappers/Wrappers";
import { resizeImageBase64 } from "../../helpers/base64";

const EditMedicalBrand = () => {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();

  const managementDispatch = useMedicalBrandDispatch();
  const { currentMedicalBrand } = useMedicalBrandState();

  function sendNotification(errorMessage) {
    const componentProps = {
      type: "feedback",
      message: errorMessage != null ? errorMessage : "Сеть отредактирована!",
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
      ...currentMedicalBrand,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMedicalBrand, id]);

  const saveData = () => {
    actions.doUpdate(id, values, sendNotification)(managementDispatch, history);
  };

  const { values, errors, handleChange, handleSubmit, setValues } = useForm(
    saveData,
    validate
  );

  const fileInput = React.useRef(null);

  const deleteOneImage = () => {
    setValues({
      ...values,
      logo: "",
    });
  };

  const handleFile = async (event) => {
    event.preventDefault();
    const filedata = event.target.files[0];
    const base64result = await resizeImageBase64(filedata, 610, 610);
    const logo = base64result.split(",")[1];
    console.log("logo", logo);
    setValues({
      ...values,
      logo,
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
                value={values?.title || ""}
                name="title"
                onChange={handleChange}
                style={{ marginBottom: 35 }}
                placeholder="Название"
                label="Название"
                type="text"
                fullWidth
                required
                error={errors?.title != null}
                helperText={errors?.title != null && errors?.title}
              />
              <TextField
                variant="outlined"
                value={values?.email || ""}
                name="email"
                onChange={handleChange}
                style={{ marginBottom: 35 }}
                placeholder="Email"
                label="Email"
                type="text"
                fullWidth
              />
              <TextField
                variant="outlined"
                value={values?.phone || ""}
                name="phone"
                onChange={handleChange}
                style={{ marginBottom: 35 }}
                placeholder="Телефон"
                label="Телефон"
                type="text"
                fullWidth
              />
              <TextField
                variant="outlined"
                value={values?.code || ""}
                name="code"
                onChange={handleChange}
                style={{ marginBottom: 35 }}
                placeholder="Код"
                label="Код"
                type="text"
                fullWidth
                required
                error={errors?.code != null}
                helperText={errors?.code != null && errors?.code}
              />
              {values.logo != null && (
                <div className={classes.galleryWrap}>
                  <div className={classes.imgWrap}>
                    <span
                      className={classes.deleteImageX}
                      onClick={() => deleteOneImage()}
                    >
                      ×
                    </span>
                    <img
                      src={`data:image/png;base64,${values.logo}`}
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
            <Grid item justify={"center"} container>
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                width={600}
              >
                <>
                  <Button
                    variant={"outlined"}
                    color={"primary"}
                    onClick={() => history.push("/app/medical_brand/list")}
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

export default EditMedicalBrand;
