import { combineReducers } from "redux";
import armies from "./armies"
import getSingleArmy from './getSingleArmy'


const reducers = combineReducers({
  armies,
  getSingleArmy
});

export default reducers;
