import axios from 'axios';
import {GET_CHILD_END_NUMBER_EXPORT} from 'config';
import getUserCookies from 'getUserCookies'
import Constants from "Constants";

async function getChildAndNumberExport(target_id,action, begin, end, statisticalType, typeOfChildren, search1, search2, search3, search4, search5) {

    let data;
    var user_cookies = await getUserCookies();

    try{
        end= end.toDate();
        begin = begin.toDate();
        end = (new Date(end.setHours(30,59,59,999))).toISOString();
        begin = (new Date(begin.setHours(7,0,0,0))).toISOString();
      }
      catch(error){
          console.log(error)
      }
    if (user_cookies) {
        let url = GET_CHILD_END_NUMBER_EXPORT + `?target=${target_id}&action=${action}&startDate=${begin}&endDate=${end}&statisticalType=${statisticalType}&typesOfChildren[]=${typeOfChildren}&searchs[0][type]=${search1}&searchs[0][contents][0]=${search2}&searchs[1][type]=${search3}&searchs[1][contents][0]=${search4}&searchs[1][contents][1]=${search5}`
        
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
                console.log("dataexport",data)
            })
            .catch(function (err) {
                data = err.response;
            });

        return data;
    } else {
        return "Expired Token API";
    }


}

export default getChildAndNumberExport;


