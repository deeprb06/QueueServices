const moment = require('moment-timezone');
const axios = require('axios');
const { t } = require('i18next');

const pick = (object, keys) => {
    return keys.reduce((obj, key) => {
        if (object && Object.prototype.hasOwnProperty.call(object, key)) {
            // eslint-disable-next-line no-param-reassign
            obj[key] = object[key];
        }
        return obj;
    }, {});
};

const base64Encode = async (uri) => {
    const image = await axios.get(uri, { responseType: 'arraybuffer' });
    const raw = Buffer.from(image.data).toString('base64');
    return 'data:' + image.headers['content-type'] + ';base64,' + raw;
};

const getFileName = (str) => {
    str = str.split('/');
    return str[str.length - 1];
};

const isNegative = (num) => {
    return num ? Math.sign(num) === -1 : 0;
};

const localize = (key, req, module = null, disableTitleCase = false) => {
    // if (module) {
    //     return req.i18n
    //         .t(key)
    //         .replaceAll('{module}', disableTitleCase ? module : _toTitleCase(module));
    // }
    // return req.i18n.t(key);

    if (module) {
        if (module instanceof Object) {
            let replace = new RegExp(Object.keys(module).join('|'), 'gi');
            return req.i18n.t(key).replace(replace, function (matched) {
                return module[matched];
            });
        }
        return req.i18n.t(key).replaceAll('{module}', _toTitleCase(module));
    }
    return req.i18n.t(key);
};

const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

