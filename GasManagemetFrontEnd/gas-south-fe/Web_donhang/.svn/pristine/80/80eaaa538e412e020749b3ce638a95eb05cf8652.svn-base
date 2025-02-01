import axios from 'axios';
import { GETALLCUSTOMERPLAN } from 'config';
import getUserCookies from "getUserCookies";


async function getAllCustomerPlan()  {
    let data;
    var user_cookies=await getUserCookies();
    if(user_cookies) {

    await axios.get(
        GETALLCUSTOMERPLAN, {
            headers: {
                "Authorization" : "Bearer " + user_cookies.token
            },
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

export default getAllCustomerPlan;


