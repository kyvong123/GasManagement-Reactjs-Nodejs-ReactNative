import axiosClient from "./axiosClient";
import getUserCookies from "getUserCookies";
import moment from "moment";

export const getAllCustomer = async (object) => {
    let url = '/orderGS/getTypeCustomers2'
    let data;
    var user_cookies = await getUserCookies();
    if (user_cookies) {
        try {
            if (!object || object.station === '' && object.area === '' && object.typeCus === '') {
                data = await axiosClient.get(url, {
                    headers: { Authorization: "Bearer " + user_cookies.token },
                });
            }
            else if (object.station !== '' && object.area === '' && object.typeCus === '') {
                data = await axiosClient.get(`/orderGS/getTypeCustomers2?supplier=${object.station}`, {
                    headers: { Authorization: "Bearer " + user_cookies.token },
                });
            }
            else if (object.station !== '' && object.area !== '' && object.typeCus === '') {
                data = await axiosClient.get(`/orderGS/getTypeCustomers2?supplier=${object.station}&area=${object.area}`, {
                    headers: { Authorization: "Bearer " + user_cookies.token },
                });
            }
            else if (object.station !== '' && object.area !== '' && object.typeCus !== '') {
                data = await axiosClient.get(`/orderGS/getTypeCustomers2?supplier=${object.station}&area=${object.area}&type=${object.typeCus}`, {
                    headers: { Authorization: "Bearer " + user_cookies.token },
                });
            }
            else if (object.station === '' && object.area === '' && object.typeCus !== '') {
                data = await axiosClient.get(`/orderGS/getTypeCustomers2?type=${object.typeCus}`, {
                    headers: { Authorization: "Bearer " + user_cookies.token },
                });
            }
        } catch (e) {
            console.log(e);
        }
        return data;
    } else {
        return "Invalid Token API";
    }
}
export const stth = async (startDate, endDate) => {
    let data;
    var user_cookies = await getUserCookies();
    if (user_cookies) {
        try {

            let start = startDate
            let end = endDate
            data = await axiosClient.get(`/history/dataFromHistory?from=${start}&to=${end}`, {
                headers: { Authorization: "Bearer " + user_cookies.token },
            });

        } catch (e) {
            console.log(e);
        }
        return data;
    } else {
        return "Invalid Token API";
    }
}
export const luykehientay = async (date) => {
    let data;
    var user_cookies = await getUserCookies();
    if (user_cookies) {
        try {
            data = await axiosClient.get(`/history/dataFromHistory2?to=${date}`, {
                headers: { Authorization: "Bearer " + user_cookies.token },
            });
        } catch (e) {
            console.log(e);
        }
        return data;
    } else {
        return "Invalid Token API";
    }
}

export const slkh = async (from, to) => {
    let data;
    var user_cookies = await getUserCookies();
    let start = from
    let end = to
    if (user_cookies) {
        try {
            data = await axiosClient.get(`/history/dataFromHistory3?from=${start}&to=${end}`, {
                headers: { Authorization: "Bearer " + user_cookies.token },
            });
        } catch (e) {
            console.log(e);
        }
        return data;
    } else {
        return "Invalid Token API";
    }
}


export const slth = async (from, to) => {
    let data;
    var user_cookies = await getUserCookies();
    if (user_cookies) {
        try {
            data = await axiosClient.get(`/history/dataFromHistory?from=${from}&to=${to}`, {
                headers: { Authorization: "Bearer " + user_cookies.token },
            });
        } catch (e) {
            console.log(e);
        }
        return data;
    } else {
        return "Invalid Token API";
    }
}