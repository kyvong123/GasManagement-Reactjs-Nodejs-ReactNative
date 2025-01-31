import axios from 'axios';
import { TURNBACKCYLINDERDUPLICATE } from 'config';
import getUserCookies from "getUserCookies";
import Constant from "Constants";
import showToast from "showToast";
async function turnbackCylinderDuplicate(driver, license_plate, cylinders, type, to_id, import_type, numberOfCylinder, from_id, to_array, number_array, phoneCustomer = '', nameCustomer = '', addressCustomer = '', typeForPartner, exportPlace, idDriver, sign, cylinderImex, idImex, typeImex, flow, successCylinders, turnBack_cylinerIneligible) {
    let data;
    try{
        var user_cookies = await getUserCookies();
    console.log(user_cookies)
    }catch(error){
        console.log(error.message)
    }
    
    let count = 0;
    //console.log(number_array);
    if (!!number_array) {
        for (let i = 0; i < number_array.length; i++) {
            let item = parseInt(number_array[i]);
            count += item;
        }
        // if (count !== cylinders.length) {
        //     return {data: {message: "Số lượng không chính xác!!!"}};
        // }
    }
    if (user_cookies) {
        let params = {};
        console.log("haoTessst", type);
        switch (type) {
            case "IMPORT_FACTORY":
                console.log('import', params)
                params = {
                    "driver": driver,
                    "license_plate": license_plate,
                    "to": user_cookies.user.id,
                    "cylinders": cylinders,
                    "type": import_type,
                    "from": from_id ? from_id : null,
                    "numberOfCylinder": parseInt(numberOfCylinder),
                    "idDriver": idDriver,
                    "signature": sign,
                    "cylinderImex": cylinderImex,
                    "idImex": idImex,
                    "typeImex": typeImex,
                    "flow": flow,
                    "successCylinders": successCylinders,
                    "turnBack_cylinerIneligible": turnBack_cylinerIneligible
                    
                };
                break;
        }
        console.log('PARAMS::::', params)
        await axios.post(
            TURNBACKCYLINDERDUPLICATE, params, {
            headers: {
                "Authorization": "Bearer " + user_cookies.token
                /*"Authorization" : "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTY4NjcyNDliYzY2OTZlY2VlNzMwZSIsInB3aCI6NzQ4NDYyMjc2LCJpYXQiOjE1NDE4Mzc1MzUsImV4cCI6MTU0MTkyMzkzNX0.gkD_Ym2uk17YcQydIuQ8q0Vm5a8SmF1KygrdnVX-4l0'*/
            }
        })
            .then(function (response) {
                console.log("data day ne",response);
                data = response;
            })
            .catch(function (err) {
                console.log("ERR",err);
                data = { data: { message: "Danh sách mã bình chưa chính xác!!!" } };
            });
        return data;
    } else {
        return "Expired Token API";
    }
}

export default turnbackCylinderDuplicate;



