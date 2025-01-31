import axios from 'axios';
import {TOTALCYLINDERCREATE} from 'config';
import getUserCookies from 'getUserCookies'
import Constants from "Constants";

async function getToTalCylinderCreate(target, startDate, endDate, statisticalType, typesOfChildren, actions, actions1, actions2, actions3, actions4, actions5) {
    var user_cookies = await getUserCookies();
    console.log("user_cookies", user_cookies);
    let data;
    try{
        endDate= endDate.toDate();
        startDate = startDate.toDate();
        endDate = (new Date(endDate.setHours(30,59,59,999))).toISOString();
        startDate = (new Date(startDate.setHours(7,0,0,0))).toISOString();
      }
      catch(error){
          console.log(error)
      }
    if (user_cookies) {
        let url = TOTALCYLINDERCREATE + `?target=${target}&startDate=${startDate}&endDate=${endDate}&statisticalType=${statisticalType}&typesOfChildren[]=${typesOfChildren}&actions[]=${actions}&actions[]=${actions1}&actions[]=${actions2}&actions[]=${actions3}&actions[]=${actions4}&actions[]=${actions5} `
        //console.log("user_cookies",user_cookies);
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

export default getToTalCylinderCreate;

