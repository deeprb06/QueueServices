const AWS = require('aws-sdk');
const config = require('../config');
AWS.config.update({
    apiVersion: config.AWS_CONFIG.AWS_S3_API_VERSION,
    accessKeyId: config.AWS_CONFIG.AWS_ACCESS_ID,
    secretAccessKey: config.AWS_CONFIG.AWS_SECRET_KEY,
    region: config.AWS_CONFIG.REGION,
});
const nodemailer = require('nodemailer');
const Log = require('../../src/models/log');
const { LOG_TYPE, LOG_STATUS, JOB_NAME } = require('../config/constants/common');
const { createJob } = require('../services/jobs');
const emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const util = require('util');

const sendEmail = async (obj) => {
    try {
        const transporter = nodemailer.createTransport({ SES: new AWS.SES({}) });
        let emailLogs;
        if (obj.log_id) {
            emailLogs = await Log.findOne({ _id: obj.log_id });
        } else {
            const logsData = {
                type: LOG_TYPE.MAIL,
                data: obj,
            };
            emailLogs = await Log.create(logsData);
        }
        const isValidEmails = obj.email.every((email) => email.match(emailFormat));

        if (!isValidEmails) {
            await Log.updateOne({ _id: emailLogs._id }, { status: LOG_STATUS.FAILED, data: { ...obj, ...{ reason: 'Invalid Email' }, }, });
            return;
        }
        const mailOptions = {
            from: process.env.SENDER_EMAIL ? process.env.SENDER_EMAIL : 'Lucratori <info@lucratori.id>',
            to: obj.email,
            subject: obj.subject,
            html: obj.htmlData,
            attachments: obj.attachments || [],
            cc: obj.ccEmails,
            bcc: obj.bccEmails,
        };
        const sendMail = util.promisify(transporter.sendMail.bind(transporter));
        const response = await sendMail(mailOptions);

        if (emailLogs) {
            await Log.updateOne(
                { _id: emailLogs._id },
                {
                    status: LOG_STATUS.SENT,
                    response: _.pick(response, ['envelope', 'messageId', 'response']),
                });
            logger.info(`Mail response: ${response.response} - ${response.envelope.to}`);
        }
    } catch (error) {
        logger.error('Error - sendEmail' + error);
    }
};

const sendSESEmail = async (email, subjectData, htmlContentData, attachments = [], ccEmails, bccEmails,) => {
    try {
        const mailObj = {
            email: email,
            subject: subjectData,
            htmlData: htmlContentData,
            attachments: attachments,
            ccEmails,
            bccEmails,
        };
        await createJob(JOB_TYPE.SEND_MAIL, mailObj, {});
    } catch (error) {
        logger.error('Error - sendSESEmail' + error);
    }
};

module.exports = {
    sendEmail,
    sendSESEmail,
};
