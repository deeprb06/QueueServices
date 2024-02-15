const service = require('../../app/utils/dbService');
const File = require('../models/file');
const mime = require('mime-types');
const mongoose = require('mongoose');
const { uploadFileToS3, deleteFileFromS3 } = require('../utils/uploadFile');

const fileData = async (file, folder) => {
    if (
        !file.name.match(
            /\.(jpg|JPG|jpeg|JPEG|png|PNG|WEBP|webp|GIF|gif|svg|SVG)$/,
        )
    ) {
        throw new Error('Only images files are allowed.');
    }
    const id = mongoose.Types.ObjectId();
    const ext = mime.extension(file.mimetype);
    const fileName = `${id}.${ext}`;
    let pathToStore = `uploads/${folder}/${fileName}`;
    await uploadFileToS3(file, pathToStore);
    return {
        name: file.name,
        mimetype: file.mimetype,
        size: file.size,
        uri: `/uploads/${folder}/${fileName}`,
        type: file.mimetype,
    };
};

const removeFile = async (req, res) => {
    let id = req.params.id;
    const findFile = await service.getDocumentByQuery(File, { _id: id });
    let result = await service.deleteDocument(File, { _id: id });
    if (result.deletedCount) {
        const path = findFile.uri;
        await deleteFileFromS3(path);
        res.message = _localize('module.delete', req, 'file');
        util.successResponse(result, res);
    } else {
        res.message = _localize('module.deleteError', req, 'file');
        util.failureResponse(null, res);
    }
};

module.exports = {
    fileData: fileData,
    fileUpload: async (req, res) => {
        try {
            if (!req.files) {
                return util.failureResponse(
                    { message: 'No file uploaded' },
                    res,
                );
            } else {
                let result;
                let files = req.files.file;
                const folder = req.body.folder;
                if (!req.body.hasOwnProperty('folder')) {
                    return util.failureResponse(
                        { message: 'Folder field is required.' },
                        res,
                    );
                }
                if (Array.isArray(files) === false) {
                    const data = await fileData(files, folder);
                    result = await service.createDocument(File, data);
                } else {
                    result = [];
                    await Promise.all(
                        _.map(files, async (file) => {
                            const data = await fileData(file, folder);
                            result.push(
                                await service.createDocument(File, data),
                            );
                        }),
                    );
                }
                return util.successResponse(result, res);
            }
        } catch (error) {
            logger.error('Error - fileUpload', error);
            return util.failureResponse(error, res);
        }
    },
    removeFile,
};