const randomString = async (length, timestamp = false) => {
    const chars =
        '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    const unixTimestamp = moment().unix();
    const middlePoint = Math.round(length / 2);
    for (let i = length; i > 0; --i) {
        if (i === middlePoint && timestamp) {
            result += unixTimestamp;
        } else {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
    }
    return result;
};

const randomPasswordGenerator = async () => {
    try {
        let pass = '';
        let checkPass = false;

        while (!checkPass) {
            pass = '';
            for (let i = 1; i <= 8; i++) {
                let char = Math.floor(
                    Math.random() * RANDOM_PASSWORD_CHAR.length,
                );
                if (i === 5) {
                    pass += ATRATE;
                }
                pass += RANDOM_PASSWORD_CHAR.charAt(char);
            }
            checkPass = PASSWORD_REGEX.test(pass);
        }

        return pass;
    } catch (error) {
        throw new Error(error);
    }
};

function getRandomNumberArray(size, numberLimit) {
    try {
        const randomNumberArray = [];
        while (randomNumberArray.length < size) {
            const number = Math.floor(Math.random() * numberLimit) + 1;
            if (randomNumberArray.indexOf(number) === -1)
                randomNumberArray.push(number);
        }
        return randomNumberArray;
    } catch (error) {
        logger.error('Error-getRandomNumberArray', error);
        throw new Error(error);
    }
}

const slugify = (text) => {
    return text
        ?.toString()
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
};

const convertPaginationResult = (data, pagination, filterCount) => {
    try {
        const result = data[0];
        const totalDocs = result.metadata[0]?.total || 0;
        const limit = pagination.limit;
        const totalPages = Math.max(Math.ceil(totalDocs / limit), 1);
        const page = Math.max(Math.ceil(pagination.offset / limit) + 1, 1);

        const hasPrevPage = page > 1;
        const prevPage = hasPrevPage ? page - 1 : null;
        const hasNextPage = page < totalPages;
        const nextPage = hasNextPage ? page + 1 : null;

        const responseData = {
            data: result.data,
            paginator: {
                itemCount: totalDocs,
                offset: pagination.offset,
                perPage: limit,
                pageCount: totalPages,
                currentPage: page,
                hasPrevPage: hasPrevPage,
                hasNextPage: hasNextPage,
                prev: prevPage,
                next: nextPage,
                filterCount: filterCount || 0,
            },
        };
        return responseData;
    } catch (error) {
        throw new Error(error);
    }
};

const refDataUpdate = async (data) => {
    try {
        const promises = [];
        for (const [collection, details] of Object.entries(data.collectionDetails)) {
            const model = require(`../models/${collection}`)
            details?.arrayType?.forEach(async (item) => {
                const updateObj = {}
                Object.entries(data.updateData).forEach(([key, value]) => {
                    if (!IGNORE_SELECTED_KEYS.includes(key)) {
                        Object.assign(updateObj, { [`${item}.$.${key}`]: value });
                    }
                });
                promises.push(model.updateMany({ [`${item}.id`]: data.updateData._id, deletedAt: { $exists: false} }, { $set: updateObj }));
            });
            details?.objectType?.forEach(async (item) => {
                const updateObj = {}
                Object.entries(data.updateData).forEach(([key, value]) => {
                    if (!IGNORE_SELECTED_KEYS.includes(key)) {
                        Object.assign(updateObj, { [`${item}.${key}`]: value });
                    }
                });
                promises.push(model.updateMany({ [`${item}.id`]: data.updateData._id, deletedAt: { $exists: false } }, { $set: updateObj }));
            });
        }
        await Promise.all(promises);
    }catch(error){
        logger.error("Error - refDataUpdate", error)
    }
}

const refDataDelete = async (data) => {
    try {
        const promises = [];
        for (const [collection, details] of Object.entries(data.collectionDetails)) {
            const model = require(`../models/${collection}`)
            details?.arrayType?.forEach(async (item) => {
                const updateObj = { $pull: { [item]: { id: data.updateData._id }}}
                promises.push(model.updateMany({ [`${item}.id`]: data.updateData._id, deletedAt: { $exists: false } }, updateObj ));
            });
            details?.objectType?.forEach(async (item) => {
                const updateObj = { $unset: { [item]: { id: data.updateData._id } } }
                promises.push(model.updateMany({ [`${item}.id`]: data.updateData._id, deletedAt: { $exists: false } }, updateObj ));
            });
        }
        await Promise.all(promises);
    } catch (error) {
        logger.error("Error - refDataUpdate", error)
    }
}

/**
 *
 * @param {*} html string to generate pdf
 * @param {*} pdfName name of pdf
 * @param {*} id hex id
 * @returns this function create pdf and upload pdf in aws s3 bucket
 */

const createPdf = async (html, pdfName, id) => {
    try {
        const storeName = `documents/${id}/${pdfName}.pdf`;
        const options = {
            format: 'A4',
            phantomArgs: ['--ignore-ssl-errors=yes'],
            timeout: '100000',
            childProcessOptions: {
                env: {
                    OPENSSL_CONF: OPENSSL_CONF,
                },
            },
        };

        return new Promise((resolve, reject) => {
            Pdf.create(html, options).toBuffer(async (error, response) => {
                if (error) {
                    logger.error('Error in create pdf buffer', error);
                    console.error(error);
                    reject(error);
                }
                if (response) {
                    AWS.config.update({
                        accessKeyId: AWS_CONFIG.AWS_S3_ACCESS_KEY,
                        secretAccessKey: AWS_CONFIG.AWS_S3_SECRET_KEY,
                        ...(AWS_CONFIG.AWS_SESSION_TOKEN
                            ? { region: AWS_CONFIG.AWS_SESSION_TOKEN }
                            : {}),
                    });
                    const s3 = new AWS.S3();
                    const params = {
                        Bucket: AWS_CONFIG.AWS_S3_BUCKET_NAME,
                        Key: storeName,
                        Body: response,
                        ACL: 'public-read',
                        ContentType: 'application/pdf',
                    };
                    s3.upload(params, (error, data) => {
                        if (error) {
                            reject(error);
                        }
                        resolve({
                            fileUrl: `${AWS_CONFIG.AWS_S3_URL}/${storeName}`,
                            storeName,
                        });
                    });
                } else {
                    resolve(createPdf(html, pdfName, id));
                }
            });
        });
    } catch (error) {
        console.error('error: ', error);
        logger.error('Error - createPdf', error);
        throw error;
    }
};

module.exports = {
    pick,
    localize,
    randomString,
    toTitleCase,
    isNegative,
    randomPasswordGenerator,
    base64Encode,
    getFileName,
    getRandomNumberArray,
    slugify,
    convertPaginationResult,
    refDataDelete,
    refDataUpdate,
    createPdf
};
