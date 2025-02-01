import axios from 'axios';
import { IMEXGETDETAILCYLINDERSIMEXEXCELS } from 'config';
import getUserCookies from 'getUserCookies'
import Constants from "Constants";
async function getDetailCylindersImexExcels(objectId, startDate, endDate, condition, typeImex, categoryID, flow) {
    let data;
    var user_cookies = await getUserCookies();
    try {
        endDate = endDate.toDate();
        startDate = startDate.toDate();
        endDate = (new Date(endDate.setHours(23, 59, 59, 999))).toISOString();
        startDate = (new Date(startDate.setHours(0, 0, 0, 0))).toISOString();
    }
    catch (error) {
        console.log(error)
    }
    if (user_cookies) {
        let url = IMEXGETDETAILCYLINDERSIMEXEXCELS 
        let params = {
            "objectId": objectId,
            "startDate": startDate,
            "endDate": endDate,
            "condition": condition,
            "typeImex": typeImex,
            "categoryID": categoryID,
            "flow": flow,
        };
        await axios.post(
            url, params,
            {
                headers: {
                    "Authorization": "Bearer " + user_cookies.token
                    /*"Authorization": "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTY4NjcyNDliYzY2OTZlY2VlNzMwZSIsInB3aCI6NzQ4NDYyMjc2LCJpYXQiOjE1NDE4Mzc1MzUsImV4cCI6MTU0MTkyMzkzNX0.gkD_Ym2uk17YcQydIuQ8q0Vm5a8SmF1KygrdnVX-4l0'*/
                },
                responseType: 'blob'
            }
        )
            .then(function (response) {
                data = response.data;
                
                const url = window.URL.createObjectURL(new Blob([response.data]));

                const link = document.createElement('a');
                link.href = url;
                //let disposition = response.headers['content-disposition']
                let filename = `Bao_Cao.xlsx`;
                link.setAttribute('download', filename); //or any other extension
                document.body.appendChild(link);
                link.click();
            })
            .catch(function (err) {
                data = err.response;
            });


        return data;
    } else {
        return "Expired Token API";
    }
}

export default getDetailCylindersImexExcels;