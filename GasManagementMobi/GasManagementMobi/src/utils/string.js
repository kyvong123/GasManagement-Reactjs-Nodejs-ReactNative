
export function validateEmail(email) {
	if (email != '') {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		return re.test(email)
	}
	return false
}

export function checkNumeric(value) {
	var intRegex = /^\d+$/
	var floatRegex = /^((\d+(\.\d *)?)|((\d*\.)?\d+))$/
	if (intRegex.test(value) || floatRegex.test(value)) {
		return true
	}
	return false
}

export function checkValidDate(value) {
	// First check for the pattern
	if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value))
		return false

	// Parse the date parts to integers
	var parts = value.split('/')
	var day = parseInt(parts[1], 10)
	var month = parseInt(parts[0], 10)
	var year = parseInt(parts[2], 10)

	// Check the ranges of month and year
	if (year < 1000 || year > 3000 || month == 0 || month > 12)
		return false

	var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

	// Adjust for leap years
	if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
		monthLength[1] = 29

	// Check the range of the day
	return day > 0 && day <= monthLength[month - 1]
}

export function formatPhoneNumber(value) {
	let phone = value.replace(/(\d{3})(\d{3})(\d{4})/g, '$1 $2 $3')
	return phone
}

export function trim(value) {
	let trimed = value.replace(/ /g,'')
	return trimed
}

export function checkPhoneNumber(value) {
	return /^\d{10}$/.test(trim(value))
}
const checkUnavailable = (value) => {
	return value === undefined || value == null
}

const isEmpty = (obj) => {
	for(var key in obj) {
		if(obj.hasOwnProperty(key))
			return false;
	}
	return true;
}

export function formatUnit(key) {
	switch (key) {
		case 'CO':
		case 'NO':
		case 'NOx':
		case 'SO2':
		case 'PM':
		case 'HF':
			return 'mg/Nm3'
		case 'TSP':
			return 'mg/m3'
		case 'FLOW': 
			return 'm3/h'
		case 'Temp': 
			return 'oC'
		case 'O2':
			return '%'
		case 'TSS': 
		case 'Clo':
		case 'TN':
		case 'COD':
			return 'mg/l'
		default:
			return ''
	}
}
