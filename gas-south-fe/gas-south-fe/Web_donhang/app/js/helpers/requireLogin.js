import Cookies from 'js-cookie';

const requireLogin = (nextState, replace, next) => {

    if (typeof(Cookies.get("user")) === 'undefined') {
        replace('/login');
    }
    next();
};

export default requireLogin;