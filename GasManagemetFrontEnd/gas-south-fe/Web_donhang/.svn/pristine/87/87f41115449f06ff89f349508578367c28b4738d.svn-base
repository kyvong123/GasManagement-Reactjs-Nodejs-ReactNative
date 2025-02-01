import axios from 'axios';
import { CREATECUSTOMERPLAN } from 'config';
import getUserCookies from "getUserCookies";

async function createCustomerPlan(month, year, note, quantity, customerGasId) {


    let data;
    var user_cookies = await getUserCookies();
    if (user_cookies) {
        let params = {
            "year" : year,
            "month": month,
            "note": note,
            "quantity": quantity,
            "customerGasId": customerGasId,
        };

        await axios.post(
            CREATECUSTOMERPLAN, params, {
            headers: {
                "Authorization": "Bearer " + user_cookies.token
            }
        })
            .then(function (response) {
                data = response;
                console.log(data)
            })
            .catch(function (err) {
                console.log(err);
                data = err.response;
            });


        return data;
    }
    else {
        return "Expired Token API";
    }
}

export default createCustomerPlan;


