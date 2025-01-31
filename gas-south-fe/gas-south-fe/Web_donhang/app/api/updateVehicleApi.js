import axios from 'axios';
import { VEHICLE_TRUCK } from 'config';
import getUserCookies from "getUserCookies";

async function updateVehicle(params) {
    let data;
    const user_cookies = await getUserCookies();
    const {
        vehicleId,
        code,
        license_plate,
        load_capacity,
    } = params;

    if (user_cookies) {
        let _params = { vehicleId };

        if (code) { _params.code = code };
        if (license_plate) { _params.license_plate = license_plate };
        if (load_capacity) { _params.load_capacity = load_capacity };

        await axios.put(
            VEHICLE_TRUCK, _params, {
            headers: {
                "Authorization": "Bearer " + user_cookies.token
            }
        })
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

export default updateVehicle;