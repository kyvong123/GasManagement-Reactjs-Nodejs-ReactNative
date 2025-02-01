import axios from 'axios';
import { GETCUSTOMERBYID } from 'config';
import getUserCookies from "getUserCookies";


async function getCustomerById(id)  {
    let data;
    var user_cookies=await getUserCookies();
    if(user_cookies) {
        let params = {
            "CustomerGasID": id
        };
       

    await axios.post(
        GETCUSTOMERBYID, params, {
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

export default getCustomerById;


