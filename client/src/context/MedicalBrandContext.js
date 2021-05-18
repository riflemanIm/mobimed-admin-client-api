import React from "react";
import axios from "axios";
import config from "../config";

async function list() {
  const response = await axios.get(`/medical_brand`);
  return response.data;
}

const MedicalBrandStateContext = React.createContext();
const MedicalBrandDispatchContext = React.createContext();
const initialData = {
  findLoading: false,
  saveLoading: false,
  currentMedicalBrand: null,
  rows: [],
  loading: false,
  idToDelete: null,
  modalOpen: false,
  errorMessage: null,
};

function MedicalBrandReducer(state = initialData, { type, payload }) {
  if (type === "MEDICALBRAND_FORM_RESET") {
    return {
      ...initialData,
    };
  }

  if (type === "MEDICALBRAND_FORM_FIND_STARTED") {
    return {
      ...state,
      currentMedicalBrand: null,
      findLoading: true,
    };
  }

  if (type === "MEDICALBRAND_FORM_FIND_SUCCESS") {
    return {
      ...state,
      currentMedicalBrand: payload,
      findLoading: false,
    };
  }

  if (type === "MEDICALBRAND_FORM_FIND_ERROR") {
    return {
      ...state,
      currentMedicalBrand: null,
      findLoading: false,
    };
  }

  if (type === "MEDICALBRAND_FORM_CREATE_STARTED") {
    return {
      ...state,
      saveLoading: true,
      currentMedicalBrand: { medical_brand_id: null },
    };
  }

  if (type === "MEDICALBRAND_FORM_CREATE_SUCCESS") {
    return {
      ...state,
      saveLoading: false,
      currentMedicalBrand: payload,
    };
  }

  if (type === "MEDICALBRAND_FORM_CREATE_ERROR") {
    return {
      ...state,
      saveLoading: false,
      errorMessage: payload,
      currentMedicalBrand: { medical_brand_id: null },
    };
  }

  if (type === "MEDICALBRAND_FORM_UPDATE_STARTED") {
    return {
      ...state,
      saveLoading: true,
      errorMessage: null,
    };
  }

  if (type === "MEDICALBRAND_FORM_UPDATE_SUCCESS") {
    return {
      ...state,
      currentMedicalBrand: payload,
      saveLoading: false,
    };
  }

  if (type === "MEDICALBRAND_FORM_UPDATE_ERROR") {
    return {
      ...state,
      saveLoading: false,
      errorMessage: payload,
    };
  }

  if (type === "MEDICALBRAND_LIST_FETCH_STARTED") {
    return {
      ...state,
      loading: true,
    };
  }

  if (type === "MEDICALBRAND_LIST_FETCH_SUCCESS") {
    return {
      ...state,
      loading: false,
      rows: payload.rows,
    };
  }

  if (type === "MEDICALBRAND_LIST_FETCH_ERROR") {
    return {
      ...state,
      loading: false,
      rows: [],
    };
  }

  if (type === "MEDICALBRAND_LIST_DELETE_STARTED") {
    return {
      ...state,
      loading: true,
      errorMessage: null,
    };
  }

  if (type === "MEDICALBRAND_LIST_DELETE_SUCCESS") {
    return {
      ...state,
      loading: false,
      modalOpen: false,
    };
  }

  if (type === "MEDICALBRAND_LIST_DELETE_ERROR") {
    return {
      ...state,
      loading: false,
      modalOpen: false,
      errorMessage: payload,
    };
  }

  if (type === "MEDICALBRAND_LIST_OPEN_CONFIRM") {
    return {
      ...state,
      loading: false,
      modalOpen: true,
      idToDelete: payload.id,
    };
  }

  if (type === "MEDICALBRAND_LIST_CLOSE_CONFIRM") {
    return {
      ...state,
      loading: false,
      modalOpen: false,
    };
  }

  return state;
}

function MedicalBrandProvider({ children }) {
  const [state, dispatch] = React.useReducer(MedicalBrandReducer, {
    findLoading: false,
    saveLoading: false,
    currentMedicalBrand: { medical_brand_id: null },
    rows: [],
    loading: false,
    idToDelete: null,
    modalOpen: false,
    errorMessage: null,
  });

  return (
    <MedicalBrandStateContext.Provider value={state}>
      <MedicalBrandDispatchContext.Provider value={dispatch}>
        {children}
      </MedicalBrandDispatchContext.Provider>
    </MedicalBrandStateContext.Provider>
  );
}

function useMedicalBrandState() {
  const context = React.useContext(MedicalBrandStateContext);
  if (context === undefined) {
    throw new Error(
      "useMedicalBrandState must be used within a MedicalBrandProvider"
    );
  }
  return context;
}

