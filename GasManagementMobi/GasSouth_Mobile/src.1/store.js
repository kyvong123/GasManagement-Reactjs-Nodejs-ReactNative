import { createStore, applyMiddleware } from 'redux';
import Immutable from 'immutable';
import {createLogger} from 'redux-logger';
import { composeWithDevTools } from 'remote-redux-devtools';
import { createEpicMiddleware } from 'redux-observable';
import rootReducer from './reducers';
import rootEpic from './epics';
import { tokenMiddleWare, ternantMiddleWare, refreshTokenMiddleWare, ternantTokenMiddleWare } from './middlewares';

const initialState = Immutable.Map();

const epicMiddleware = createEpicMiddleware(rootEpic,{
  dependencies: { tokenMiddleWare, ternantMiddleWare, refreshTokenMiddleWare, ternantTokenMiddleWare }
});

const logger = createLogger({ stateTransformer: state => state.toJS() });
const middleWare = [];
// middleWare.push(logger);
// middleWare.push(tokenMiddlewares);
middleWare.push(epicMiddleware);
middleWare.push(logger);
const store =  createStore(
  rootReducer,
  initialState,
  composeWithDevTools(
    applyMiddleware(...middleWare)
  )
);

if (module.hot) {
  module.hot.accept(() => {
    const nextRootReducer = rootReducer;
    store.replaceReducer(nextRootReducer);
  });
}

export default store;
// export default createStore(
//   rootReducer,
//   initialState,
//   composeWithDevTools(
//     applyMiddleware(...middleWare)
//   )
// );