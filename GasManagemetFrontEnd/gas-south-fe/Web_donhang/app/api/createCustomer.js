import axios from 'axios';
import { CREATECUSTOMER } from 'config';
import getUserCookies from "getUserCookies";

async function createCustomer(name, phone, address, taxcode, code, note, email, contactname, branchname, userID, LAT, LNG) {
    let data;
    var user_cookies = await getUserCookies();
    if (user_cookies) {
        let params = {
            "name": name,
            "phone": phone,
            "address": address,
            "taxcode": Number(taxcode),
            "code": code,
            "note": note,
            "email": email,
            "contactname": contactname,
            "branchname" : branchname,
            "userID" : userID,
            "LAT" : Number(LAT),
            "LNG" : Number(LNG)
        };

        await axios.post(
            CREATECUSTOMER, params, {
            headers: {
                "Authorization": "Bearer " + user_cookies.token
                /*"Authorization" : "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTY4NjcyNDliYzY2OTZlY2VlNzMwZSIsInB3aCI6NzQ4NDYyMjc2LCJpYXQiOjE1NDE4Mzc1MzUsImV4cCI6MTU0MTkyMzkzNX0.gkD_Ym2uk17YcQydIuQ8q0Vm5a8SmF1KygrdnVX-4l0'*/
            }
        })
            .then(function (response) {
                data = response;
                console.log("createCustomer", createCustomer)
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

export default createCustomer;


