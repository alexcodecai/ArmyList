import axios from "axios";

function requestStart() {
  return {
    type: "REQUEST_USERS_START"
  };
}

function requestFail(error) {
  return {
    type: "REQUEST_USERS_FAIL",
    error
  };
}

export function addArmy(payload) {
  return dispatch => {
    dispatch(requestStart());
    axios({
      method: "POST",
      url:"/api/army",
      data: payload,
      headers:{
        'content-type': "multipart/form-data"
      }
    })
      // .post("/api/army", payload)
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        dispatch(requestFail(err));
      });
  };
}
