import axios from "axios";

function requestStart() {
  return {
    type: "REQUEST_GETSINGLEARMY_START"
  };
}

function requestSuccess(army) {
  return {
    type: "REQUEST_GETSINGLEARMY_SUCCESS",
    army
  };
}

function requestFail(error) {
  return {
    type: "REQUEST_GETSINGLEARMY_FAIL",
    error
  };
}


export function getSingleArmy(id) {
  return dispatch => {
    dispatch(requestStart());
    axios
      .get(`/api/single/${id}`)
      .then(response => {
        dispatch(requestSuccess(response.data));
        console.log('responsedata',response.data )
      })
      .catch(error => {
        dispatch(requestFail(error));
      });
  };
}
