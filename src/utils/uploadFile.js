const AWS = require('aws-sdk');
const awsConfig = {
    apiVersion: process.env.AWS_S3_API_VERSION,
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    region: process.env.AWS_S3_REGION,
};
AWS.config.update(awsConfig);
const s3 = new AWS.S3();
const pdf = require('html-pdf');

const uploadFileToS3 = async (file, fileName) => {
    const fileContent = Buffer.from(file.data, 'binary');
    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileName,
        Body: fileContent,
        ACL: 'public-read',
        ContentType: file.mimetype,
    };
    await s3.upload(params).promise();
};

const deleteFileFromS3 = async (fileName) => {
    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileName.replace(/^\/+/g, ''),
    };
    await s3.deleteObject(params).promise();
};

const createPdf = async (html, pdfName, id, isOrder = false) =>
    new Promise(async (resolve, reject) => {
        try {
            let storeName = `report/${id}/${pdfName}.pdf`;
            if (isOrder == true) {
                storeName = `invoice/${id}/${pdfName}.pdf`;
            }
            const options = {
                format: 'A4',
                phantomArgs: ['--ignore-ssl-errors=yes'],
                timeout: '100000',
                childProcessOptions: {
                    env: {
                        OPENSSL_CONF: process.env.OPENSSL_CONF,
                    },
                },
            };
            pdf.create(html, options).toStream(async function (err, response) {
                if (err) {
                    logger.error(err);
                    console.error(err);
                    reject(err);
                }
                if (response) {
                    const params = {
                        Bucket: process.env.AWS_S3_BUCKET_NAME,
                        Key: storeName,
                        Body: response,
                        ACL: 'public-read',
                        ContentType: 'application/pdf',
                    };
                    s3.upload(params, (err, data) => {
                        if (err) {
                            reject(err);
                        }
                        return resolve({
                            filename: `${process.env.AWS_S3_URL}/${storeName}`,
                            storeName,
                        });
                    });
                } else {
                    return await createPdf(html, pdfName, id);
                }
            });
        } catch (error) {
            console.error(error);
            logger.error(error);
        }
    });

function stream2buffer(stream) {
    return new Promise((resolve, reject) => {
        const _buf = [];
        stream.on('data', (chunk) => _buf.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(_buf)));
        stream.on('error', (err) => reject(err));
    });
}

const s3ImageBuffer = async (name) => {
    try {
        const getParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: `uploads/clients/${name}`,
        };
        const data = await s3.getObject(getParams).promise();
        return data.Body.toString('base64');
    } catch (error) {
        logger.error('Error-s3ImageBuffer', error);
        throw new Error('Error occur s3 image convert in buffer');
    }
};

module.exports = {
    uploadFileToS3,
    deleteFileFromS3,
    createPdf,
    s3ImageBuffer,
};
