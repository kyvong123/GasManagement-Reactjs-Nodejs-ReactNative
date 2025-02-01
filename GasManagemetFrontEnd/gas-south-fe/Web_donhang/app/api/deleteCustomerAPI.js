import axios from 'axios';
import { DELETECUSTOMER } from 'config';
import getUserCookies from "getUserCookies";

async function deleteCustomerAPI(id)  {
    let data;
    var user_cookies = await getUserCookies();
    if(user_cookies){
        let params = {
            "CustomerGas" : id,
        };

    await axios.post(
        DELETECUSTOMER, params, {
            headers: {
                "Authorization" : "Bearer " + user_cookies.token
            }
        })
            .then(res => {
                data = res;
                console.log(data)
            })
            .catch(err => {
                console.log(err);
                data = err.res;
            });

        return data;
    }
    else {
        return "Expired Token API";
    }
}

export default deleteCustomerAPI;


