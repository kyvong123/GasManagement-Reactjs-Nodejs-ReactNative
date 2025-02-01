const getUserTransactionData = (oldForm) => {
	const currentTime = new Date()
	let today = getTodayText(currentTime)
	const isCurrentTimeHiger = currentTime.getTime() > oldForm.millisecond
	const isToday =  (oldForm.date && isCurrentTimeHiger && oldForm.date == today)
	let form = {
		date: isToday ? oldForm.date : today,
		millisecond: isToday ? oldForm.millisecond : currentTime.getTime(),
		transaction: isToday ? oldForm.transaction + 1 : 0
	}
	
	return form
}

const getTodayText = (currentTime) => {	
	let dd = currentTime.getDate()
	let mm = currentTime.getMonth() + 1
	let yyyy = currentTime.getFullYear()
	if (dd < 10) {
		dd = '0' + dd
	}
	if (mm < 10) {
		mm = '0' + mm
	}
	let today = dd + '/' + mm + '/' + yyyy
	return today
}

export default {
	getUserTransactionData,
	getTodayText
}