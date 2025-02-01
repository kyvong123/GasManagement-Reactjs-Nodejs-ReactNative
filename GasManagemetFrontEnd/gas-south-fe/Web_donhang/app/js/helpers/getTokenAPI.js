import Cookies from 'js-cookie';

async function getTokenAPI()  {

    let user=Cookies.get("user");

    if (typeof(Cookies.get("user")) !== 'undefined') {
   

        return JSON.parse(user).token;
    }
    else
        return  false;
};

export default getTokenAPI;