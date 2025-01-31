const manufactureApi = {
    getExportPlace: {
        url: (form) => `/exportPlace?owner=${form.owner}`,
    },
}
export default manufactureApi
