import axios from 'axios';
import { VEHICLE_TRUCK } from 'config';
import getUserCookies from "getUserCookies";

async function getVehicle(params) {
    let data;
    const user_cookies = await getUserCookies();
    const {
        id
    } = params;

    if (user_cookies) {
        let url = VEHICLE_TRUCK;
        let _params = {
            id
        };

        await axios.get(
            url,
            {
                params: _params,
                headers: {
                    "Authorization": "Bearer " + user_cookies.token
                }
            }
        )
            .then(function (response) {
                data = response;
            })
            .catch(function (err) {
                // console.log(err)
                data = err.response;
            });
        return data;
    } else {
        return "Expired Token API";
    }
}

export default getVehicle;