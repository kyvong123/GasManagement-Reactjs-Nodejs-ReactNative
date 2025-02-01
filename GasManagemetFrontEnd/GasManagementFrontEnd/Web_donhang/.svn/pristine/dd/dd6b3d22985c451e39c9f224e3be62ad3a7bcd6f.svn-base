import axios from 'axios';
import { ADDMANUFACTURER } from 'config';
import getUserCookies from "getUserCookies";

async function addManufacturer(name, phone = '', 
address = '', logo = '', origin = '', mass = 0, ingredient = '', 
preservation = '', appliedStandard = '', optionSafetyInstructions = '', safetyInstructions = '') {
    let data;
    var user_cookies = await getUserCookies();
    if (user_cookies) {
        let params = {
            "name": name,
            "phone": phone,
            "address": address,
            "logo": logo,
            "origin": origin,
            "mass": mass,
            "ingredient": ingredient,
            "preservation": preservation,
            "appliedStandard": appliedStandard,
            "optionSafetyInstructions": optionSafetyInstructions,
            "safetyInstructions": safetyInstructions
        };


        await axios.post(
            ADDMANUFACTURER, params, {
            headers: {
                "Authorization": "Bearer " + user_cookies.token
                /*"Authorization" : "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTY4NjcyNDliYzY2OTZlY2VlNzMwZSIsInB3aCI6NzQ4NDYyMjc2LCJpYXQiOjE1NDE4Mzc1MzUsImV4cCI6MTU0MTkyMzkzNX0.gkD_Ym2uk17YcQydIuQ8q0Vm5a8SmF1KygrdnVX-4l0'*/
            }
        })
            .then(function (response) {
                //console.log(response);
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

export default addManufacturer;


