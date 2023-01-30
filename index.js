import app from './app';
import config from './src/config';
import connectDB from './src/helpers/db';
const startServer = async () => {
    await connectDB();
    app.listen(config.port, () => console.log(`Backend running on port ${config.port}`));
};

startServer();
