import axios from 'axios';
import { GET_LISTREASON } from '../js/config/config';
import getUserCookies from 'getUserCookies'

async function getListReason() {

    let data;
    var user_cookies = await getUserCookies();

    if (user_cookies) {

        await axios.get(
            GET_LISTREASON,
            {
                headers: {
                    "Authorization": "Bearer " + user_cookies.token
                }
            }
        )
            .then(function (response) {
                data = response;
            })
            .catch(function (err) {
                data = err.response;
            });
        return data;
    }
    else {
        return "Expired Token API";
    }


}

export default getListReason;


