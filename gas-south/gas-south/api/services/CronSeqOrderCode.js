let cron = require('node-cron');

let resetNumberOrderCode = cron.schedule('0 0 1 * *', async () => {
    try {
        console.log("RESET_ORDER_CODE_MONTHLY", Date())
        await SequenceOrderCode.update({})
            .set({ number: 1 });
    } catch (error) {
        // Ghi Log
        console.log('catch: ', error.message);

        await LogCron.create({
            type: 'RESET_ORDER_CODE_MONTHLY',
            note: 'Thiết lập lại số thứ tự của mã đơn hàng trở về 1, vào hàng tháng',
            status: 'ERROR_CRON',
            error: JSON.stringify(error),
            error_message: error.message,
        })
    }
}, {
    scheduled: false
});

// Update code lưu lại seq theo từng năm và tháng
// Nên không cần chạy cron này nữa
// resetNumberOrderCode.start();