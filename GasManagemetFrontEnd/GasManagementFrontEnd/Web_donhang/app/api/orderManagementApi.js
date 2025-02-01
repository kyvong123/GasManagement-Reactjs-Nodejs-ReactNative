import axiosClient from "./axiosClient";
import getUserCookies from "getUserCookies";
import moment from "moment";
class OrderManagement {
  search = async (params) => {
    let data;
    let paramsObjectId;
    let station;
    var user_cookies = await getUserCookies();
    if (user_cookies.user.userRole === "SuperAdmin") {
      paramsObjectId = user_cookies.user.id;
    } else {
      paramsObjectId = user_cookies.user.id;
      station = user_cookies.user.isChildOf;
    }
    if (user_cookies) {
      try {
        let url = `/orderGS/Customers/getFromTo?objectId=${paramsObjectId}`;
        if (
          user_cookies.user.userType === "Tram" ||
          user_cookies.user.userType === "Factory"
        ) {
          url = `/orderGS/Supplier/getFromTo?userid=${paramsObjectId}&station=${station}`;
        }
        //roles.includes(user_cookies.user.userRole)
        else if (user_cookies.user.userType === "Tong_cong_ty") {
          url = `/orderGS/Supplier/getFromTo?userid=${paramsObjectId}`;
        }
        data = await axiosClient.get(url, {
          params,
          headers: {
            Authorization: "Bearer " + user_cookies.token,
          },
        });
      } catch (e) {
        console.log(e);
      }
      return data;
    } else {
      return "Invalid Token API";
    }
  };

  getUnseen = async (params) => {
    let data;
    let paramsObjectId;
    let station;
    var user_cookies = await getUserCookies();
    if (user_cookies.user.userRole === "SuperAdmin") {
      paramsObjectId = user_cookies.user.id;
    } else {
      paramsObjectId = user_cookies.user.id;
      station = user_cookies.user.isChildOf;
    }
    if (user_cookies) {
      try {
        let url = `/order/number-unseen?userid=${paramsObjectId}&objectId=${paramsObjectId}`;
        if (
          user_cookies.user.userType === "Tram" ||
          user_cookies.user.userType === "Factory"
        ) {
          url = `/order/number-unseen?userid=${paramsObjectId}&station=${station}`;
        }
        //roles.includes(user_cookies.user.userRole)
        else if (user_cookies.user.userType === "Tong_cong_ty") {
          url = `/order/number-unseen?userid=${paramsObjectId}`;
        }

        if (!params.From)
          params = {
            ...params,
            From: moment()
              .startOf("day")
              .toISOString(),
          };
        if (!params.To)
          params = {
            ...params,
            To: moment()
              .endOf("day")
              .toISOString(),
          };

        data = await axiosClient.get(url, {
          params,
          headers: {
            Authorization: "Bearer " + user_cookies.token,
          },
        });
      } catch (e) {
        console.log(e);
      }
      return data;
    } else {
      return "Invalid Token API";
    }
  }

  seenOrder = async (orderId) => {
    const user_cookies = await getUserCookies();

    if (user_cookies) {
      const userId = user_cookies.user.id;

      const url = 'order/seen';
      try {
        return await axiosClient.post(
          url,
          {
            userId,
            orderId,
          },
          {
            headers: {
              Authorization: "Bearer " + user_cookies.token,
            },
          }
        );
      }
      catch (e) {
        console.log(e);
      }
    } else {
      return "Invalid Token API";
    }
  }

