import axios from 'axios';
import { GETALLCUSTOMERRECEIVE } from 'config';
import getUserCookies from 'getUserCookies'

async function getAllCustomerReceive() {
    let data;
    
    var user_cookies = await getUserCookies();
   
    if (user_cookies) {
        let url = GETALLCUSTOMERRECEIVE
       
        await axios.get(
            url,
            
            {
                headers: {
                    "Authorization": "Bearer " + user_cookies.token
                }
            }
        )
            .then(function (res) {
                data = res;
            })
            .catch(function (err) {
                data = err.res;
            });

        return data;
    }
    else {
        return "Expired Token API";
    }

}

export default getAllCustomerReceive;