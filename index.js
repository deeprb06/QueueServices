const app = require('./app');
const config = require('./src/config');

const startServer = async () => {
    app.listen(config.port, () =>
        console.log(`Backend running on port ${config.port}`),
    );
};

startServer();
