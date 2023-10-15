const Setting = require('../models/setting');

const seedSetting = async () => {
    try {
        const settingJSON = require('../seeder/settings.json');

        const existingSettings = await Setting.find({});

        for (const data of settingJSON) {
            const checkSetting = existingSettings.find(
                (setting) => setting.code === data.code,
            );

            if (!checkSetting) {
                await Setting.create(data);
            }
        }

        logger.info('settings sedded successfully.');
        return true;
    } catch (error) {
        logger.error('Error - seedSetting', error);
        throw new Error();
    }
};

module.exports = {
    seedSetting,
};
