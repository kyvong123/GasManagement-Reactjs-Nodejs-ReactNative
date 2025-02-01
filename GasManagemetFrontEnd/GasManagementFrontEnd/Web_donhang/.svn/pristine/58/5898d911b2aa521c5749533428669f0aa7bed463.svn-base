import axios from 'axios';
export default function callApi(method, url, params, token) {
    return axios({
        method: method,
        url: url,
        data: params,
        headers: {
            Authorization: token,
        },
    }).catch(err => console.log(err));
}