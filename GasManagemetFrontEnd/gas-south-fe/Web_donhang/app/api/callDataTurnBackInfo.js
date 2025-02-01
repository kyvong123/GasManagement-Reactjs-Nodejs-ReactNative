import axios from 'axios';
import {CALL_DATA_TURN_BACK_INFO} from 'config';
import getUserCookies from 'getUserCookies'
import Constants from "Constants";

async function CallTurnBackDataInfo(data) {

    var user_cookies = await getUserCookies();
    if (user_cookies) {
        let url = CALL_DATA_TURN_BACK_INFO
        //console.log("user_cookies",user_cookies);
        let params = {
            cylinder_ids:data,
        }
        await axios.post(
            url,
            params,
            {
                headers: {
                    "Authorization": "Bearer " + user_cookies.token
                    /*"Authorization": "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTY4NjcyNDliYzY2OTZlY2VlNzMwZSIsInB3aCI6NzQ4NDYyMjc2LCJpYXQiOjE1NDE4Mzc1MzUsImV4cCI6MTU0MTkyMzkzNX0.gkD_Ym2uk17YcQydIuQ8q0Vm5a8SmF1KygrdnVX-4l0'*/
                }
            }
        )
            .then(function (response) {
                data = response;
            })
            .catch(function (err) {
                data = err.response;
            });

        return data;
    } else {
        return "Expired Token API";
    }


}

export default CallTurnBackDataInfo;


