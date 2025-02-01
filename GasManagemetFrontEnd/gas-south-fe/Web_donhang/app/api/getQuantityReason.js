import axios from 'axios';
import { GET_QUANTITYREASO } from '../js/config/config';
import getUserCookies from 'getUserCookies'

async function getQuantityReason({ startDate, endDate }) {

    let data;
    var user_cookies = await getUserCookies();
    if (user_cookies) {

        await axios.get(
            GET_QUANTITYREASO + `?From=${startDate}&To=${endDate}`,
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

export default getQuantityReason;


