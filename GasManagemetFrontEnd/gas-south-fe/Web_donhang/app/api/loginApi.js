import axios from 'axios';
import {LOGINURL} from 'config';
import qs from 'qs';

async function loginApi(username, password) {

    let user;
    const params = {
        "email": username,
        "password": password
    }

    await axios.post(LOGINURL, params,
    ).then(function (response) {
        user = response;
    }).catch(function (err) {
        user = err.response;
    });
    return user;
}

export default loginApi;


