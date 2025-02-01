// import { applyMiddleware, createStore, compose, combineReducers } from 'redux';
import { applyMiddleware, createStore } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { persistStore, persistReducer } from 'redux-persist';
import { composeWithDevTools } from 'redux-devtools-extension';
// import storage from 'redux-persist/lib/storage';
import AsyncStorage from '@react-native-community/async-storage'

import rootEpic from './rootEpic';
import rootReducer from './rootReducer';
// import { tokenMiddleWare } from './middleware'

const initialState = {}

// const epicMiddleware = createEpicMiddleware();

const epicMiddleware = createEpicMiddleware({
  dependencies: {}
});


const reducer = persistReducer(
  {
    key: 'root', // key is required
    storage: AsyncStorage, // storage is now required
    whitelist: ['app', 'user'],
    // whitelist: ['app'],
  },
  rootReducer
);

const middleware = [
  epicMiddleware,
];

/* istanbul ignore next */
if (process.env.NODE_ENV === 'development') {
  const { createLogger } = require('redux-logger');

  middleware.push(createLogger());
}
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* istanbul ignore next */
const configStore = () => {
  const createStoreWithMiddleware = composeWithDevTools(applyMiddleware(...middleware))(createStore);

  const store = createStoreWithMiddleware(reducer, initialState);

  epicMiddleware.run(rootEpic);

  if (module.hot) {
    module.hot.accept('reducers', () => {
      const nextRootReducer = rootReducer;
      store.replaceReducer(nextRootReducer);
    });
    module.hot.accept('epics', () => {
      const nextRootEpic = rootEpic;
      epicMiddleware.replaceEpic(rootEpic);
    });
  }

  return {
    persistor: persistStore(store),
    store,
  };
};

const { store, persistor } = configStore();


export { store, persistor };