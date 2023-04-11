import moment from 'moment-timezone';
const axios = require('axios');
import { t } from 'i18next';

export const base64Encode = async (uri) => {
    const image = await axios.get(uri, { responseType: 'arraybuffer' });
    const raw = Buffer.from(image.data).toString('base64');
    return 'data:' + image.headers['content-type'] + ';base64,' + raw;
};

export const getFileName = (str) => {
    str = str.split('/');
    return str[str.length - 1];
};

export const isNegative = (num) => {
    return num ? Math.sign(num) === -1 : 0;
};

export const localize = (key, req, module = null, disableTitleCase = false) => {
    if (module) {
        return req.i18n.t(key).replaceAll('{module}', disableTitleCase ? module : _toTitleCase(module));
    }
    return req.i18n.t(key);
};

export const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

export const randomString = async (length, timestamp = false) => {
    const chars =
        '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    const unixTimestamp = moment().unix();
    const middlePoint = Math.round(length / 2);
    for (let i = length; i > 0; --i) {
        if (i === middlePoint && timestamp) {
            result += unixTimestamp;
        } else {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
    }
    return result;
};

export const randomPasswordGenerator = async () => {
    try {
        let pass;
        let start = true;
        while (start) {
            pass = '';
            for (let i = 1; i <= 8; i++) {
                let char = Math.floor(
                    Math.random() * RANDOM_PASSWORD_CHAR.length + 1,
                );
                if (i === 5) {
                    pass += ATRATE;
                }
                pass += RANDOM_PASSWORD_CHAR.charAt(char);
            }
            let checkPass = PASSWORD_REGEX.test(pass);

            start = !checkPass;
        }
        return pass;
    } catch (error) {
        throw new Error(error);
    }
};

