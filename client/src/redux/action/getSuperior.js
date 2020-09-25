import axios from "axios";

function requestStart() {
  return {
    type: "REQUEST_Armies_START"
  };
}

function requestSuccess(armies) {
  return {
    type: "REQUEST_Armies_SUCCESS",
    armies
  };
}

function requestFail(error) {
  return {
    type: "REQUEST_Armies_FAIL",
    error
  };
}

export function getSuperior(id) {
  // let sort = condition.sort;
  // let key = condition.key
  return dispatch => {
    dispatch(requestStart());
    axios
      .get(`/api/army/superior/${id}`)
      .then(response => {
        console.log("31", response.data)
        dispatch(requestSuccess(response.data));
        console.log("33", response.data)
      })
      .catch(error => {
        dispatch(requestFail(error));
      });
  };
}
