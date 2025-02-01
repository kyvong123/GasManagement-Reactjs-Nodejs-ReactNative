import axios from 'axios';
import { UPDATECUSTOMERPLAN } from 'config';
import getUserCookies from "getUserCookies";

async function updateCustumerPlanAPI(customerGasId, id, month,year, quantity, note) {
    let data;
    var user_cookies = await getUserCookies();
    if (user_cookies) {
        let params = {
            "customerGasId" : customerGasId,
            "id": id,
            "month": month,
            "year" : year,
            "quantity" : quantity,
            "note" : note,
        };
        await axios.post(
            UPDATECUSTOMERPLAN, params, {
            headers: {
                "Authorization": "Bearer " + user_cookies.token
            }
        })
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

export default updateCustumerPlanAPI;


