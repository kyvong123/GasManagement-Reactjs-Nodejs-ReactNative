import axios from 'axios';
import {LOGIN_SYSTEMUSER} from 'config';

async function loginSystemUserApi(username, password) {

    let user;
    const params = {
        "email": username,
        "password": password
    }

    await axios.post(LOGIN_SYSTEMUSER, params,
    ).then(function (response) {  
        user = response;
    }).catch(function (err) {
        user = err.response;
    });
    return user;
}

export default loginSystemUserApi;