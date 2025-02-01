import axios from 'axios';
import {GETCUSTOMERPLANBYID} from 'config';
import getUserCookies from "getUserCookies";


async function getCustomerPlanById(id)  {
    let data;
    var user_cookies=await getUserCookies();
    if(user_cookies) {
        let params = {
            "id": id
        };
       

    await axios.post(
        GETCUSTOMERPLANBYID, params, {
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

export default getCustomerPlanById;


