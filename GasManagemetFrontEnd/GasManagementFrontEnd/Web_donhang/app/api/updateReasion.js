import axios from 'axios';
import { UPDATE_REASION } from '../js/config/config';
import getUserCookies from 'getUserCookies'

async function updateReasion(idOder) {
    let data;
    var user_cookies = await getUserCookies();
    if (user_cookies) {
        let body = {
            acpReturn: user_cookies.user.id,
        }
        await axios.put(
            UPDATE_REASION + `?id=${idOder}`, body,
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

export default updateReasion;


