import axios from 'axios';
import { API_URL, SHIPPING_TYPE } from '../constants';
import { getToken } from '../helper/auth';

export const getReturnReasons = async () => {
    try {
        const token = await getToken();
        const response = await axios.get(`${API_URL}/reason/showListReason`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        return response.data;
    } catch (err) {
        console.log("/reason/showListReason", err)
    }
};

export const getCategoryCylinder = async () => {
    try {
        const token = await getToken();
        const response = await axios.get(`${API_URL}/categoryCylinder/getAll`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        console.log("Token:",token);
        return response.data;
    } catch (err) {
        console.log("getCategoryCylinder", err)
    }
};

export const getProductInfo = async serial_code => {
    try {
        const token = await getToken();
        const response = await axios.get(`${API_URL}/manufacture`, {
            headers: {
                "Authorization": `Bearer ${token}`
            },
            params: {
                cylinder_serial: `["${serial_code}"]`,
                type: 2
            }
        })
        return response.data;
    } catch (err) {
        console.log("/manufacture", err)
    }
};


export const getDriverName = async tramCode => {
    try {
        const response = await axios.get(`${API_URL}/user/listNameDriver`,
            {
                params: {
                    id: tramCode
                }
            }
        )
        return response.data;
    } catch (err) {
        console.log("/user/listNameDriver", err)
    }
};


export const getOrders = async userid => {
    try {
        const token = await getToken();
        const response = await axios.get(`${API_URL}/orderGS/findbyIdUser`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                params: {
                    userid: userid
                }
            }
        )
        return response.data;
    } catch (err) {
        console.log("orderGS/findbyIdUser", err)
    }
};


export const driverSubmitForm = async (body, orderID) => {
    try {
        const token = await getToken();
        const response = await axios.post(`${API_URL}/history/${body.shippingType === SHIPPING_TYPE.TRA_VO_KHAC ? 'createShippingOrderOther' : 'createShippingOrderGSID'}`,
            body,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            }
        )
        return response.data;
    } catch (err) {
        console.log("LỖI TÀI XẾ SUBMIT ==>", err);
    }
};
