const { client, redis } = require('../databases/init.redis');
// const { promisify } = require("util")


// const REDIS_GET = promisify(client.get).bind(client);
// const REDIS_SET = promisify(client.set).bind(client);
// const REDIS_LRANGE = promisify(client.lrange).bind(client);


module.exports = {
    ftCreatePromise: async (index, schema, option) => {
        try {
            return (await client).ft.create(index, schema, option);
        } catch (error) {
            console.log(`[FT-CREATE] ${error}`);
        }
    },
    ftSearchPromise: async (index, query, option) => {
        try {
            return (await client).ft.search(index, query, option);
        } catch (error) {
            console.log(`[FT-SEARCH] ${error}`);
        }
    },
    hSetPromise: async (key, value) => {
        try {
            return (await client).hSet(key, value);
        } catch (error) {
            console.log(`[HSET] ${error}`);
        }
    },
    dbSizePromise: async () => {
        try {
            return (await client).dbSize();
        } catch (error) {
            console.log(`[DBSIZE] ${error}`);
        }
    },
    sendCommandPromise: async (command) => {
        try {
            return (await client).sendCommand([...command]);
        } catch (error) {
            console.log(`[SEND-COMMAND] ${error}`);
        }
    },
    isConnectRedis: async () => {
        try {
            const _client = await client
            if (!_client) {
                return false
            }
            const ping = _client.ping()
            return ping.then((res) => {
                if (res === "PONG") {
                    return true;
                } else {
                    return false
                }
            })
        } catch (error) {
            return false
        }
    },


    // REDIS_GET,
    // REDIS_SET,
    // REDIS_LRANGE
}