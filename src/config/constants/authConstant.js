export const MASTER = {
    WORK: true,
    MASTER_OTP: 123456,
    MASTER_PASSWORD: 'Test@12345',
};

export const JWT = {
    SECRET: 'myjwtsecret',
    ADMIN_SECRET: 'myjwtadminsecret',
    CLIENT_SECRET: 'myjwtclientsecret',
    EXPIRESIN: 1000000,
    REFRESH_EXPIRES_IN: '30d',
    CHANGE_PASSWORD_SUCCESS: 1,
    PASSWORD_USE_ERROR: 2,
    PASSWORD_NOT_MATCH: 0,
};

export const USER_TYPES = {
    USER: 1,
    CLIENT: 2,
};

export const USER_ROLES = {
    CANDIDATE: 'CANDIDATE',
    CLIENT: 'CLIENT',
    ADMIN: 'ADMIN',
    STAFF: 'STAFF',
    USER: 'USER',
    ASSESSOR: 'ASSESSOR',
    REVIEWER: 'REVIEWER',
};

export const JWT_STRING = 'jwt ';

