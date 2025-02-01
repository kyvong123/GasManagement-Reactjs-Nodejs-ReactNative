import axios from 'axios';
import { CREATEDUPLICATECYLINDER } from 'config';
import getUserCookies from "getUserCookies";
async function createDuplicateCylinder(serial, color, checkedDate, weight, placeStatus, status, classification/*currentImportPrice, cylinderType*/, manufacture, valve, manufacturedBy, cylinderAt_childFactory, category, productionDate,
    embossLetters) {


    let data;
    var user_cookies = await getUserCookies();
    if (user_cookies) {
        const params = {
            "serial": serial,
            // "factory": user_cookies.user.userType === 'Factory' ? user_cookies.user.id : "",
            "factory": user_cookies.user.parentRoot,
            // "general": user_cookies.user.userType === 'General' ? user_cookies.user.id : "",
            // "general": generalId,
            //"agency": agencyId,
            //"img_url": "http://icons.iconarchive.com/icons/guillendesign/variations-3/256/Default-Icon-icon.png",
            "color": color,
            "checkedDate": checkedDate,
            "weight": weight,
            "placeStatus": placeStatus,
            "status": status,
            "track": [],
            "circleCount": 0,
            "classification": classification,
            //"cylinderType": cylinderType,
            //"currentImportPrice": currentImportPrice,
            "manufacture": manufacture,
            "embossLetters": embossLetters,
            "productionDate": productionDate,
            "valve": valve,
            "manufacturedBy": cylinderAt_childFactory ? cylinderAt_childFactory : user_cookies.user.id,
            // "listconttycon": listconttycon,
            "cylinderAt_childFactory": cylinderAt_childFactory,
            "category": category,
        };

        await axios.post(
            CREATEDUPLICATECYLINDER, params, {
            headers: {

                "Authorization": "Bearer " + user_cookies.token
                /*"Authorization" : "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTY4NjcyNDliYzY2OTZlY2VlNzMwZSIsInB3aCI6NzQ4NDYyMjc2LCJpYXQiOjE1NDE4Mzc1MzUsImV4cCI6MTU0MTkyMzkzNX0.gkD_Ym2uk17YcQydIuQ8q0Vm5a8SmF1KygrdnVX-4l0'*/
            }
        })
            .then(function (response) {
                console.log("duplicate", response);
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

export default createDuplicateCylinder;


