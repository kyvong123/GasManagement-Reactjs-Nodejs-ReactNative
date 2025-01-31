import axios from 'axios';
import {GET_CHILD_END_NUMBER_IMPORT} from 'config';
import getUserCookies from 'getUserCookies'
import Constants from "Constants";

async function getChildAndNumberImports(target_id, begin, end) {

    let data;
    var user_cookies = await getUserCookies();
    if (user_cookies) {
        let url = GET_CHILD_END_NUMBER_IMPORT
        const params = {
            target_id: !!target_id ? target_id : user_cookies.user.id,
            start_date: begin,
            end_date: end
        }
        //console.log("user_cookies",user_cookies);
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

export default getChildAndNumberImports;


