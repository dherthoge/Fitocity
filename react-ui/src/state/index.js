import { combineReducers } from 'redux';
import reducer from './reducers/reducers.js';


const rootReducer = combineReducers({
    reducer: reducer,

});

export default rootReducer;