import React from "react";
import axios from "axios";
import config from "../config";

async function list() {
  const response = await axios.get(`/specializations`);
  return response.data;
}

const SpecializationStateContext = React.createContext();
const SpecializationDispatchContext = React.createContext();
const initialData = {
  findLoading: false,
  saveLoading: false,
  currentSpecialization: null,
  rows: [],
  loading: false,
  idToDelete: null,
  modalOpen: false,
  errorMessage: null,
};

function specializationReducer(state = initialData, { type, payload }) {
  if (type === "SPECIALIZATIONS_FORM_RESET") {
    return {
      ...initialData,
    };
  }

  if (type === "SPECIALIZATIONS_FORM_FIND_STARTED") {
    return {
      ...state,
      currentSpecialization: null,
      findLoading: true,
    };
  }

  if (type === "SPECIALIZATIONS_FORM_FIND_SUCCESS") {
    return {
      ...state,
      currentSpecialization: payload,
      findLoading: false,
    };
  }

  if (type === "SPECIALIZATIONS_FORM_FIND_ERROR") {
    return {
      ...state,
      currentSpecialization: null,
      findLoading: false,
    };
  }

  if (type === "SPECIALIZATIONS_FORM_CREATE_STARTED") {
    return {
      ...state,
      saveLoading: true,
      currentSpecialization: { specialization_id: null },
    };
  }

  if (type === "SPECIALIZATIONS_FORM_CREATE_SUCCESS") {
    return {
      ...state,
      saveLoading: false,
      currentSpecialization: payload,
    };
  }

  if (type === "SPECIALIZATIONS_FORM_CREATE_ERROR") {
    return {
      ...state,
      saveLoading: false,
      errorMessage: payload,
      currentSpecialization: { specialization_id: null },
    };
  }

  if (type === "SPECIALIZATIONS_FORM_UPDATE_STARTED") {
    return {
      ...state,
      saveLoading: true,
      errorMessage: null,
    };
  }

  if (type === "SPECIALIZATIONS_FORM_UPDATE_SUCCESS") {
    return {
      ...state,
      currentSpecialization: payload,
      saveLoading: false,
    };
  }

  if (type === "SPECIALIZATIONS_FORM_UPDATE_ERROR") {
    return {
      ...state,
      saveLoading: false,
      errorMessage: payload,
    };
  }

  if (type === "SPECIALIZATIONS_LIST_FETCH_STARTED") {
    return {
      ...state,
      loading: true,
    };
  }

  if (type === "SPECIALIZATIONS_LIST_FETCH_SUCCESS") {
    return {
      ...state,
      loading: false,
      rows: payload.rows,
    };
  }

  if (type === "SPECIALIZATIONS_LIST_FETCH_ERROR") {
    return {
      ...state,
      loading: false,
      rows: [],
    };
  }

  if (type === "SPECIALIZATIONS_LIST_DELETE_STARTED") {
    return {
      ...state,
      loading: true,
      errorMessage: null,
    };
  }

  if (type === "SPECIALIZATIONS_LIST_DELETE_SUCCESS") {
    return {
      ...state,
      loading: false,
      modalOpen: false,
    };
  }

  if (type === "SPECIALIZATIONS_LIST_DELETE_ERROR") {
    return {
      ...state,
      loading: false,
      modalOpen: false,
      errorMessage: payload,
    };
  }

  if (type === "SPECIALIZATIONS_LIST_OPEN_CONFIRM") {
    return {
      ...state,
      loading: false,
      modalOpen: true,
      idToDelete: payload.id,
    };
  }

  if (type === "SPECIALIZATIONS_LIST_CLOSE_CONFIRM") {
    return {
      ...state,
      loading: false,
      modalOpen: false,
    };
  }

  return state;
}

function SpecializationProvider({ children }) {
  const [state, dispatch] = React.useReducer(specializationReducer, {
    findLoading: false,
    saveLoading: false,
    currentSpecialization: { specialization_id: null },
    rows: [],
    loading: false,
    idToDelete: null,
    modalOpen: false,
    errorMessage: null,
  });

  return (
    <SpecializationStateContext.Provider value={state}>
      <SpecializationDispatchContext.Provider value={dispatch}>
        {children}
      </SpecializationDispatchContext.Provider>
    </SpecializationStateContext.Provider>
  );
}

function useSpecializationState() {
  const context = React.useContext(SpecializationStateContext);
  if (context === undefined) {
    throw new Error(
      "useSpecializationState must be used within a SpecializationProvider"
    );
  }
  return context;
}

