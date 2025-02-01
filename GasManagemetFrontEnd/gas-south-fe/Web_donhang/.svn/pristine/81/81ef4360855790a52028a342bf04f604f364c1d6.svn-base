import axios from 'axios';
import { UPDATE_WAREHOUSE } from 'config';
import getUserCookies from "getUserCookies";

async function updateWareHouseAPI(warehouseId, name, code, address, stationId, mininventory, namecontact, mobilecontact, emailcontact, isSupplier, note) {

    let data;
    var user_cookies = await getUserCookies();
    // console.log(user_cookies)
    // console.log(UPDATE_WAREHOUSE)
    if (user_cookies) {
        let params = {
            "warehouseId": warehouseId,
            "name": name,
            "code": code,
            "address": address,
            "mininventory": mininventory!=""?mininventory:0,
            "userId": stationId,
            "namecontact": namecontact,
            "mobilecontact": mobilecontact,
            "emailcontact": emailcontact,
            "note": note,
            "isSupplier": isSupplier,
        };
        // console.log(params)
        await axios.post(
            UPDATE_WAREHOUSE, params, {
            headers: {
                "Authorization": "Bearer " + user_cookies.token
                /*"Authorization" : "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTY4NjcyNDliYzY2OTZlY2VlNzMwZSIsInB3aCI6NzQ4NDYyMjc2LCJpYXQiOjE1NDE4Mzc1MzUsImV4cCI6MTU0MTkyMzkzNX0.gkD_Ym2uk17YcQydIuQ8q0Vm5a8SmF1KygrdnVX-4l0'*/
            }
        })
            .then(function (response) {
                data = response;
            })
            .catch(function (err) {
                console.log(err)
                data = err.response;
            });
        return data;
    } else {
        return "Expired Token API";
    }
}
export default updateWareHouseAPI;


