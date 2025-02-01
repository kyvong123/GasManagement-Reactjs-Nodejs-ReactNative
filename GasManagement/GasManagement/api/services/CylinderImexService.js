
const moment = require('moment');
module.exports = {

    // Xuất Excels chi tiết bình trong báo cáo thống kê
    getDataForDetailCylinderImex: async function (objectId, startDate, endDate, condition, typeImex, flow, categoryID) {
        try {
            //Tìm theo objectId và ngày
            const formatDate = (date) => {
                // ham check string co phai ISOdate ko?
                const isIsoDate = (str) => {
                    if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
                    const d = new Date(str);
                    return d instanceof Date && !isNaN(d.getTime()) && d.toISOString() === str; // valid date 
                }
                if (isIsoDate(date)) {
                    return moment(date).format('DD/MM/YYYY HH:mm:ss')
                }
                return date
            }

            if (objectId && startDate && endDate && condition) {

                if (flow && typeof flow !== 'undefined' && typeof flow !== null) {

                    if (categoryID && typeof categoryID !== 'undefined' && typeof categoryID !== null) {

                        const _cylindersImex = await CylinderImex.find({

                            objectId: objectId,
                            category: categoryID,
                            typeImex: typeImex,
                            flow: flow,
                            condition: condition,
                            createdAt: {
                                '>=': startDate,
                                '<=': endDate
                            },
                            isDeleted: false,
                        }).populate('history')
                        const result_Cylinders = [];
                        await Promise.all(_cylindersImex.map(async cylinder => {
                            let customerName = {}
                            if (typeImex === 'OUT') {
                                let _customerName = ''
                                const historyRecord = await History.findOne({ _id: cylinder.history.id }).populate('toArray')

                                if (historyRecord.toArray.length >= 2) {
                                    _customerName = historyRecord.toArray[0].name

                                    for (let i = 1; i < historyRecord.toArray.length; i++) {
                                        _customerName = _customerName + ", " + historyRecord.toArray[i].name
                                    }
                                }
                                else if (historyRecord.toArray.length >= 1) {
                                    _customerName = historyRecord.toArray[0].name
                                }
                                customerName = { customerName: _customerName }
                            }


                            const _cylinder = await Cylinder.findOne({
                                _id: cylinder.cylinder,
                                isDeleted: false
                            })
                                .populate('manufacture')
                                .populate('category')
                            const data = {
                                id: _cylinder.id,
                                serial: _cylinder.serial,
                                color: _cylinder.color,
                                valve: _cylinder.valve,
                                weight: _cylinder.weight,
                                checkedDate: formatDate(_cylinder.checkedDate),
                                manufacture: _cylinder.manufacture.name,
                                category: _cylinder.category.name,
                                productionDate: _cylinder.productionDate,
                                productionName: _cylinder.productionName,
                                embossLetters: _cylinder.embossLetters,
                                ...customerName
                            };

                            result_Cylinders.push(data);
                        }))

                        sortArrayDetail(result_Cylinders);

                        return result_Cylinders;

                    } else {
                        const _cylindersImex = await CylinderImex.find({

                            objectId: objectId,
                            typeImex: typeImex,
                            flow: flow,
                            condition: condition,
                            createdAt: {
                                '>=': startDate,
                                '<=': endDate
                            },
                            isDeleted: false,
                        }).populate('history')

                        const result_Cylinders = [];
                        await Promise.all(_cylindersImex.map(async cylinder => {
                            let customerName = {}
                            if (typeImex === 'OUT') {
                                let _customerName = ''
                                const historyRecord = await History.findOne({ _id: cylinder.history.id }).populate('toArray')

                                if (historyRecord.toArray.length >= 2) {
                                    _customerName = historyRecord.toArray[0].name

                                    for (let i = 1; i < historyRecord.toArray.length; i++) {
                                        _customerName = _customerName + ", " + historyRecord.toArray[i].name
                                    }
                                }
                                else if (historyRecord.toArray.length >= 1) {
                                    _customerName = historyRecord.toArray[0].name
                                }
                                customerName = { customerName: _customerName }
                            }
                            const _cylinder = await Cylinder.findOne({
                                _id: cylinder.cylinder,
                                isDeleted: false
                            })
                                .populate('manufacture')
                                .populate('category')

                            const data = {
                                id: _cylinder.id,
                                serial: _cylinder.serial,
                                color: _cylinder.color,
                                valve: _cylinder.valve,
                                weight: _cylinder.weight,
                                checkedDate: formatDate(_cylinder.checkedDate),
                                manufacture: _cylinder.manufacture.name,
                                category: _cylinder.category.name,
                                productionDate: _cylinder.productionDate,
                                productionName: _cylinder.productionName,
                                embossLetters: _cylinder.embossLetters,
                                ...customerName
                            };

                            result_Cylinders.push(data);
                        }))

                        sortArrayDetail(result_Cylinders);

                        return result_Cylinders;

                    }


                } else {
                    if (categoryID && typeof categoryID !== 'undefined' && typeof categoryID !== null) {
                        const _cylindersImex_IN = await CylinderImex.find({

                            objectId: objectId,
                            category: categoryID,
                            typeImex: 'IN',
                            condition: condition,
                            createdAt: {
                                '>=': new Date(0).toISOString(),
                                '<=': endDate
                            },
                            isDeleted: false,
                        })
                        const _cylindersImex_OUT = await CylinderImex.find({

                            objectId: objectId,
                            category: categoryID,
                            typeImex: 'OUT',
                            condition: condition,
                            createdAt: {
                                '>=': new Date(0).toISOString(),
                                '<=': endDate
                            },
                            isDeleted: false,
                        })

                        const result_Inventory = [];
                        for (let i = 0; i < _cylindersImex_IN.length; i++) {
                            let temp = 0;
                            for (let j = 0; j < _cylindersImex_OUT.length; j++) {
                                if (_cylindersImex_IN[i].cylinder === _cylindersImex_OUT[j].cylinder) {
                                    temp++;
                                    break;
                                }
                            }
                            if (temp === 0) {
                                result_Inventory.push(_cylindersImex_IN[i]);
                            }
                        }
                        const result_Cylinders = [];
                        await Promise.all(result_Inventory.map(async cylinder => {
                            const _cylinder = await Cylinder.findOne({
                                _id: cylinder.cylinder,
                                isDeleted: false
                            })
                                .populate('manufacture')
                                .populate('category')
                            const data = {
                                id: _cylinder.id,
                                serial: _cylinder.serial,
                                color: _cylinder.color,
                                valve: _cylinder.valve,
                                weight: _cylinder.weight,
                                checkedDate: formatDate(_cylinder.checkedDate),
                                manufacture: _cylinder.manufacture.name,
                                category: _cylinder.category.name,
                                productionDate: _cylinder.productionDate,
                                productionName: _cylinder.productionName,
                                embossLetters: _cylinder.embossLetters,
                            };

                            result_Cylinders.push(data);
                        }))

                        sortArrayDetail(result_Cylinders);


                        return result_Cylinders;

                    } else {
                        const _cylindersImex_IN = await CylinderImex.find({

                            objectId: objectId,
                            // category: categoryID,
                            typeImex: 'IN',
                            condition: condition,
                            createdAt: {
                                '>=': new Date(0).toISOString(),
                                '<=': endDate
                            },
                            isDeleted: false,
                        })

                        const _cylindersImex_OUT = await CylinderImex.find({

                            objectId: objectId,
                            // category: categoryID,
                            typeImex: 'OUT',
                            condition: condition,
                            createdAt: {
                                '>=': new Date(0).toISOString(),
                                '<=': endDate
                            },
                            isDeleted: false,
                        })

                        const result_Inventory = [];
                        for (let i = 0; i < _cylindersImex_IN.length; i++) {
                            let temp = 0;
                            for (let j = 0; j < _cylindersImex_OUT.length; j++) {
                                if (_cylindersImex_IN[i].cylinder === _cylindersImex_OUT[j].cylinder) {
                                    temp++;
                                    break;
                                }
                            }
                            if (temp === 0) {
                                result_Inventory.push(_cylindersImex_IN[i]);
                            }
                        }

                        const result_Cylinders = [];
                        await Promise.all(result_Inventory.map(async cylinder => {
                            const _cylinder = await Cylinder.findOne({
                                _id: cylinder.cylinder,
                                isDeleted: false
                            })
                                .populate('manufacture')
                                .populate('category')

                            const data = {
                                id: _cylinder.id,
                                serial: _cylinder.serial,
                                color: _cylinder.color,
                                valve: _cylinder.valve,
                                weight: _cylinder.weight,
                                checkedDate: formatDate(_cylinder.checkedDate),
                                manufacture: _cylinder.manufacture.name,
                                category: _cylinder.category.name,
                                productionDate: _cylinder.productionDate,
                                productionName: _cylinder.productionName,
                                embossLetters: _cylinder.embossLetters,
                            };

                            result_Cylinders.push(data);
                        }))

                        sortArrayDetail(result_Cylinders);


                        return result_Cylinders;

                    }
                }
            } else {
                return -1;
            }
        } catch (error) {
            throw error;
        }
    },

}

// Dùng cho detailCylindersImex
async function sortArrayDetail(array) {
    array.sort(function (a, b) {
        var nameA = a.serial.toUpperCase(); // bỏ qua hoa thường
        var nameB = b.serial.toUpperCase(); // bỏ qua hoa thường
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }

        // name trùng nhau
        return 0;
    });
}