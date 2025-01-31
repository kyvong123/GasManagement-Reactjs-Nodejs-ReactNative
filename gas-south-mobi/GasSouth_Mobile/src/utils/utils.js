import lodash from 'lodash'

const isNullorUndefined = (object) => {
    return lodash.isNil(object) || object == undefined || typeof(object) == 'undefined'
}

const objectToArray = (object, exceptKey = '') => {
    let array = []
    Object.keys(object).map(key => {
        if(key !== exceptKey) {
            let item = {
                ...object[key],
            }
           return  array.push(item)
       }
    })
    return array
}

export default {
    isNullorUndefined,
    objectToArray
}