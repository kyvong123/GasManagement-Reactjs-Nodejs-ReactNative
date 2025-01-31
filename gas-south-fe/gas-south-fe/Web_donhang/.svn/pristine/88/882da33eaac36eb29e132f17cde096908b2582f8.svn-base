import { createStore, applyMiddleware, compose} from 'redux';
import reducer from 'reducer';
import { routerMiddleware} from 'react-router-redux';
import { hashHistory } from 'react-router';
import Cookies from 'js-cookie';
import { createCookieMiddleware } from 'redux-cookie';
const middleware = routerMiddleware(hashHistory);
const store = createStore(
    reducer,
    // compose(applyMiddleware(middleware, createCookieMiddleware(Cookies)), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
    compose(applyMiddleware(middleware, createCookieMiddleware(Cookies))),
    //applyMiddleware(thunk)

);

export default store;