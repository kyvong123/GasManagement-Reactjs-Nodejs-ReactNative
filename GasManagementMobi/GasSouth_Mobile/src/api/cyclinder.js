const cyclinderApi = {
    getCyclinderFromList: {
        url: (form) => `/manufacture/find?cylinder_serial=${JSON.stringify(form.cylinder_serial)}&type=${form.type}`,
    },
    reportCyclinder: {
        url: () => `/report`,
    },
    updateCylinders: {
        url: () => `/history/importCylinder`,
    },
    getDuplicateCyclinder: {
        url: () => `/cylinder/checkExport`,
    },
    importDupCylinder: {
        url: () => `/cylinder/importDupCylinder`,
    }
}
export default cyclinderApi