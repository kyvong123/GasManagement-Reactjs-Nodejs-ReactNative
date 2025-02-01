const statistics = {
  getStatistics: {
    url: (form) => {
      const manufactureId = form.manufactureId ? `&manufacture=${form.manufactureId}` : ''
      return `/imex/getStatistics?statisticalType=${form.statisticalType}&target=${form.target}&startDate=${form.startDate}&endDate=${form.endDate}&typesOfChildren[]=${form.typesOfChildren}&actions[]=CREATED_CYLINDER&actions[]=OUT_CYLINDER&actions[]=TURN_BACK_CYLINDER&actions[]=IMPORT_CYLINDER&actions[]=IMPORT_CELL_CYLINDER${manufactureId}`
    }
  },
}

export default statistics
