const regionAPI = {
    getRegionPlace: {
        url: (form) => `/regionCompany/getListRegion?id=${form.target_id}`,
    },
}
export default regionAPI
