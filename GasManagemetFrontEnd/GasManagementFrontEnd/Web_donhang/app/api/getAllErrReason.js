import axios from 'axios';
import { GET_ALLERROR_REASION } from '../js/config/config';
import getUserCookies from 'getUserCookies'

async function getAllErrReason({ startDate, endDate }) {

    let data;
    var user_cookies = await getUserCookies();
    if (user_cookies) {
        //    let params = {
        //     From: startDate,
        //     To: endDate,
        //    }
        console.log(startDate);
        console.log(endDate);
        await axios.get(
            GET_ALLERROR_REASION + `?status=BINH&From=${startDate}&To=${endDate}&error=true`,
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

export default getAllErrReason;


