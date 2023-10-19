const agenda = require('../../config/agenda');

agenda.define(
    'here pass your function name',
    {
        concurrency: 1,
        priority: 20,
    },
    async () => {
        logger.info(
            `Start Store your function Agenda process at ${convertToTz()}`,
        );
        // operation function like getData()
        logger.info(
            `finish Store your function Agenda process at ${convertToTz()}`,
        );
    },
);

async function getDetails() {
    await agenda.start();
    await agenda.every('0 2 * * *', 'here pass your function name');
}

getDetails();
