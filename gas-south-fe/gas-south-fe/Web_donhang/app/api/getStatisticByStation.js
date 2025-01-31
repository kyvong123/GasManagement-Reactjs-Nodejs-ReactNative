import axios from 'axios';
import { GET_STATISTIC_BY_STATION } from 'config';
import getUserCookies from 'getUserCookies';

async function getStatisticByStation(target, statisticalType,  startDate, endDate) {
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
        let url = GET_STATISTIC_BY_STATION + `?target=${target}&startDate=${startDate}&endDate=${endDate}&statisticalType=${statisticalType}`
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

export default getStatisticByStation;