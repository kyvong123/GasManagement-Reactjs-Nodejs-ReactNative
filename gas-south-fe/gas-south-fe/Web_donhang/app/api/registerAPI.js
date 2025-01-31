import axios from 'axios';
import {REGISTERURL} from 'config';
import qs from 'qs';

async function registerAPI(username,password,address,name) {
    let data;

    const params= {
        "email": username,
        "name": name,
        "address": address,
        "password": password,
        "password_confirm": password
    };

    await axios.post(
            REGISTERURL,params)
            .then(function(response) {
                data = response;            })
            .catch(function(err) {
                data = err.response;
            });


        return data;
}

export default registerAPI;


