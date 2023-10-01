const myCustomLabels = {
    item: 'itemCount',
    data: 'data',
    limit: 'perPage',
    page: 'currentPage',
    nextPage: 'next',
    prevPage: 'prev',
    totalPages: 'pageCount',
    pagingCounter: 'slNo',
    meta: 'paginator',
};

const LOG_STATUS = {
    PENDING: 'PENDING',
    SENT: 'SENT',
    FAILED: 'FAILED',
    RETRY: 'RETRY',
};

const LOG_TYPE = {
    MAIL: 'MAIL',
    NOTIFICATIONS: 'NOTIFICATIONS',
};

const RESPONSE_CODE = {
    DEFAULT: 'SUCCESS',
    LOGIN: 'LOGIN',
    OTP: 'OTP_VERIFIED',
    FORGOT_PASSWORD: 'FORGOT_PASSWORD',
    ERROR: 'ERROR',
    ALERTS: 'ALERTS',
};

const COUNTRY_CODE = {
    INDIA: 'INDIA',
};

const JOB_NAME = {
    SENDMAIL: 'sendMail',
    SEND_NOTIFICATIONS: 'sendNotifications',
};

const EMAIL_TEMPLATE = {
    FORGOT_PASSWORD: 'FORGOT_PASSWORD',
    PASSWORD_RESET: 'PASSWORD_RESET',
    HEADER_CONTENT: 'HEADER_CONTENT',
    FOOTER_CONTENT: 'FOOTER_CONTENT',
    NEW_USER_PASSWORD: 'NEW_USER_PASSWORD',
    SIGN_UP_OTP: 'SIGN_UP_OTP',
    LOGIN_OTP: 'LOGIN_OTP',
    PASSWORD_RESET_OTP: 'PASSWORD_RESET_OTP',
};

module.exports = {
    myCustomLabels,
    LOG_STATUS,
    LOG_TYPE,
    RESPONSE_CODE,
    COUNTRY_CODE,
    JOB_NAME,
    EMAIL_TEMPLATE,
};
