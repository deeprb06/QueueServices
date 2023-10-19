const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    /**
     * Your favorite port
     */
    port: process.env.API_PORT || 8000,

    /* MongoDB Credentials */
    MONGODB: {
        DB_CONNECTION: process.env.DB_CONNECTION || 'mongodb',
        DB_HOST: process.env.DB_HOST || 'localhost',
        DB_PORT:
            process.env.DB_PORT == ''
                ? process.env.DB_PORT
                : process.env.DB_PORT
                ? `:${process.env.DB_PORT}`
                : `:27017`,
        DB_DATABASE: process.env.DB_DATABASE || '',
        DB_USERNAME: process.env.DB_USERNAME
            ? `${process.env.DB_USERNAME}:`
            : '',
        DB_PASSWORD: process.env.DB_PASSWORD
            ? `${process.env.DB_PASSWORD}@`
            : '',
    },

    JWT_SECRET: process.env.JWT_SECRET || 'cdcdcd',

    /**
     * API configs
     */
    api: {
        prefix: '/api',
    },

    /**
     * REDIS OPTION
     */
    REDIS: {
        HOST: process.env.REDIS_HOST || '127.0.0.1',
        PORT: process.env.REDIS_PORT || 6379,
        // PASSWORD_FOR_BULL: process.env.REDIS_PASSWORD ?? "",
        // PASSWORD: process.env.REDIS_PASSWORD == "" ? process.env.REDIS_PASSWORD : process.env.REDIS_PASSWORD ? `:${process.env.REDIS_PASSWORD}@` : "",
        // USER : process.env.REDIS_USER ?? ""
    },
    /**
     * Novu Access
     */
    NOVU_API_KEY: process.env.NOVU_API_KEY,
    NOVU_BACKEND_URL: process.env.NOVU_BACKEND_URL,

    /**
     * FIREBASE PRIVATE KEY
     */
    FIREBASE_PRIVATE_KEY: 'FIREBASE_PRIVATE_KEY',
};
