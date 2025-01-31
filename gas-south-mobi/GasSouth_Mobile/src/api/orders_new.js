import axios from 'axios';
import { API_URL } from '../constants';
import { getToken, getUserInfo } from '../helper/auth';


export const getDetailHistoryOrderItem = async (isShipOf, shippingType) => {
    const token = await getToken();
    const response = await axios.get(`${API_URL}/history/inforHistoryCylinder`, {
        headers: {
            "Authorization": `Bearer ${token}`
        },
        params: {
            isShipOf: isShipOf
        }
    })
    console.log("KKKKKKKKKKKKKKKK", response.data)
    return { shippingType: shippingType, ...response.data };
}

export const getHistoryOrders = async orderId => {
    const token = await getToken();
    const response = await axios.get(`${API_URL}/history/showList`, {
        headers: {
            "Authorization": `Bearer ${token}`
        },
        params: {
            id: orderId
        }
    })
    return response.data;
}

export const getOrders = async () => {
    const token = await getToken();
    const response = await axios.get(`${API_URL}/orderGS/getAllIfIdIsCustomer`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    return response.data;
};

export const getAddressForDelivery = async orderID => {
    const token = await getToken();
    const response = await axios.get(`${API_URL}/orderGS/showAddressCustomer`, {
        headers: {
            "Authorization": `Bearer ${token}`
        },
        params: {
            orderID: orderID
        }
    })
    return response.data;
}

export const getOrdersForDelivery = async (isChildOf, userid) => {
    const token = await getToken();
    const response = await axios.get(`${API_URL}/orderGS/getAllIfIdIsSupplier?objectId=${isChildOf}&userid=${userid}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    console.log(response.data);
    return response.data;
};

// export const getOrdersForDelivery_Truck = async (isChildOf, userid) => {
//     const token = await getToken();
//     const response = await axios.get(`${API_URL}/orderGS/getAllIfIdIsSupplier?objectId=${isChildOf}&userid=${userid}`, {
//         headers: {
//             "Authorization": `Bearer ${token}`
//         }
//     })
//     console.log(response.data);
//     return response.data;
// };


export const getOrderDetail = async (orderId) => {
    const token = await getToken();
    const response = await axios.get(`${API_URL}/orderDetail/getOrderDetailByOrderGSId?id=${orderId}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    return response.data;
};

export const createOrderNew = async (body) => {
    try {
        const token = await getToken();
        const response = await axios.post(`${API_URL}/orderGS/createOrderGS`,
            body,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
        return response.data;
    } catch (error) {
        console.warn(error);
        return null;
    }
}
//lay danh sach khu vuc
export const getArea = async (stationID) => {
    try {
        const token = await getToken();
        const response = await axios.get(`${API_URL}/area?StationID=${stationID}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        console.log(error)
    }
};

//lay danh sach tram
export const getStation = async () => {
    try {
        const token = await getToken();
        const response = await axios.get(`${API_URL}/orderGS/getStation`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

//lay danh sach khach hàng theo  (id trạm, đối tượng)
export const getCustomers = async (isChildOf, customerType) => {
    try {
        const token = await getToken();
        const UserInfo = await getUserInfo();
        const response = await axios.get(`${API_URL}/orderGS/getTypeCustomers3?isChildOf=${isChildOf}&customerType=${customerType}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

export const getCustomersForDriverSubmitFom = async (isChildOf, customerType) => {
    try {
        const token = await getToken();
        const response = await axios.get(`${API_URL}/orderGS/getTypeCustomers3?isChildOf=${isChildOf}&customerType=${customerType}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

// chấp nhận đơn hàng mới
export const newOrderConfirmation = async (idOrder, body) => {
    try {
        const token = await getToken();
        const UserInfo = await getUserInfo();
        const response = await axios.post(`${API_URL}/orderGS/acpOrder?id=${idOrder}&userid=${UserInfo.id}`, body, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        console.warn(error.response.data);
        return null;
    }
}

// từ chối đơn hàng
export const rejectOrder = async (idOrder, body) => {
    try {
        const token = await getToken();
        const UserInfo = await getUserInfo();
        const response = await axios.post(`${API_URL}/orderGS/notacpOrder?id=${idOrder}&userid=${UserInfo.id}`, body, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        console.warn(error.response.data);
        return null;
    }
}

//khách hàng từ chối đơn hàng
export const customersRejectOrder = async (idOrder, body) => {
    try {
        const token = await getToken();
        const UserInfo = await getUserInfo();
        const response = await axios.post(`${API_URL}/orderGS/notacpOrderKH?id=${idOrder}&userid=${UserInfo.id}`, body, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        console.warn(error.response.data);
        return null;
    }
}

//Lấy danh sách thương hiệu
export const getListManufacture = async () => {
    const token = await getToken();
    try {
        const response = await axios.get(`${API_URL}/manufacture/ShowList`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        console.warn(error);
        return null;
    }
};

//lấy danh sách loại bình
export const getListCylinder = async () => {
    const token = await getToken();
    try {
        const response = await axios.get(`${API_URL}/categoryCylinder/getAll`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        console.warn(error);
        return null;
    }
};

//lấy danh sách màu sắc
export const getListColorGas = async () => {
    const token = await getToken();
    try {
        const response = await axios.get(`${API_URL}/colorGas`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        console.warn(error);
        return null;
    }
};

//lấy danh sách loại van
export const getListValve = async () => {
    const token = await getToken();
    try {
        const response = await axios.get(`${API_URL}/valve/showListValve`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        console.warn(error);
        return null;
    }
};

//tổ nhận lệnh sửa đơn hàng
export const updateOrder = async (idDetail, idOrder, body) => {
    try {
        const token = await getToken();
        const UserInfo = await getUserInfo();
        const response = await axios.put(`${API_URL}/orderDetail/update?idDetail=${idDetail}&id=${idOrder}&userid=${UserInfo.id}`, body, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        console.warn(error);
        return null;
    }
}
//cập nhật đơn hàng mới khi sửa đơn hàng
export const updateOrderNew = async (body) => {
    try {
        const token = await getToken();
        const response = await axios.post(`${API_URL}/orderDetail/createOrderDetail`, body, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        console.warn(error);
        return null;
    }
}
//xóa chi tiết đơn hàng
export const delOrderDetail = async (idDetail) => {
    try {
        const token = await getToken();
        const UserInfo = await getUserInfo();
        const response = await axios.post(`${API_URL}/orderDetail/delete?id=${idDetail}&userid=${UserInfo.id}`, null, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        console.warn(error);
        return null;
    }
}

//lấy danh sách đơn hàng
export const getOrderByUserId = async () => {
    try {
        const token = await getToken();
        const UserInfo = await getUserInfo();
        // let params = null
        let url = null

        // UserInfo.userRole === "SuperAdmin" ? params = UserInfo.id : params = UserInfo.isChildOf

        if (UserInfo.userType === "Tong_cong_ty" || UserInfo.userType === "SuperAdmin") {
            //công ty
            url = `/orderGS/getAllIfIdIsSupplier?userid=${UserInfo.id}`
        } else if (UserInfo.userType === "Tram" || UserInfo.userType === "Factory") {
            //trạm
            url = `/orderGS/getAllIfIdIsSupplier?objectId=${UserInfo.isChildOf}&userid=${UserInfo.id}`//param
        } else if (UserInfo.userType == "Agency" || UserInfo.userType == "General" || UserInfo.userType == "Khach_hang") {
            //khách hàng
            url = `/orderGS/getAllIfIdIsCustomer?objectId=${UserInfo.id}`//param
        }

        const response = await axios.get(`${API_URL}${url}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        console.warn(error);
        return null;
    }
}

//lấy danh sách ghi chú cho từng đơn hàng
export const getListNoteOrder = async (orderGSId) => {
    try {
        const token = await getToken();
        const response = await axios.get(`${API_URL}/history/getOrderGSConfirmationHistoryall?id=${orderGSId}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        console.warn(error);
        return null;
    }
}

//lấy danh sách đơn giá sản phẩm
export const getPrice = async (deliverydate, customer, cylinderType) => {
    try {
        const token = await getToken();
        const response = await axios.get(`${API_URL}/typepricedetail/getPriceOfCustomers?deliverydate=${deliverydate}&customer=${customer}&cylinderType=${cylinderType}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        console.warn(error.response.data);
        return null;
    }
}

//lấy danh sách đơn hàng theo ngay thang
export const getListOrderByDate = async (from, to) => {
    const token = await getToken();
    const UserInfo = await getUserInfo();
    let url = null
    if (UserInfo.userType === "Tong_cong_ty" || UserInfo.userType === "SuperAdmin") {
        //công ty
        url = `/orderGS/Supplier/getFromTo?orderCode=&From=${from}&To=${to}&userid=${UserInfo.id}`
    } else if (UserInfo.userType === "Tram" || UserInfo.userType === "Factory") {
        //trạm
        url = `/orderGS/Supplier/getFromTo?station=${UserInfo.isChildOf}&orderCode=&From=${from}&To=${to}&userid=${UserInfo.id}`
    } else if (UserInfo.userType == "Agency" || UserInfo.userType == "General" || UserInfo.userType == "Khach_hang") {
        //khách hàng
        url = `/orderGS/Customers/getFromTo?objectId=${UserInfo.id}&orderCode=&From=${from}&To=${to}`
    }
    try {
        const response = await axios.get(`${API_URL}${url}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        console.warn(error);
        return null;
    }
}

//thông báo 
export const sendNotification = async (body) => {
    try {
        const token = await getToken();
        const response = await axios.post(`${API_URL}/SendNotificationForEachDevice`, body, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        console.warn(error.response.data);
        return null;
    }
}

//lay playid

export const getPlayid = async (userType, userRole) => {
    try {
        const token = await getToken();
        const response = await axios.get(`${API_URL}/orderGS/getUserByCode?userType=${userType}&userRole=${userRole}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        console.warn(error.response.data);
        return null;
    }
}

//tìm kiếm đơn hàng theo mã 

export const getSearchOrder = async (text) => {
    try {
        const token = await getToken();
        const response = await axios.get(`${API_URL}/orderGS/getOrderByCode?orderCode=${text}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        console.warn(error.response.data);
        return null;
    }
}

//thống kê giao hàng
export const getDeliveryStatistics = async (fromDate, toDate, customerType, customerRole, stationId, customerId) => {
    const token = await getToken();
    const UserInfo = await getUserInfo();
    let url = null
    if (UserInfo.userType === "Tong_cong_ty" || UserInfo.userType === "SuperAdmin") {
        if (UserInfo.userType === "Tong_cong_ty" && UserInfo.userRole === "Deliver") {
            //tài xế công ty
            url = `/history/statisticSell?fromDate=${fromDate}&toDate=${toDate}&customerRole=${customerRole}&customerType=${customerType}&stationId=${UserInfo.isChildOf}&customerId=${customerId}`
        } else {
            //công ty
            url = `/history/statisticSell?fromDate=${fromDate}&toDate=${toDate}&customerRole=${customerRole}&customerType=${customerType}&stationId=${stationId}&customerId=${customerId}`
        }
    } else if (UserInfo.userType === "Tram" || UserInfo.userType === "Factory") {
        //diều độ trạm,kê toán trạm
        if (UserInfo.userType === "Tram" && UserInfo.userRole === "Dieu_do_tram" ||
            UserInfo.userType === "Tram" && UserInfo.userRole === "Ke_toan_tram" ||
            UserInfo.userType === "Tram" && UserInfo.userRole === "Deliver") {
            url = `/history/statisticSell?fromDate=${fromDate}&toDate=${toDate}&customerRole=${customerRole}&customerType=${customerType}&stationId=${UserInfo.isChildOf}&customerId=${customerId}`
        } else {//trưởng trạm
            url = `/history/statisticSell?fromDate=${fromDate}&toDate=${toDate}&customerRole=${customerRole}&customerType=${customerType}&stationId=${UserInfo.id}&customerId=${customerId}`
        }
    } else if (UserInfo.userType == "Agency" || UserInfo.userType == "General" || UserInfo.userType == "Khach_hang") {
        //khách hàng
        url = `/history/statisticSell?fromDate=${fromDate}&toDate=${toDate}&customerRole=${UserInfo.userRole}&customerType=${UserInfo.userType}&stationId=${UserInfo.isChildOf}&customerId=${UserInfo.id}`
    } else if (UserInfo.userRole === "Deliver") {
        //tài xế
        url = `/history/statisticSell?fromDate=${fromDate}&toDate=${toDate}&customerRole=${customerRole}&customerType=${customerType}&stationId=${UserInfo.isChildOf}&customerId=${customerId}`

    }


    try {
        const response = await axios.get(`${API_URL}${url}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        console.warn(error);
        return null;
    }
}

//điều độ trạm xác nhận đơn hàng với khách hàng
export const DieuDoTramXN = async (idOrder, body) => {
    try {
        const token = await getToken();
        const UserInfo = await getUserInfo();
        const response = await axios.put(`${API_URL}/orderGS/acpOrderdieudotramcomplete?id=${idOrder}&userid=${UserInfo.id}`, body, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        console.warn(error.response.data);
        return null;
    }
}

//điều độ trạm gửi duyệt lại cho khách hàng
export const DieuDoTram_Gui_Duyet = async (idOrder, body) => {
    try {
        const token = await getToken();
        const UserInfo = await getUserInfo();
        const response = await axios.put(`${API_URL}/orderGS/acpOrderdieudotramguicomplete?id=${idOrder}&userid=${UserInfo.id}`, body, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        console.warn(error.response.data);
        return null;
    }
}

//điều độ trạm xác nhận đơn hàng hoàn thành 
export const DieuDoTramXN_DHHT = async (idOrder, body) => {
    try {
        const token = await getToken();
        const UserInfo = await getUserInfo();
        const response = await axios.put(`${API_URL}/orderGS/acpOrdercomplete?id=${idOrder}&userid=${UserInfo.id}`, body, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        console.warn(error.response.data);
        return null;
    }
}

//khách hàng xác nhận đơn hàng khi điều độ trạm gửi duyệt lại
export const KH_XacNhanDon = async (idOrder, body) => {
    try {
        const token = await getToken();
        const UserInfo = await getUserInfo();
        const response = await axios.put(`${API_URL}/orderGS/acpOrderkhachhangcomplete?id=${idOrder}&userid=${UserInfo.id}`, body, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        console.warn(error.response.data);
        return null;
    }
}

//lấy danh sách bình lỗi
export const getListJarError = async (From, To) => {
    const token = await getToken();
    const UserInfo = await getUserInfo();
    let url = null
    if (UserInfo.userType === "Tong_cong_ty" || UserInfo.userType === "SuperAdmin") {
        //truong phong kinh doanh
        url = `/history/error?From=${From}&To=${To}`
    } else if (UserInfo.userType === "Tram" || UserInfo.userType === "Factory") {
        //truong tram
        url = `/history/error?From=${From}&To=${To}&stationId=${UserInfo.id}`
    }
    try {
        const response = await axios.get(`${API_URL}${url}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        console.warn(error);
        return null;
    }
}

//lấy chi tiết bình lỗi
export const getJarErrorDetails = async (idHistoryCylinder) => {
    try {
        const token = await getToken();
        const response = await axios.get(`${API_URL}/history/error/cylinder?idHistoryCylinder=${idHistoryCylinder}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        console.warn(error.response.data);
        return null;
    }
}

//trưởng trạm xác nhận bình lỗi
export const confirmationJarError = async (body) => {
    try {
        const token = await getToken();
        const response = await axios.put(`${API_URL}/history/error/cylinder/confirm`, body, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        console.warn(error.response.data);
        return null;
    }
}

//lấy danh sách các lỗi của bình
export const getJarError = async () => {
    try {
        const token = await getToken();
        const response = await axios.get(`${API_URL}/reason/showListReason`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        console.warn(error.response.data);
        return null;
    }
}

//lấy danh sách doanh thu theo khach hang
export const getRevenue = async (startDate, endDate) => {
    try {
        const token = await getToken();
        const response = await axios.get(`${API_URL}/statistics/revenue?startDate=${startDate}&endDate=${endDate}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        console.warn(error.response.data);
        return null;
    }
}

//lấy chi tiet don han hang tu danh sach doanh thu
export const getRevenueDetails = async (orderId) => {
    try {
        const token = await getToken();
        const response = await axios.get(`${API_URL}/statistics/order/shippingtype?orderId=${orderId}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        console.warn(error.response.data);
        return null;
    }
}

//khách hàng sửa ghi chú
export const updateNote = async (orderId, body) => {
    try {
        const token = await getToken();
        const response = await axios.put(`${API_URL}/orderGS/orderHeader?orderId=${orderId}`,
            body,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
        return response.data;
    } catch (error) {
        console.warn(error.response.data);
        return null;
    }
}
//lấy địa chỉ trạm theo khách hàng
export const getAddressStationClient = async (isChildOf) => {
    try {
        const token = await getToken();
        const response = await axios.post(`${API_URL}/user/getInforById`, { id: isChildOf }, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        console.warn(error.response.data);
        return null;
    }
}

//lấy trang thái đơn hàng
export const apiGetStatusOrder = async (orderId) => {
    try {
        const token = await getToken();
        const response = await axios.get(`${API_URL}/orderGS/status?orderId=${orderId}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        console.warn(error.response.data);
        return null;
    }
}