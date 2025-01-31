import axios from 'axios';
import { CANCEL_CARRIER } from 'config';
import getUserCookies from "getUserCookies";

async function cancelCarrierAPI(carrierId) {

    let data;
    var user_cookies = await getUserCookies();
    if (user_cookies) {
        let params = {
            "carrierId": carrierId,
            "deletedBy": user_cookies.user.id,
        };
        console.log("params",params)
        await axios.post(
            CANCEL_CARRIER, params, {
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
export default cancelCarrierAPI;


