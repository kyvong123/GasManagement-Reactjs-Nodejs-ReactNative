// var redis = require("redis");
// // const { session } = require("../../config/env/production")
// const { session } = require("../../config/env/development")
// const client = redis.createClient({
//     url: session.url,
// });

// module.exports = {
//     connectRedis: async function () {
//         try {
//             console.warn('connecting redis ...')
//             client.on('error', err => console.log('Redis Client Error', err));
//             await client.connect();
//             console.warn('Redis connected')
//             return true
//         } catch (error) {
//             console.warn('Redis connect failed')
//             console.warn('Redis', error)
//             return false
//         }

//     },
//     rcGet: async function (key) {
//         return await client.get(key)
//     },
//     rcSet: async function (key, value) {
//         await client.set(key, value);
//     },
//     query: async function () {
//         return client
//     },
// }