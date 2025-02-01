import axios from 'axios';
import { VEHICLE_TRUCK } from 'config';
import getUserCookies from "getUserCookies";

async function deleteVehicle(params) {
    let data;
    const user_cookies = await getUserCookies();
    const {
        vehicleId,
    } = params;

    if (user_cookies) {
        let _params = { vehicleId };

        await axios.delete(
            VEHICLE_TRUCK,
            {
                data: _params,
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

export default deleteVehicle;