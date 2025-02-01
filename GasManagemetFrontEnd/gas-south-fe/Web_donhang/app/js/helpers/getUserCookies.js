import Cookies from 'js-cookie';

async function getUserCookies() {

    let user = Cookies.get("user");
    //console.log("haoTesst",user);
    if (typeof (Cookies.get("user")) !== 'undefined') {
        //replace('/login');

        return JSON.parse(user);
    }
    else
        return false;
};

export default getUserCookies;