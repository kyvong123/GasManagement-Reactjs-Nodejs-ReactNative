/**
 * ZaloServiceController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const moment = require("moment");
const btoa = require('btoa')
const fetch = require('node-fetch')

const USER_TYPE = require("../constants/UserTypes");
const USER_ROLE = require("../constants/UserRoles");
const appId_GS = '3243302074708367479' //  GScustom app
const secret_key_GS = 'GUNIQ4906TFTv7Pe3IFY' //  GScustom app
module.exports = {
  // Get Authorization Code
  getAuthorization: async function (req, res) {
    if (Object.keys(req.query).length === 0) {
      return res.badRequest(Utils.jsonErr("Empty query"));
    }

    const {
      oa_id, // Id
      code // Authorization Code
    } = req.query;
    if (!oa_id) {
      return res.badRequest(Utils.jsonErr("oa_id is missing"));
    }
    if (!code) {
      return res.badRequest(Utils.jsonErr("Oauth is missing"));
    }

    try {
      const infoOA = {
        oa_id,
        code
      }
      const resToken = await getAccessTokenByOauth(infoOA.code)
      if (!code) {
        return res.serverError(Utils.jsonErr('Lấy AccessToken không thành công. Vui lòng thử lại'));
      }
      const date = Date.now()
      const data = {
        accessToken: resToken.access_token,
        refreshToken: resToken.refresh_token,
        expiredAccessToken: date + (Number(resToken.expires_in) - 60) * 1000, // ~25h
        expiredRefreshToken: date + (90 * 24 * 60 * 60 - 60) * 1000, // ~90day
        authorizationExpired: false
      }
      let infoToken
      const token = await ZaloService.findOne({ appId: appId_GS, oaId: oa_id })
      if (!token || token.length === 0) {
        infoToken = await ZaloService.create({
          ...data,
          appId: appId_GS,
          oaId: oa_id
        }).fetch()
      } else {
        infoToken = await ZaloService.updateOne({ appId: appId_GS, oaId: oa_id }).set(data)
      }
      if (infoToken) {
        return res.json(infoToken);
      } else {
        return res.serverError(Utils.jsonErr('Lấy AccessToken không thành công. Vui lòng thử lại'));
      }
    } catch (error) {
      return res.serverError(Utils.jsonErr(error.message));
    }
  },
  //Get List Article
  getListArticle: async function (req, res) {
    try {
      const { offset, limit, type } = req.query
      // console.log(req.query)
      const checkToken = await checkAndGetValidToken()
      if (checkToken === 0) {
        return res.badRequest(Utils.jsonErr("Ứng dụng chưa được cấp quyền từ Zalo"));
      } else if (checkToken === 4) {
        return res.badRequest(Utils.jsonErr("Xảy ra lỗi khi kiểm tra Access Token"));
      } else if (checkToken === 2 || checkToken === 3) {
        return res.badRequest(Utils.jsonErr("OA authentication đã hết hạn. Vui lòng xin cấp quyền lại"));
      }
      // console.log(`https://openapi.zalo.me/v2.0/article/getslice?offset=${offset || 0}&limit=${limit || 10}&type=${type || 'normal'}`)
      const response = await fetch(`https://openapi.zalo.me/v2.0/article/getslice?offset=${offset || 0}&limit=${limit || 10}&type=${type || 'normal'}`, {
        method: 'GET',
        headers: {
          'Content-Type': '"application/json";charset=UTF-8',
          'access_token': checkToken.accessToken
        },
      });
      const resData = await response.json();
      // console.log(checkToken)
      return res.json(resData);
    } catch (error) {
      return res.serverError(Utils.jsonErr(error.message));
    }
  },
  //Get Detail Article
  getDetailArticle: async function (req, res) {
    try {
      const { id } = req.query
      if (!id) {
        return res.badRequest(Utils.jsonErr("Id is required"));
      }
      const checkToken = await checkAndGetValidToken()
      if (checkToken === 0) {
        return res.badRequest(Utils.jsonErr("Ứng dụng chưa được cấp quyền từ Zalo"));
      } else if (checkToken === 4) {
        return res.badRequest(Utils.jsonErr("Xảy ra lỗi khi kiểm tra Access Token"));
      } else if (checkToken === 2 || checkToken === 3) {
        return res.badRequest(Utils.jsonErr("OA authentication đã hết hạn. Vui lòng xin cấp quyền lại"));
      }
      const response = await fetch(`https://openapi.zalo.me/v2.0/article/getdetail?id=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': '"application/json";charset=UTF-8',
          'access_token': checkToken.accessToken
        },
      });
      const resData = await response.json();
      // console.log(checkToken)
      return res.json(resData);
    } catch (error) {
      return res.serverError(Utils.jsonErr(error.message));
    }
  },
};
// check is valid token, and refresh token if it's invalid
async function checkAndGetValidToken() {
  try {
    const token = await ZaloService.findOne({ appId: appId_GS })
    if (!token) {
      return 0
    }
    const date = Date.now()
    //check accesstoken
    if (date <= token.expiredAccessToken) {
      return token
    }
    //check refreshtoken
    if (date <= token.expiredRefreshToken) {
      const details = {
        "app_id": token.appId,
        "refresh_token": token.refreshToken,
        "grant_type": "refresh_token"
      }
      var formBody = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
      const response = await fetch('https://oauth.zaloapp.com/v4/oa/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'secret_key': secret_key_GS
        },
        body: formBody
      });
      const resData = await response.json();
      // console.log('resData', resData)
      if (resData.error) {
        const infoToken = await ZaloService.updateOne({ appId: appId_GS, oaId: token.oaId }).set({ authorizationExpired: true })
        return 2 // Invalid refresh token
      }
      const data = {
        accessToken: resData.access_token,
        refreshToken: resData.refresh_token,
        expiredAccessToken: date + (Number(resData.expires_in) - 60) * 1000, // ~25h
        expiredRefreshToken: date + (90 * 24 * 60 * 60 - 60) * 1000, // ~90day
        authorizationExpired: false
      }
      const infoToken = await ZaloService.updateOne({ appId: appId_GS, oaId: token.oaId }).set(data)
      return infoToken
    }
    const infoToken = await ZaloService.updateOne({ appId: appId_GS, oaId: token.oaId }).set({ authorizationExpired: true })
    return 3 // refresh token expired

  } catch (error) {
    console.log('error', error)
    return 4
  }
}
async function getAccessTokenByOauth(Oauth) {
  try {
    const details = {
      "app_id": appId_GS,
      "code": Oauth,
      "grant_type": "authorization_code"
    }
    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    const response = await fetch('https://oauth.zaloapp.com/v4/oa/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'secret_key': secret_key_GS
      },
      body: formBody
    });
    return await response.json();

  } catch (error) {
    console.log('error', error)
    return undefined
  }
}

function base64_urlencode(str) {

  return btoa(String.fromCharCode.apply(null,
    new Uint8Array(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}
// *************** Function to get root Parent of user tree
async function getRootParent(parentId) {
  try {
    if (
      parentId === null ||
      typeof parentId === "undefined" ||
      parentId === ""
    ) {
      return "";
    }
    let parent = await User.findOne({
      isDeleted: { "!=": true },
      id: parentId,
    });
    if (!parent) {
      return "";
    }
    if (
      parent.userType === USER_TYPE.Factory &&
      parent.userRole === USER_ROLE.SUPER_ADMIN
    ) {
      return parent;
    }
    return await getRootParent(parent.isChildOf);
  } catch (error) {
    console.log(error.message);
  }
}

