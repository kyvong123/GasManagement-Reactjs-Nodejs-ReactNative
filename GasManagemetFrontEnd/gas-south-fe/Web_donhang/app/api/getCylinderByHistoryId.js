import axios from 'axios';
import {EXPORT_CYLINDER_BY_HISTORY} from 'config';
import getUserCookies from "getUserCookies";


async function getCylinderByHistoryId(historyId,nameFile)  {
    let data;
    var user_cookies=await getUserCookies();
    if(user_cookies) {
        let params={
            "history_id": historyId
        };
       

    await axios.get(
        EXPORT_CYLINDER_BY_HISTORY+ `?history_id=${historyId}`, {
            headers: {
                "Authorization" : "Bearer " + user_cookies.token
                /*"Authorization" : "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTY4NjcyNDliYzY2OTZlY2VlNzMwZSIsInB3aCI6NzQ4NDYyMjc2LCJpYXQiOjE1NDE4Mzc1MzUsImV4cCI6MTU0MTkyMzkzNX0.gkD_Ym2uk17YcQydIuQ8q0Vm5a8SmF1KygrdnVX-4l0'*/
            },
            responseType: 'blob'
        })
            .then(function(response) {
               //console.log(response);
               
                data = response.data;
                
                const url = window.URL.createObjectURL(new Blob([response.data]));

                const link = document.createElement('a');
                link.href = url;
                //let disposition = response.headers['content-disposition']
                let filename = `${nameFile}_Bao_Cao.xlsx`;
                link.setAttribute('download', filename); //or any other extension
                document.body.appendChild(link);
                link.click();
                //fileDownload(data, 'report.csv');
            })
            .catch(function(err) {console.log(err);
                data = err.response;        
            });


        return data;
    }
    else {
        return "Expired Token API";
    }
}

export default getCylinderByHistoryId;


