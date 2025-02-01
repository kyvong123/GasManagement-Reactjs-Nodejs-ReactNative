import axios from 'axios';
import {REPORT_PIE_CHART} from 'config';
import getUserCookies from 'getUserCookies'
import Constants from "Constants";

async function getReportPieChart( target_id, end, statisticalType, typeOfChildren, searchs1, searchs2, searchs3, searchs4, searchs5) {
    var user_cookies = await getUserCookies();
    
  try{
    end= end.toDate();
    end = (new Date(end.setHours(30,59,59,999))).toISOString()
  }
  catch(error){
      console.log(error)
  }
    
    if (user_cookies) {
        let url = REPORT_PIE_CHART + `?target=${target_id}&endDate=${end}&statisticalType=${statisticalType}&typesOfChildren[]=${typeOfChildren}&searchs[0][type]=${searchs1}&searchs[0][contents][0]=${searchs2}&searchs[1][type]=${searchs3}&searchs[1][contents][0]=${searchs4}&searchs[1][contents][1]=${searchs5}`
      
        //console.log("user_cookies",user_cookies);
        let data;
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
                console.log("cacacacacaacaca", response)
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

export default getReportPieChart;