function useMedicalBrandDispatch() {
  const context = React.useContext(MedicalBrandDispatchContext);
  if (context === undefined) {
    throw new Error(
      "useMedicalBrandDispatch must be used within a MedicalBrandProvider"
    );
  }
  return context;
}

// ###########################################################

const actions = {
  doNew: () => {
    return {
      type: "MEDICALBRAND_FORM_RESET",
    };
  },

  doFind: (id) => async (dispatch) => {
    try {
      dispatch({
        type: "MEDICALBRAND_FORM_FIND_STARTED",
      });

      await axios.get(`/medical_brand/${id}`).then((res) => {
        const currentMedicalBrand = res.data;

        dispatch({
          type: "MEDICALBRAND_FORM_FIND_SUCCESS",
          payload: currentMedicalBrand,
        });
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "MEDICALBRAND_FORM_FIND_ERROR",
      });
    }
  },

  doCreate: (values, notify, urlBack) => async (dispatch, history) => {
    try {
      dispatch({
        type: "MEDICALBRAND_FORM_CREATE_STARTED",
      });
      await axios
        .post("/medical_brand", { data: values })
        .then((res) => {
          console.log("------- doCreate -----------", res.data);

          dispatch({
            type: "MEDICALBRAND_FORM_CREATE_SUCCESS",
            payload: { medical_brand_id: res.data },
          });
          notify();
          history.push(urlBack);
        })
        .catch((error) => {
          console.log("error", error);
          notify(error.response.data?.err);

          dispatch({
            type: "MEDICALBRAND_FORM_CREATE_ERROR",
            payload: error.response.data?.err,
          });
        });
    } catch (error) {
      console.log("error", error);
      notify("Error add Medical Net");
      dispatch({
        type: "MEDICALBRAND_FORM_CREATE_ERROR",
      });
    }
  },

  doUpdate: (id, values, notify) => async (dispatch, history) => {
    dispatch({
      type: "MEDICALBRAND_FORM_UPDATE_STARTED",
    });

    await axios
      .put(`/medical_brand/${id}`, { id, data: values })
      .then((response) => {
        dispatch({
          type: "MEDICALBRAND_FORM_UPDATE_SUCCESS",
          payload: values,
        });
        notify();
        // console.log("response", response);
        history.push("/app/medical_brand/list");
      })
      .catch((error) => {
        console.log("error", error);
        notify(error.response.data?.err);

        dispatch({
          type: "MEDICALBRAND_FORM_UPDATE_ERROR",
          payload: error.response.data?.err,
        });
      });
  },

  doFetch:
    (filter, keepPagination = false) =>
    async (dispatch) => {
      try {
        dispatch({
          type: "MEDICALBRAND_LIST_FETCH_STARTED",
          payload: { filter, keepPagination },
        });

        const response = await list();

        dispatch({
          type: "MEDICALBRAND_LIST_FETCH_SUCCESS",
          payload: {
            rows: response,
            count: response.length,
          },
        });
      } catch (error) {
        console.log(error);
        dispatch({
          type: "MEDICALBRAND_LIST_FETCH_ERROR",
        });
      }
    },

  doDelete: (id) => async (dispatch) => {
    if (!config.isBackend) {
      dispatch({
        type: "MEDICALBRAND_LIST_DELETE_ERROR",
      });
    } else {
      try {
        dispatch({
          type: "MEDICALBRAND_LIST_DELETE_STARTED",
        });

        await axios.delete(`/medical_brand/${id}`);

        dispatch({
          type: "MEDICALBRAND_LIST_DELETE_SUCCESS",
        });
        const response = await list();
        dispatch({
          type: "MEDICALBRAND_LIST_FETCH_SUCCESS",
          payload: {
            rows: response,
            count: response.length,
          },
        });
      } catch (error) {
        console.log(error);
        dispatch({
          type: "MEDICALBRAND_LIST_DELETE_ERROR",
        });
      }
    }
  },

  doOpenConfirm: (id) => (dispatch) => {
    dispatch({
      type: "MEDICALBRAND_LIST_OPEN_CONFIRM",
      payload: {
        id: id,
      },
    });
  },
  doCloseConfirm: () => (dispatch) => {
    dispatch({
      type: "MEDICALBRAND_LIST_CLOSE_CONFIRM",
    });
  },
};

// eslint-disable-next-line no-use-before-define
export {
  MedicalBrandProvider,
  useMedicalBrandState,
  useMedicalBrandDispatch,
  actions,
};
