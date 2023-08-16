
import fs from 'fs';
import path from 'path';
const templatesDir = path.resolve(baseDir, 'public/templates');
import emailTemplates from ('email-templates');
import EmailTemplate from ('../models/emailTemplate');
import emailTemplateConstant from ('../../config/constants/emailTemplateConstant')

const modifyTemplateContent = async (templateData, compactData) =>
    new Promise((async (resolve, reject) => {
        templateData = replaceCurlyBracesWithEjsSyntax(templateData);
        await convertTemplateToString(templateData, compactData,
            (err, mailString) => {
                if (err) {
                    return reject(err)
                }
                resolve(mailString);
            });
    }));

const replaceCurlyBracesWithEjsSyntax = (str) => {
    return str.replace(/{{/g, '<%=').replace(/}}/g, '%>');
};

const convertTemplateToString = async (htmlString, payload, callback) => {
    // htmlString = /*"<% include mail_header.ejs %>" +*/ htmlString;
    /*+ "<% include mail_footer.ejs %>"*/
    createDynamicTemplate(htmlString,
        (err, templateName) => {
            emailTemplates(templatesDir, (err, template) => {
                if (err) {
                    callback(err)
                }
                template(templateName, payload,
                    (err, html, text) => {
                        if (err) {
                            callback(err);
                        }
                        fs.rmSync(templatesDir + '/' + templateName, { recursive: true });
                        callback(null, html);
                    });
            });
        });
};
const createDynamicTemplate = async (html_string, callback) => {
    let dir = 'auto-generated-' + await _random(15, true);
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
    let template = await EmailTemplate.findOne({ code: code }).lean()
    const contents = await EmailTemplate.find({ code: { $in: [emailTemplateConstant.HEADER_CONTENT, emailTemplateConstant.FOOTER_CONTENT] } }).lean();
    const header = _.find(contents, { code: emailTemplateConstant.HEADER_CONTENT });
    const footer = _.find(contents, { code: emailTemplateConstant.FOOTER_CONTENT });
    const body = await setHeaderAndFooter(template.body, { header: header.body, footer: footer.body });
    template.body = await modifyTemplateContent(body, compactData);
    return template;
}


const setHeaderAndFooter = async (body, obj) => {
    return body.replace('{{header}}', obj.header).replace('{{footer}}', obj.footer);
}

