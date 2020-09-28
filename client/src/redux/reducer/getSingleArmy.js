const initState = { isLoading: false, error: "", data: [] };

const getSingleArmy = (state = initState, action) => {
  switch (action.type) {
    case "REQUEST_GETSINGLEARMY_START":
      return {
        ...state,
        isLoading: true
      };
    case "REQUEST_GETSINGLEARMY_SUCCESS":
      return {
        ...state,
        isLoading: false,
        data: action.army
      };
    case "REQUEST_GETSINGLEARMY_FAIL":
      return {
        ...state,
        isLoading: false,
        error: action.error
      };
    default:
      return state;
  }
};

export default getSingleArmy
