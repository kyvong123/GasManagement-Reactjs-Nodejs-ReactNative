import axios from 'axios';
import { UPDATECUSTOMER } from 'config';
import getUserCookies from "getUserCookies";

async function updateCustumerAPI(id,name, phone, address, taxcode, note, email, contactname, branchname, userID, LAT, LNG) {
    let data;
    var user_cookies = await getUserCookies();
    if (user_cookies) {
        let params = {
            "customerGasID": id,
            "name": name,
            "phone": phone,
            "address": address,
            "taxcode": Number(taxcode),
            "note": note,
            "email": email,
            "contactname": contactname,
            "branchname" : branchname,
            "userID" : userID,
            "LAT" : Number(LAT), 
            "LNG" : Number(LNG)
        };
        await axios.post(
            UPDATECUSTOMER, params, {
            headers: {
                "Authorization": "Bearer " + user_cookies.token
            }
        })
            .then(function (response) {
                console.log(response);
                data = response;
            })
            .catch(function (err) {
                console.log(err);
                data = err.response;
            });


        return data;
    }
    else {
        return "Expired Token API";
    }
}

export default updateCustumerAPI;


