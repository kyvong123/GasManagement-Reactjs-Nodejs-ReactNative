import axios from 'axios';
import { GETDASHBOARDFIXER } from 'config';
import getUserCookies from 'getUserCookies'
import Constants from "Constants";
async function getDashboardFixer(objectId, startDate, endDate, condition) {
    let data;
    var user_cookies = await getUserCookies();
    try {
        endDate = endDate.toDate();
        startDate = startDate.toDate();
        endDate = (new Date(endDate.setHours(23, 59, 59, 999))).toISOString();
        startDate = (new Date(startDate.setHours(0, 0, 0, 0))).toISOString();
    }
    catch (error) {
        console.log(error)
    }
    if (user_cookies) {
        let url = GETDASHBOARDFIXER + `?objectId=${objectId}&startDate=${startDate}&endDate=${endDate}&condition=${condition}`
        await axios.get(
            url,
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

export default getDashboardFixer;