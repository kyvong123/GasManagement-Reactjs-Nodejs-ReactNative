import axios from 'axios';
import { LISTHISTORYPRICE } from 'config';
import getUserCookies from 'getUserCookies'

async function getHistoryPrice(cylinder_serial, page = 1) {

    let data;
    var user_cookies = await getUserCookies();

    if (user_cookies) {

        let linkUrl = LISTHISTORYPRICE.replace('$cylinder_serial', cylinder_serial)
            .replace('$page', page).replace("$limit", 10);
        await axios.get(
            linkUrl,
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
    }
    else {
        return "Expired Token API";
    }


}

export default getHistoryPrice;


