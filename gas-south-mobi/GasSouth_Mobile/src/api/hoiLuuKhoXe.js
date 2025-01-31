import axios from 'axios';
import { API_URL, SHIPPING_TYPE } from '../constants';
import { getToken } from '../helper/auth';


export const hoiLuuKhoXe = async () => {
    try {
        const token = await getToken();
        const response = await axios.post(`${API_URL}/dfg56345trt`,
            body,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            }
        )
        return response.data;
    } catch (err) {
        console.log("LỖI HỒI LƯU KHO XE ==>", err);
    }
};
