const exportApi = {
  getExport: {
    url: (form) => {
      const endUrl = form.isAll ? `&typesOfChildren[]=Region` : (form.statisticalType == 'byItsChildren' ? `&typesOfChildren[]=ALL` : '')
      const search = form.isAll ? '' : `&searchs[0][type]=WEIGHT&searchs[0][contents][0]=ALL`
      const isType = form.isUserTyper && search != '' ? '&typesOfChildren[]=ALL' : '&searchs[1][type]=CLASS&searchs[1][contents][0]=New&searchs[1][contents][1]=Old'
      return `/imex/getExport?target=${form.target}&action=${form.action}&startDate=${form.startDate}&endDate=${form.endDate}&statisticalType=${form.statisticalType}${isType}${search}${endUrl}`
    }
  }
}
export default exportApi