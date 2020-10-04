import { combineReducers } from "redux";
import armies from "./armies"
import getSingleArmy from './getSingleArmy'
import deteleArmy from './deleteArmy'


const reducers = combineReducers({
  armies,
  getSingleArmy,
  deteleArmy
});

export default reducers;
