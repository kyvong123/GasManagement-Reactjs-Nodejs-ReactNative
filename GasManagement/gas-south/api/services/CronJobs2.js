let cron = require('node-cron');
const moment = require('moment');
const LogType = require("../constants/LogType");

// Giữ lại số liệu tồn kho sang ngày hôm sau
// Sử dụng cho thống kê mới StatisticVer2

const preserveInventoryStatistics = async function () {
    try {
        // TEST DEV
        // const currentDate = moment('2023-12-29 00:00:00', 'YYYY-MM-DD hh:mm:ss')
        // PRODUCTION
        const currentDate = moment();

        const _date = currentDate.format('MM/DD/YYYY');

        const startDate = moment(_date, 'MM/DD/YYYY').subtract(1, 'days').startOf('day').toISOString();
        // const endDate = moment(_date, 'MM/DD/YYYY').subtract(1, 'days').endOf('day').toISOString();

        const db = await StatisticVer2.getDatastore().manager;
        const inventoryData = await db.collection("statisticver2").find(
            { "startDate": startDate, "inventoryCylinder": { $exists: true } },
            {
                "_id": 0,
                "objectId": 1,
                "startDate": 1,
                "endDate": 1,
                "cylinderTypeId": 1,
                "manufactureId": 1,
                "inventoryCylinder": 1,
                "inventoryNewCylinder": 1,
                "inventoryOldCylinder": 1,
            }
        ).toArray();

        if (inventoryData.length > 0) {
            await Promise.all(inventoryData.map(async _data => {
                await db.collection("statisticver2").insertOne({
                    "objectId": _data.objectId,
                    "startDate": moment(_data.startDate).add(1, "day").toISOString(),
                    "endDate": moment(_data.endDate).add(1, "day").toISOString(),
                    "cylinderTypeId": _data.cylinderTypeId,
                    "manufactureId": _data.manufactureId,
                    "inventoryCylinder": _data.inventoryCylinder,
                    "inventoryNewCylinder": _data.inventoryNewCylinder,
                    "inventoryOldCylinder": _data.inventoryOldCylinder,
                })
            }))
        }


    } catch (error) {
        console.log('CATCH: ', error.message);

        await Log.create({
            type: LogType.PRESERVE_INVENTORY_STATISTICS,
            content: error.message,
            status: false,
        });
    }
}

// TEST DEV
// cron.schedule('38 * * * *', async () => {
//     console.log('running a task every minute ' + Date());

//     await preserveInventoryStatistics();
// });

// PRODUCTION
cron.schedule('0 0 * * *', async () => {
    console.log('running a task every day ' + Date());

    await preserveInventoryStatistics();
}, {
    scheduled: true,
    timezone: "Asia/Bangkok"
});
