const fs = require('fs');
const path = require('path');
const templatesDir = path.resolve(baseDir, 'public/templates');
const emailTemplates = require('email-templates');
const EmailTemplate = require('../models/emailTemplate');
const { EMAIL_TEMPLATE } = require('../config/constants/common');

const modifyTemplateContent = async (templateData, compactData) =>
    new Promise(async (resolve, reject) => {
        templateData = replaceCurlyBracesWithEjsSyntax(templateData);
        await convertTemplateToString(
            templateData,
            compactData,
            (err, mailString) => {
                if (err) {
                    return reject(err);
                }
                resolve(mailString);
            },
        );
    });

const replaceCurlyBracesWithEjsSyntax = (str) => {
    return str.replace(/{{/g, '<%=').replace(/}}/g, '%>');
};

const convertTemplateToString = async (htmlString, payload, callback) => {
    // htmlString = /*"<% include mail_header.ejs %>" +*/ htmlString;
    /*+ "<% include mail_footer.ejs %>"*/
    createDynamicTemplate(htmlString, (err, templateName) => {
        emailTemplates(templatesDir, (err, template) => {
            if (err) {
                callback(err);
            }
            template(templateName, payload, (err, html, text) => {
                if (err) {
                    callback(err);
                }
                fs.rmSync(templatesDir + '/' + templateName, {
                    recursive: true,
                });
                callback(null, html);
            });
        });
    });
};
const createDynamicTemplate = async (html_string, callback) => {
    let dir = 'auto-generated-' + (await _random(15, true));
    let dirPath = `${templatesDir}/${dir}`;
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
    fs.writeFile(dirPath + '/html.ejs', html_string, (err) => {
        if (err) {
            callback(err);
        }
        callback(null, dir);
    });
};

export const getTemplate = async (code, compactData) => {
    let template = await EmailTemplate.findOne({ code: code }).lean();
    const contents = await EmailTemplate.find({
        code: {
            $in: [
                EMAIL_TEMPLATE.HEADER_CONTENT,
                EMAIL_TEMPLATE.FOOTER_CONTENT,
            ],
        },
    }).lean();

    const header = _.find(contents, {
        code: EMAIL_TEMPLATE.HEADER_CONTENT,
    });

    const footer = _.find(contents, {
        code: EMAIL_TEMPLATE.FOOTER_CONTENT,
    });

    const body = await setHeaderAndFooter(template.body, {
        header: header.body,
        footer: footer.body,
    });
    template.body = await modifyTemplateContent(body, compactData);
    return template;
};

const setHeaderAndFooter = async (body, obj) => {
    return body
        .replace('{{header}}', obj.header)
        .replace('{{footer}}', obj.footer);
};

/**
 * 
 * 
 * 
 * const fs = require('fs');
const path = require('path');
const templatesDir = path.resolve(__dirname, 'public/templates');
const emailTemplates = require('email-templates');
const EmailTemplate = require('../models/emailTemplate');
const emailTemplateConstant = require('../../config/constants/emailTemplateConstant');

const modifyTemplateContent = async (templateData, compactData) =>
    new Promise(async (resolve, reject) => {
        templateData = replaceCurlyBracesWithEjsSyntax(templateData);
        await convertTemplateToString(
            templateData,
            compactData,
            (err, mailString) => {
                if (err) {
                    return reject(err);
                }
                resolve(mailString);
            },
        );
    });

const replaceCurlyBracesWithEjsSyntax = (str) => {
    return str.replace(/{{/g, '<%=').replace(/}}/g, '%>');
};

const convertTemplateToString = async (htmlString, payload, callback) => {
    createDynamicTemplate(htmlString, (err, templateName) => {
        emailTemplates(templatesDir, (err, template) => {
            if (err) {
                callback(err);
            }
            template(templateName, payload, (err, html, text) => {
                if (err) {
                    callback(err);
                }
                fs.rmSync(templatesDir + '/' + templateName, {
                    recursive: true,
                });
                callback(null, html);
            });
        });
    });
};

const createDynamicTemplate = async (html_string, callback) => {
    const dir = 'auto-generated-' + (await _random(15, true));
    const dirPath = `${templatesDir}/${dir}`;
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
    fs.writeFile(dirPath + '/html.ejs', html_string, (err) => {
        if (err) {
            callback(err);
        }
        callback(null, dir);
    });
};

const getHeaderContent = (contents) => {
    return contents.find((content) => content.code === emailTemplateConstant.HEADER_CONTENT);
};

const getFooterContent = (contents) => {
    return contents.find((content) => content.code === emailTemplateConstant.FOOTER_CONTENT);
};

const getTemplate = async (code, compactData) => {
    const template = await EmailTemplate.findOne({ code: code }).lean();
    const contents = await EmailTemplate.find({
        code: {
            $in: [
                emailTemplateConstant.HEADER_CONTENT,
                emailTemplateConstant.FOOTER_CONTENT,
            ],
        },
    }).lean();
    const header = getHeaderContent(contents);
    const footer = getFooterContent(contents);
    const body = await setHeaderAndFooter(template.body, {
        header: header.body,
        footer: footer.body,
    });
    template.body = await modifyTemplateContent(body, compactData);
    return template;
};

const setHeaderAndFooter = async (body, obj) => {
    return body
        .replace('{{header}}', obj.header)
        .replace('{{footer}}', obj.footer);
};

module.exports = {
    getTemplate,
};

 */