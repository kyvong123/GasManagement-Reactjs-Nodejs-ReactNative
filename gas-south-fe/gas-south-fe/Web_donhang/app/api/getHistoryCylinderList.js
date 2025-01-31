import React from 'react'
import { GETHISTORYCYLINDERLIST } from 'config';
import getUserCookies from 'getUserCookies'
import axios from 'axios'
async function getHistoryCylinderList (cylinderId){
    let data;
    var user_cookies = await getUserCookies();
    if(user_cookies){
        let url = GETHISTORYCYLINDERLIST.replace("$cylinderId", cylinderId);
        await axios.get(url, {
            headers: {
                    "Authorization": "Bearer " + user_cookies.token
                }
        }).then(function (response) {
            data = response.data;
        }).catch(function (error) {
            data = error
        })
         return data;
    }
    else{
         return "Expired Token API";
    }
   
}

export default getHistoryCylinderList