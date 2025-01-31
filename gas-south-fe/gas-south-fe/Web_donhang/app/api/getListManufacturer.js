
import axios from 'axios';
import { GETLISTMANUFACTURE } from 'config';
import getUserCookies from "getUserCookies";

async function updateExcellCylinders(isChildOf) {
    let data;
    var user_cookies = await getUserCookies();
    if (user_cookies) {
        let params = {
            "isChildOf": isChildOf,
        };
        await axios.post(
            GETLISTMANUFACTURE, params, {
            headers: {
                "Authorization": "Bearer " + user_cookies.token
            }
        })
            .then(function (response) {
                data = response;
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

export default updateExcellCylinders;
