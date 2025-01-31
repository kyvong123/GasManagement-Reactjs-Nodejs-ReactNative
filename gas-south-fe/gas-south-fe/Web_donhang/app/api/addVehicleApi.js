import axios from 'axios';
import { VEHICLE_TRUCK } from 'config';
import getUserCookies from "getUserCookies";

async function addVehicle(params) {
    let data;
    const user_cookies = await getUserCookies();
    const {
        email,
        password = 'A123!@#', 
        name = '', 
        userType,
        userRole,
        isChildOf,
        owner,
        code = 'CODE' + Date.now(),
        license_plate,
        load_capacity,
    } = params;

    if (user_cookies) {
        let _params = {
            email,
            password,
            name,
            userType,
            userRole,
            isChildOf,
            owner,
            code,
            license_plate,
            load_capacity,
        };

        await axios.post(
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

export default addVehicle;