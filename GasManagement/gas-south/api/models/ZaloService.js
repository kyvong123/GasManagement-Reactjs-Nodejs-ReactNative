/**
 * ZaloService.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    appId: {
      type: 'string'
    },
    accessToken: {
      type: 'string',
    },
    refreshToken: {
      type: 'string',
    },

    expiredAccessToken: {
      type: 'number',
    },
    expiredRefreshToken: {
      type: 'number',
    },
    authorizationExpired: {
      type: "boolean",
      defaultsTo: true,
    }
  },

};

