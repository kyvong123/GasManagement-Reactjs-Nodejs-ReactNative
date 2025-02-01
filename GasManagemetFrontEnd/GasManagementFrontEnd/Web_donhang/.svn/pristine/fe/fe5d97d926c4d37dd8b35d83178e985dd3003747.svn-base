import axios from 'axios';
import { ACCESSRIGHT } from 'config';
import getUserCookies from "getUserCookies";

async function accessRightAPI(actionName, controllerName) {
    let data;
    var user_cookies = await getUserCookies();
    if (user_cookies) {
        let params = {
            // "userId": user_cookies.user.id,
            "userID" : "5fc9e2c498746f1ea8134772",
            "actionName": actionName,
            "controllerName" : controllerName
        };
        await axios.post(
            ACCESSRIGHT, params, {
            headers: {
                "Authorization": "Bearer " + user_cookies.token
            }
        })
            .then(function (response) {
                //console.log(response);
                data = response;
            })
            .catch(function (err) {
                console.log(err);
                data = err.response;
            });


        return data;
    } else {
        return "Expired Token API";
    }
}

export default accessRightAPI;