  getAll = async () => {
    let data;
    let params;
    var user_cookies = await getUserCookies();
    console.log(user_cookies.user.userRole);
    if (
      user_cookies.user.userType === "Khach_hang" ||
      user_cookies.user.userType === "Agency" ||
      user_cookies.user.userType === "General"
    ) {
      params = user_cookies.user.id;
    } else {
      params = user_cookies.user.isChildOf;
    }
    if (user_cookies) {
      try {
        const roles = ["SuperAdmin", "Tong_cong_ty"];
        // khach hang
        let url = `/orderGS/getAllIfIdIsCustomer?objectId=${params}`;
        if (
          user_cookies.user.userType === "Tram" ||
          user_cookies.user.userType === "Factory"
        ) {
          // tram
          url = `/orderGS/getAllIfIdIsSupplier?objectId=${params}&userid=${user_cookies.user.id}`;
        }
        if (roles.includes(user_cookies.user.userType)) {
          // tong cong ty
          url = `/orderGS/getAllIfIdIsSupplier?userid=${user_cookies.user.id}`;
        }
        data = await axiosClient.get(url, {
          headers: { Authorization: "Bearer " + user_cookies.token },
        });
      } catch (e) {
        console.log(e);
      }
      return data;
    } else {
      return "Invalid Token API";
    }
  };
  getOrderByType = async (type) => {
    let data;
    var user_cookies = await getUserCookies();

    if (user_cookies) {
      try {
        if (type !== "all") {
          data = await axiosClient.get(
            `/orderGS/getAllIfIdIsCustomer?type=${type}`,
            {
              headers: { Authorization: "Bearer " + user_cookies.token },
            }
          );
        }
        // else {
        //     data = await axiosClient.get(`/orderGS/getAllIfIdIsCustomer`, {
        //         headers: { Authorization: "Bearer " + user_cookies.token },
        //     });
        // }
      } catch (e) {
        console.log(e);
      }
      return data;
    } else {
      return "Invalid Token API";
    }
  };
  getValves = async () => {
    let data;
    let user_cookies = await getUserCookies();
    if (user_cookies) {
      try {
        let url = "/valve/showListValve";
        data = await axiosClient.get(url, {
          headers: { Authorization: "Bearer " + user_cookies.token },
        });

        return data;
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("invalid token API");
    }
  };
  getColors = async () => {
    let data;
    let user_cookies = await getUserCookies();
    if (user_cookies) {
      try {
        let url = "/colorGas";
        data = await axiosClient.get(url, {
          headers: { Authorization: "Bearer " + user_cookies.token },
        });
      } catch (error) {
        console.log(error);
      }
      return data;
    } else {
      console.log("invalid token API");
    }
  };
  getMenuFacture = async () => {
    let data;
    let user_cookies = await getUserCookies();
    if (user_cookies) {
      try {
        let url = "manufacture/ShowList";
        data = await axiosClient.get(url, {
          headers: { Authorization: "Bearer " + user_cookies.token },
        });
      } catch (error) {
        console.log(error);
      }

      return data;
    } else {
      console.log("invalid token API");
    }
  };
  getCategory = async () => {
    let data;
    let user_cookies = await getUserCookies();
    if (user_cookies) {
      try {
        let url = "/categoryCylinder/getAll";
        data = await axiosClient.get(url, {
          headers: { Authorization: "Bearer " + user_cookies.token },
        });
      } catch (error) {
        console.log(error);
      }
      return data;
    } else {
      console.log("invalid token API");
    }
  };
  getLocation = async () => {
    let data = { address: [], area: "" };
    // let params;
    let user_cookies = await getUserCookies();

    if (user_cookies) {
      try {
        let url = `/orderGS/showAddressUser?objectId=${user_cookies.user.id}`;
        const result = await axiosClient.get(url, {
          headers: { Authorization: "Bearer " + user_cookies.token },
        });
        if (result.data[0].userRole === "SuperAdmin") {
          data.address.push(result.data[0].address);
        } else {
          data.address.push(result.data[0].address);
          data.address.push(result.data[0].isChildOf.address);
        }
        if (
          result.data[0].userType === "Agency" ||
          result.data[0].userType === "General"
        ) {
          data.area = "625e74ba76fcc80f2c2504c2";
        } else {
          data.area = result.data[0].area.id;
        }
      } catch (error) {
        console.log("lỗi lỗi lỗi");
        console.log(error);
      }

      return data;
    } else {
      console.log("invalid token API");
    }
  };
  getStation = async () => {
    try {
      let data;
      let user_cookies = await getUserCookies();
      if (user_cookies) {
        let url = "/orderGS/getStation";
        data = await axiosClient.get(url, {
          headers: { Authorization: "Bearer " + user_cookies.token },
        });
        return data;
      } else {
        console.log("Invalid token API");
      }
    } catch (error) {
      console.log(error);
    }
  };
  // get area
  getArea = async (params) => {
    try {
      let data;
      let user_cookies = await getUserCookies();
      if (user_cookies) {
        let url = `area?StationID=${params}`;
        data = await axiosClient.get(url, {
          headers: { Authorization: "Bearer " + user_cookies.token },
        });
        return data;
      } else {
        console.log("Invalid token API");
      }
    } catch (error) {
      console.log(error);
    }
  };
  getTypeCustomer = async (params) => {
    try {
      let data;
      let user_cookies = await getUserCookies();
      if (user_cookies) {
        let url = "/orderGS/getTypeCustomers3";
        data = await axiosClient.get(url, {
          params,
          headers: { Authorization: "Bearer " + user_cookies.token },
        });
        return data;
      } else {
        console.log("Invalid Token API");
      }
    } catch (error) {
      console.log("Error");
    }
  };
  getAddress = async (params) => {
    try {
      let data;
      let user_cookies = await getUserCookies();
      if (user_cookies) {
        let url = `/orderGS/showAddressUser?objectId=${params}`;
        data = await axiosClient.get(url, {
          headers: { Authorization: "Bearer " + user_cookies.token },
        });
        return data;
      } else {
        console.log("Invalid token API");
      }
    } catch (error) {
      console.log(error);
    }
  };
  createOrder = async (params) => {
    try {
      let data;
      console.log(params);
      let user_cookies = await getUserCookies();
      if (user_cookies) {
        let url = "/orderGS/createOrderGS";
        data = await axiosClient.post(url, params, {
          headers: { Authorization: "Bearer " + user_cookies.token },
        });
        return data;
      } else {
        console.log("Invalid token API");
      }
    } catch (error) {
      console.log(error);
    }
  };
  confirmOrder = async (params, note) => {
    try {
      let data;
      let user_cookies = await getUserCookies();
      if (user_cookies) {
        let url = `/orderGS/acpOrder?id=${params}&userid=${user_cookies.user.id}`;
        data = await axiosClient.put(url, note, {
          headers: { Authorization: "Bearer " + user_cookies.token },
        });
        return data;
      } else {
        console.log("Invalid token API");
      }
    } catch (error) {
      console.log(error);
    }
  };

  sureOrder = async (params, note) => {
    try {
      let user_cookies = await getUserCookies();
      if(!user_cookies){
        console.log("Invalid token API");
        return;
      }
      const url = `/orderGS/acpOrderdieudotramcomplete`;
      const res = await axiosClient.put(url, note, {
        headers: { 
          Authorization: "Bearer " + user_cookies.token 
        },
        params: {
          id: params,
          userid: user_cookies.user.id,
        },
      });
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  sendOrder = async (params, note) => {
    try {
      let user_cookies = await getUserCookies();
      if(!user_cookies){
        console.log("Invalid token API");
        return;
      }
      const url = `/orderGS/acpOrderdieudotramguicomplete`;
      const res = await axiosClient.put(url, note, {
        headers: { 
          Authorization: "Bearer " + user_cookies.token 
        },
        params: {
          id: params,
          userid: user_cookies.user.id,
        },
      });
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  detailOrder = async (params) => {
    try {
      let data;
      let user_cookies = await getUserCookies();
      if (user_cookies) {
        // console.log("user token",user_cookies.token)
        let url = `/orderDetail/getOrderDetailByOrderGSId?id=${params}`;
        data = await axiosClient.get(url, {
          headers: { Authorization: "Bearer " + user_cookies.token },
        });
        // console.log("data test",data)
        return data;
      } else {
        console.log("Invalid token API");
      }
    } catch (error) {
      console.log(error);
    }
  };
  detailHistoryOrder = async (params) => {
    try {
      let data;
      let user_cookies = await getUserCookies();
      if (user_cookies) {
        // console.log("user token",user_cookies.token)
        let url = `/history/showList?id=${params}`;
        data = await axiosClient.get(url, {
          headers: { Authorization: "Bearer " + user_cookies.token },
        });
        // console.log("data test",data)
        return data;
      } else {
        console.log("Invalid token API");
      }
    } catch (error) {
      console.log(error);
    }
  };
  detailHistoryConfirm = async (params, action) => {
    try {
      let data;
      let user_cookies = await getUserCookies();
      if (user_cookies) {
        let url = `history/getOrderGSConfirmationHistory?id=${params}&action=${action}$`;
        data = await axiosClient.get(url, {
          headers: { Authorization: "Bearer " + user_cookies.token },
        });
        // console.log("data test",data)
        return data;
      } else {
        console.log("Invalid token API");
      }
    } catch (error) {
      console.log(error);
    }
  };
  cancelOrderOne = async (params, note) => {
    try {
      let data;
      let user_cookies = await getUserCookies();
      if (user_cookies) {
        let url = `/orderGS/notacpOrder?id=${params}&userid=${user_cookies.user.id}`;
        data = await axiosClient.put(url, note, {
          headers: { Authorization: "Bearer " + user_cookies.token },
        });
        return data;
      } else {
        console.log("Invalid token API");
      }
    } catch (error) {
      console.log(error);
    }
  };
  customersRejectOrder = async (params, note) => {
    try {
      let data;
      let user_cookies = await getUserCookies();
      if (user_cookies) {
        let url = `/orderGS/notacpOrderKH?id=${params}&userid=${user_cookies.user.id}`;
        data = await axiosClient.put(url, note, {
          headers: { Authorization: "Bearer " + user_cookies.token },
        });
        console.log("data api",data)
        return data;
      } else {
        console.log("Invalid token API");
      }
    } catch (error) {
      console.warn(error);
    }
  };
  customerConfirmOrder = async (params, note) => {
    try {
      let data;
      let user_cookies = await getUserCookies();
      if (user_cookies) {
        let url = `/orderGS/acpOrderkhachhangcomplete?id=${params}&userid=${user_cookies.user.id}`;
        data = await axiosClient.put(url, note, {
          headers: { Authorization: "Bearer " + user_cookies.token },
        });
        return data;
      } else {
        console.log("Invalid token API");
      }
    } catch (error) {
      console.log(error);
    }
  };
  getOrderConfirmHistory = async (params) => {
    try {
      let data;
      let user_cookies = await getUserCookies();
      if (user_cookies) {
        let url = `history/getOrderGSConfirmationHistory?id=${params}&action=KHONG_DUYET`;
        data = await axiosClient.get(url, {
          headers: { Authorization: "Bearer " + user_cookies.token },
        });
        // console.log("data api",data)
        return data;
      } else {
        console.log("Invalid token API");
      }
    } catch (error) {
      console.log(error);
    }
  };
  updateOrder = async (params, values) => {
    try {
      let data;
      let user_cookies = await getUserCookies();
      if (user_cookies) {
        let url = "orderGS/updateById";
        data = await axiosClient.put(url, values, {
          params,
          headers: { Authorization: "Bearer " + user_cookies.token },
        });
        return data;
      } else {
        console.log("Invalid token API");
      }
    } catch (error) {
      console.log(error);
    }
  };
  getHistoryComfirm = async (id) => {
    try {
      let data;
      let user_cookies = await getUserCookies();
      if (user_cookies) {
        data = await axiosClient.get(
          `/history/getOrderGSConfirmationHistoryall?id=${id}`,
          { headers: { Authorization: "Bearer " + user_cookies.token } }
        );
        return data;
      } else {
        console.log("Invalid token API");
      }
    } catch (error) {
      console.log(error);
    }
  };
  getDriverInfor = async (id) => {
    try {
      let data;
      let user_cookies = await getUserCookies();
      if (user_cookies) {
        data = await axiosClient.get(`/history/showList?id=${id}`, {
          headers: { Authorization: "Bearer " + user_cookies.token },
        });
        return data;
      } else {
        console.log("Invalid token API");
      }
    } catch (error) {
      console.log(error);
    }
  };
  getShippingInfor = async (id) => {
    try {
      let data;
      let user_cookies = await getUserCookies();
      if (user_cookies) {
        data = await axiosClient.get(
          `/history/inforHistoryCylinder?isShipOf=${id}`,
          { headers: { Authorization: "Bearer " + user_cookies.token } }
        );
        return data;
      } else {
        console.log("Invalid token API");
      }
    } catch (error) {
      console.log(error);
    }
  };
}

const orderManagement = new OrderManagement();
export default orderManagement;
