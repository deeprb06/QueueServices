const moment = require('moment-timezone');

const convertToTz = (params) => {
    try {
        let obj = { ...params };
        const defaultTimezone = process.env.TZ
            ? process.env.TZ
            : 'Asia/Kolkata';
        const requestTimezone = obj?.tz ? obj.tz : defaultTimezone;
        if (obj && obj.date === undefined) {
            obj.date = moment()
                .tz(requestTimezone)
                .format('YYYY-MM-DD HH:mm:ss');
        }
        let format = obj?.format ? obj.format : 'YYYY-MM-DD HH:mm:ss';
        let convertedDateTime = moment(obj.date);
        if (requestTimezone !== defaultTimezone) {
            convertedDateTime = moment(obj.date).tz(requestTimezone);
        }
        let serverTimeZone = moment(obj.date, defaultTimezone);
        let localOffset = serverTimeZone.utcOffset();
        serverTimeZone.tz(requestTimezone);
        let centralOffset = serverTimeZone.utcOffset();
        let diffInMinutes = localOffset - centralOffset;
        const date = convertedDateTime.tz(defaultTimezone);

        return date.add(diffInMinutes, 'minutes').format(format);
    } catch (error) {
        logger.error('Error - convertToTz', error);
        throw new Error(error);
    }
};

const convertToRetriveTz = (params) => {
    try {
        let obj = { ...params };
        const defaultTimezone = process.env.TZ
            ? process.env.TZ
            : 'Asia/Kolkata';
        const requestTimezone = obj?.tz ? obj.tz : defaultTimezone;
        if (obj && obj.date === undefined) {
            obj.date = moment().toISOString();
        }
        let format = obj?.format ? obj.format : 'YYYY-MM-DD HH:mm:ss';
        let convertedDateTime = moment(obj.date);
        if (requestTimezone !== defaultTimezone) {
            convertedDateTime = moment(obj.date).tz(defaultTimezone);
        }
        const date = convertedDateTime.tz(requestTimezone);
        return format ? date.format(format) : date;
    } catch (error) {
        logger.error('Error - convertToTz', error);
        throw new Error(error);
    }
};

module.exports = {
    convertToTz,
    convertToRetriveTz,
};
