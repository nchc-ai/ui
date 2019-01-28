import { createStore, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import { apiMiddleware } from "redux-api-middleware";
import rootReducer from "./reducers";
import enableBatching from './reducers/Batch';

const store = createStore(
  enableBatching(
    rootReducer
  ),
  compose(
    applyMiddleware(
      thunkMiddleware,
      apiMiddleware,
      // logger
    ),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);

export default store;
