
let cylinderAction = undefined
let typeExport = undefined
let arrCylinder = undefined
let typeCamera = undefined
const getDataCyclinder = () => {
	return cylinderAction
}
const setDataCyclinder = (data) => {
	cylinderAction =  data
}

const setTypeCyclinder = (data) => {
	typeExport =  data
}
const getTypeCyclinder = () => {
	return typeExport
}
const setArrCyclinder = (data) => {
	arrCylinder = data
}
const getArrCyclinder = () => {
	return arrCylinder
}
const setTypeCamera = (data) => {
	typeCamera = data
}
const getTypeCamera = () => {
	return typeCamera
}
export default {
	getDataCyclinder,
	setDataCyclinder,
	setTypeCyclinder,
	getTypeCyclinder,
	setArrCyclinder,
	getArrCyclinder,
	setTypeCamera,
	getTypeCamera,
}
