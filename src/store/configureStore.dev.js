import { createStore, combineReducers, compose } from 'redux';
import rootReducer from '../reducers/RootReducer';
import DevTools from 'remote-redux-devtools';

const enhancer = compose(
    DevTools()
);

export default function configureStore(initialState) {
    return createStore(rootReducer, initialState, enhancer);
}
