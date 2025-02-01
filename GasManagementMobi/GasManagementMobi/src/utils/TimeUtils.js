import moment from 'moment'

const isSameDate = (date) => {
	let currentTime = moment()
	let passDate = moment(date, 'DD/MM/YYYY')
	return currentTime.diff(passDate, 'days', true) < 1
}

const getCurrentDate = () => {
	return moment()
}

const getStringFormatedDate = (date) => {
	return date = date ? moment(date).format('HH:mm:ss DD/MM/YYYY') : moment().format('HH:mm:ss DD/MM/YYYY')
}

const getStringForRecentDeal = (date) => {
	return date = date ? moment(date).format('DD/MM/YYYY') : moment().format('DD/MM/YYYY')
}

export default {
	isSameDate,
	getCurrentDate,
	getStringFormatedDate,
	getStringForRecentDeal
}
