import { ajax } from 'rxjs/ajax';
import { throwError, of } from 'rxjs';
import { Platform, Dimensions } from 'react-native';
import { API_URL } from '../constants';
import { STATION, FACTORY, GENERAL, AGENCY, FIXER, IN_REPAIR, } from '../types'
export const ajaxAdapter = (url, method = 'GET', payload) => {
    const headers = {
        'Content-Type': 'application/json',
        'cache-control': 'no-cache'
    };
    console.log('ajaxAdapter', payload)
    if (payload && payload.token) {
        headers.authorization = `Bearer ${payload.token}`;
        payload.token = undefined
    }
    const option = {
        url: `${API_URL}${url}`,
        method,
        headers
    };
    if (method !== 'GET' && payload) {
        console.log('POST_json', payload)
        option.body = JSON.stringify(payload);
    }
    console.log('ajax request: ', option);
    return ajax(option);
};
export const handleError = (error, actions) => {
    if (error && error.status >= 401 && error.status <= 403) {
        // throwError(new CustomError('Auth','Phiên làm việc của bạn đã hết hạn'))
        return of({ type: 'LOG_OUT' })
    }
    if (error && error.status === 400) {
        return of(actions("Email hoặc Mật khẩu không chính xác"))
    }
    if (error && error.message) {
        return of(actions(error.message))
    }
    return of(actions('Rất tiếc. Chúng tôi đang gặp phải một sự cố  không mong muốn. Vui lòng thử lại'))
}
export const removeSpace = (string) => string.replace(/\s/g, '');

// eslint-disable-next-line
export const Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) {
        var t = "";
        var n, r, i, s, o, u, a;
        var f = 0;
        e = Base64._utf8_encode(e);
        while (f < e.length) {
            n = e.charCodeAt(f++);
            r = e.charCodeAt(f++);
            i = e.charCodeAt(f++);
            s = n >> 2;
            o = (n & 3) << 4 | r >> 4;
            u = (r & 15) << 2 | i >> 6;
            a = i & 63;
            if (isNaN(r)) {
                u = a = 64
            } else if (isNaN(i)) {
                a = 64
            }
            t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
        }
        return t
    }, decode: function (e) {
        var t = "";
        var n, r, i;
        var s, o, u, a;
        var f = 0;
        e = e.replace(/[^A-Za-z0-9+/=]/g, "");
        while (f < e.length) {
            s = this._keyStr.indexOf(e.charAt(f++));
            o = this._keyStr.indexOf(e.charAt(f++));
            u = this._keyStr.indexOf(e.charAt(f++));
            a = this._keyStr.indexOf(e.charAt(f++));
            n = s << 2 | o >> 4;
            r = (o & 15) << 4 | u >> 2;
            i = (u & 3) << 6 | a;
            t = t + String.fromCharCode(n);
            if (u != 64) {
                t = t + String.fromCharCode(r)
            }
            if (a != 64) {
                t = t + String.fromCharCode(i)
            }
        }
        t = Base64._utf8_decode(t);
        return t
    }, _utf8_encode: function (e) {
        e = e.replace(/rn/g, "n");
        var t = "";
        for (var n = 0; n < e.length; n++) {
            var r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r)
            } else if (r > 127 && r < 2048) {
                t += String.fromCharCode(r >> 6 | 192);
                t += String.fromCharCode(r & 63 | 128)
            } else {
                t += String.fromCharCode(r >> 12 | 224);
                t += String.fromCharCode(r >> 6 & 63 | 128);
                t += String.fromCharCode(r & 63 | 128)
            }
        }
        return t
    }, _utf8_decode: function (e) {
        var t = "";
        var n = 0;
        var r = c1 = c2 = 0;
        while (n < e.length) {
            r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r);
                n++
            } else if (r > 191 && r < 224) {
                c2 = e.charCodeAt(n + 1);
                t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                n += 2
            } else {
                c2 = e.charCodeAt(n + 1);
                c3 = e.charCodeAt(n + 2);
                t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                n += 3
            }
        }
        return t
    }
}

export const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase().trim());
};

export const isIPhoneX = () => {
    const X_HEIGHT = 812, X_WIDTH = 375;
    const { "height": D_HEIGHT, "width": D_WIDTH } = Dimensions.get("window");

    return Platform.OS === "ios" &&
        (D_HEIGHT === X_HEIGHT && D_WIDTH === X_WIDTH ||
            D_HEIGHT === X_WIDTH && D_WIDTH === X_HEIGHT);

}
export const getUserType = (userType) => {
    switch (userType) {
        case STATION:
            return 'Trạm chiết'
            break;
        case FACTORY:
            return 'Thương nhân sở hữu'
            break;
        case AGENCY:
            return 'Cửa hàng bán lẻ'
        case GENERAL:
            return 'Thương nhân mua bán'
            break;
        case FIXER:
            return 'Người sửa chữa'
            break;
        default:
            return 'Chưa khai báo'
            break;
    }
}
export const getPosition = (code) => {
    switch (code) {
        case 'IN_FACTORY':
            return 'Đang ở trạm'
            break;
        case 'DELIVERING':
            return 'Trên đường vận chuyển'
            break;
        case 'IN_STATION':
            return 'Đang ở trạm chiết xuất'
        case 'IN_AGENCY':
            return 'Đang ở cửa hàng bán lẻ'
            break;
        case 'IN_GENERAL':
            return 'Đang ở thương nhân mua bán'
            break;
        case 'IN_CUSTOMER':
            return 'Đã bán cho người dân'
            break;
        case IN_REPAIR:
            return 'Đang ở sửa chữa'
            break;
        default:
            return 'Chưa khai báo'
            break;
    }
}

