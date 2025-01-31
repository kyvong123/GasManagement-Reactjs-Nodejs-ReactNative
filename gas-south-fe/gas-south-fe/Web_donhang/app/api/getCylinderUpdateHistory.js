import axios from 'axios';
import { GET_CYLINDER_UPDATE_HISTORY } from 'config';
import getUserCookies from "getUserCookies";


async function getCylinderUpdateHistory(idCylinder) {
    let data;
    var user_cookies = await getUserCookies();
    if (user_cookies) {
        const params = {
            "idCylinder": idCylinder,
        };


        await axios.get(
            GET_CYLINDER_UPDATE_HISTORY, {
            headers: {
                "Authorization": "Bearer " + user_cookies.token
            },
            params: params,
        })
            .then(function (response) {
                // console.log('GET_CYLINDER_UPDATE_HISTORY', response);
                data = response;
            })
            .catch(function (err) {
                console.log('CATCH', err.response);
                data = err.response;
            });

        return data;
    }
    else {
        return "Expired Token API";
    }
}

export default getCylinderUpdateHistory;


