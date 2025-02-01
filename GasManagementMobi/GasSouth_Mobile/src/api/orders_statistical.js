import axios from 'axios';
import { API_URL } from '../constants';
import { getToken, getUserInfo } from '../helper/auth';

const DuLieuGia = [
    {
        orderCode: "TONY123",
        date: "07/09/2022",
        customers:
        {
            name: "Thuong",
            address: "TPHCM"
        }
    },
    {
        orderCode: "TONY1234",
        date: "08/09/2022",
        customers:
        {
            name: "ThuongToday",
            address: "TPHCMToday"
        }
    },
    {
        orderCode: "TONY124",
        date: "17/08/2022",
        customers:
        {
            name: "Thuong2",
            address: "TPHCM2"
        }
    },
    {
        orderCode: "TONY125",
        date: "01/09/2022",
        customers:
        {
            name: "Thuong3",
            address: "TPHCM3"
        }
    },
]


export const getOrdersStatis = async ({vehicleId, type, startDate, endDate}) => {
    try {
        const token = await getToken();
        const response = await axios.get(`${API_URL}/vehicle/order/history`,   
        {
            headers: {
                "Authorization": `Bearer ${token}`
            },
            params:{       
                vehicleId,
                type,          // isIn: ['GIAO_HANG', 'HOI_LUU']
                startDate,  // type: ISOString
                endDate,    // type: ISOString           
            }
        })
        
        return response.data;
    }catch(error){
        console.warn(error);
        return null;
    }
    

};
export const getOrdersStatisDetail = async ({ orderId,type }) => {
    try{
        const token = await getToken();
        const response = await axios.get(`${API_URL}/vehicle/order/detail-history?orderHistoryId=${orderId}&type=${type}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        return response.data;
    }catch(error){
        console.log("LOI la:",error.message);
        return null;
    }
    
}