const allshippingapi = {
    getAllSippingFromList: {
        url: (form) => `/shippingorder/getAllShippingOrderINIT?userId=${form.userid}`,
    },
    getAllSippingTankFromList: {
        url: (form) => `/ExportOrder/getAllExportOrderINIT?userId=${form.userid}`,
    },
    getAllSippingDetailFromList: {
        url: (form) => `/shippingorderdetail/getDetailOfShippingOrder?shippingOrderID=${form.shippingorderId}`,
    },
    getAllSippingTankDetailFromList: {
        url: (form) => `/ExportOrder/getDetailOfExportOrder?exportOrderID=${form.exportOrderID}`,
    },
    getDriverLocationFromList:{
    url: (form) => `/shippingorderlocation/getLocationByOrderShippingID?orderShippingID=${form.orderShippingID}`,
 
    
}
}
export default allshippingapi

