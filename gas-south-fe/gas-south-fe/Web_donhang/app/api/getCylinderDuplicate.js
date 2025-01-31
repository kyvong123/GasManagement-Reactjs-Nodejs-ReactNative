import axios from 'axios';
import {GETCYLINDERDUPLICATE} from 'config';
import getUserCookies from 'getUserCookies'


async function getCylinderDuplicate(serial, actionType) {

    let data;
    var user_cookies = await getUserCookies();
    if (user_cookies) {
        let params = {
            "listSerial": serial,
            "actionType": actionType
        };
        await axios.post(
            GETCYLINDERDUPLICATE, params,
            {
                headers: {
                    "Authorization": "Bearer " + user_cookies.token,
                    "Content-Type": "application/json"
                    /*"Authorization": "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTY4NjcyNDliYzY2OTZlY2VlNzMwZSIsInB3aCI6NzQ4NDYyMjc2LCJpYXQiOjE1NDE4Mzc1MzUsImV4cCI6MTU0MTkyMzkzNX0.gkD_Ym2uk17YcQydIuQ8q0Vm5a8SmF1KygrdnVX-4l0'*/
                }
            }
        )
            .then(function (response) {
                data = response;
            })
            .catch(function (err) {
                data = err.message;
            });

        return data;
    } else {
        return "Expired Token API";
    }


}

export default getCylinderDuplicate;


