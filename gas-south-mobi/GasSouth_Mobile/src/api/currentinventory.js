const currentInventory = {
  getCurrentInventory: {
    url: (form) => {
      return `/imex/getCurrentInventory?target=${form.target}&endDate=${form.endDate}&statisticalType=${form.statisticalType}&typesOfChildren[]=${form.typesOfChildren}`
    }
  }
}
export default currentInventory