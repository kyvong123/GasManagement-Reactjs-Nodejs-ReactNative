const reportApi = {
    getReport: {
        url: () => `/report/reportCylinder`,
    },
    getReportChart: {
        url: (form) => `/report/getInventoryInfo?target_id=${form.target_id}&factory_id=${form.factory_id}`,
    },
    getReportChartBar: {
        url: () => `/report/getChildAndNumberImportByDateTime`,
    },

}
export default reportApi
