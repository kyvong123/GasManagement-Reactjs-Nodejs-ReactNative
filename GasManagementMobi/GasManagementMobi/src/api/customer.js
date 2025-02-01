import axios from 'axios';
import { API_URL, SHIPPING_TYPE } from '../constants';
import { getToken } from '../helper/auth';
const customerApi = {
    getCustomers: {
        url: (form) => `/user/getListUserByType?isChildOf=${form.isChildOf}&customerType=${form.customerType}`,
    },
}
export default customerApi
export const getDriver = async (id) => {
    try {
        const response = await axios.post(`${API_URL}/user/getDriver`,
            {
                id,
            },
            
        )
        return response.data;
    } catch (err) {
        console.log("LỖI LẤY TÀI XẾ ==>", err);
    }
};
