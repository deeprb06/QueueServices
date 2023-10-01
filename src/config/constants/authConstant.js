const MASTER = {
    WORK: true,
    MASTER_OTP: 123456,
    MASTER_PASSWORD: 'Test@12345',
};

const JWT = {
    SECRET: 'myjwtsecret',
    ADMIN_SECRET: 'myjwtadminsecret',
    CLIENT_SECRET: 'myjwtclientsecret',
    EXPIRESIN: 1000000,
    REFRESH_EXPIRES_IN: '30d',
    CHANGE_PASSWORD_SUCCESS: 1,
    PASSWORD_USE_ERROR: 2,
    PASSWORD_NOT_MATCH: 0,
};

const USER_ROLES = {
    ADMIN: 'ADMIN',
    USER: 'USER',
};

const JWT_STRING = 'jwt ';

module.exports = {
    MASTER,
    JWT,
    JWT_STRING,
    USER_ROLES
}

