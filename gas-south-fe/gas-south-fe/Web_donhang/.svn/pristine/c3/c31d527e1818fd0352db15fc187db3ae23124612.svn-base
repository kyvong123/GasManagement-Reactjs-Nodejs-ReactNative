import axios from 'axios';
import {GETDESTINATIONURL} from 'config';
import getUserCookies from 'getUserCookies'
import Constant from 'Constants'

async function getDestinationUserAPI(type='',action_type='',user_role='',isHasChild = "") {

    let data;
    let url = GETDESTINATIONURL;
    var user_cookies = await getUserCookies();
    if(action_type === "TURN_BACK")
    {
        url+="/?action_type=TURN_BACK"
    }
    else  if(action_type === "EXPORT")
    {
        url+="/?action_type=EXPORT"
    }
    else if(action_type === "IMPORT")
    {
        url+="/?action_type=IMPORT"
    }
    else if(action_type === "EXPORT_PARENT_CHILD")
    {
        url+="/?action_type=EXPORT_PARENT_CHILD"
    }

    if(type === Constant.FACTORY)
    {
        if(!!user_role){
            url+=`?user_type=Factory&user_role=Owner`
        }else {
            url+="&user_type=Factory"
        }

    }
    else if(type === Constant.GENERAL)
    {
      url+="&user_type=General"
    }
    else if(type === Constant.AGENCY)
    {
      url+="&user_type=Agency"
    }
    else if(type === Constant.STATION)
    {
      url+="&user_type=Station"
    }else if(type === Constant.FIXER)
    {
        url+=`?user_type=${Constant.FIXER}`
    }

    if (user_cookies) {
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
                data = response;
            })
            .catch(function (err) {
                data = err.response;
            });

        return data;
    }
    else {
        return "Expired Token API";
    }


}

export default getDestinationUserAPI;