function useSpecializationDispatch() {
  const context = React.useContext(SpecializationDispatchContext);
  if (context === undefined) {
    throw new Error(
      "useSpecializationDispatch must be used within a SpecializationProvider"
    );
  }
  return context;
}

// ###########################################################

const actions = {
  doNew: () => {
    return {
      type: "SPECIALIZATIONS_FORM_RESET",
    };
  },

  doFind: (id) => async (dispatch) => {
    try {
      dispatch({
        type: "SPECIALIZATIONS_FORM_FIND_STARTED",
      });

      axios.get(`/specializations/${id}`).then((res) => {
        const currentSpecialization = res.data;

        dispatch({
          type: "SPECIALIZATIONS_FORM_FIND_SUCCESS",
          payload: currentSpecialization,
        });
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "SPECIALIZATIONS_FORM_FIND_ERROR",
      });
    }
  },

  doCreate: (values, notify, urlBack) => async (dispatch, history) => {
    try {
      dispatch({
        type: "SPECIALIZATIONS_FORM_CREATE_STARTED",
      });
      await axios
        .post("/specializations", { data: values })
        .then((res) => {
          console.log("------- doCreate -----------", res.data);

          dispatch({
            type: "SPECIALIZATIONS_FORM_CREATE_SUCCESS",
            payload: { specialization_id: res.data },
          });
          notify();
          history.push(urlBack);
        })
        .catch((error) => {
          console.log("error", error);
          notify(error.response.data?.err);

          dispatch({
            type: "SPECIALIZATIONS_FORM_CREATE_ERROR",
            payload: error.response.data?.err,
          });
        });
    } catch (error) {
      console.log("error", error);

      notify("Error add specialization");
      dispatch({
        type: "SPECIALIZATIONS_FORM_CREATE_ERROR",
      });
    }
  },

  doUpdate: (id, values, notify) => async (dispatch, history) => {
    dispatch({
      type: "SPECIALIZATIONS_FORM_UPDATE_STARTED",
    });

    await axios
      .put(`/specializations/${id}`, { id, data: values })
      .then((response) => {
        dispatch({
          type: "SPECIALIZATIONS_FORM_UPDATE_SUCCESS",
          payload: values,
        });
        notify();
        console.log("response", response);
        history.push("/app/specialization/list");
      })
      .catch((error) => {
        console.log("error", error);
        notify(error.response.data?.err);

        dispatch({
          type: "SPECIALIZATIONS_FORM_UPDATE_ERROR",
          payload: error.response.data?.err,
        });
      });
  },

  doFetch: (filter, keepPagination = false) => async (dispatch) => {
    try {
      dispatch({
        type: "SPECIALIZATIONS_LIST_FETCH_STARTED",
        payload: { filter, keepPagination },
      });

      const response = await list();

      dispatch({
        type: "SPECIALIZATIONS_LIST_FETCH_SUCCESS",
        payload: {
          rows: response,
          count: response.length,
        },
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "SPECIALIZATIONS_LIST_FETCH_ERROR",
      });
    }
  },

  doDelete: (id) => async (dispatch) => {
    if (!config.isBackend) {
      dispatch({
        type: "SPECIALIZATIONS_LIST_DELETE_ERROR",
      });
    } else {
      try {
        dispatch({
          type: "SPECIALIZATIONS_LIST_DELETE_STARTED",
        });

        await axios.delete(`/specializations/${id}`);

        dispatch({
          type: "SPECIALIZATIONS_LIST_DELETE_SUCCESS",
        });
        const response = await list();
        dispatch({
          type: "SPECIALIZATIONS_LIST_FETCH_SUCCESS",
          payload: {
            rows: response,
            count: response.length,
          },
        });
      } catch (error) {
        console.log(error);
        dispatch({
          type: "SPECIALIZATIONS_LIST_DELETE_ERROR",
        });
      }
    }
  },

  doOpenConfirm: (id) => (dispatch) => {
    dispatch({
      type: "SPECIALIZATIONS_LIST_OPEN_CONFIRM",
      payload: {
        id: id,
      },
    });
  },
  doCloseConfirm: () => (dispatch) => {
    dispatch({
      type: "SPECIALIZATIONS_LIST_CLOSE_CONFIRM",
    });
  },
};

// eslint-disable-next-line no-use-before-define
export {
  SpecializationProvider,
  useSpecializationState,
  useSpecializationDispatch,
  actions,
};
