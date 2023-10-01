/*
 * createDocument : create any mongoose document
 * @param  model  : mongoose model
 * @param  data   : {}
 */
const filterService = require('../services/filterQuery');

const createDocument = (model, data) =>
    new Promise((resolve, reject) => {
        model.create(data, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });

/*
 * updateDocument : update any existing mongoose document
 * @param  model  : mongoose model
 * @param id      : mongoose document's _id
 * @param data    : {}
 */

const updateDocument = (model, id, data) =>
    new Promise((resolve, reject) => {
        data.__enc_message = false;
        model.findOneAndUpdate(
            { _id: id },
            { $set: data },
            {
                runValidators: true,
                context: 'query',
                new: true,
            },
            (err, data) => {
                if (err) reject(err);
                else resolve(data);
            },
        );
    });

/*
 * deleteDocument : delete any existing mongoose document
 * @param  model  : mongoose model
 * @param  id     : mongoose document's _id
 */

const deleteDocument = (model, filter) =>
    new Promise((resolve, reject) => {
        model.deleteOne(filter, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });

/*
 * deleteMultipleDocument : delete multiple existing mongoose document
 * @param  model  : mongoose model
 * @param  ids     : mongoose array of document's_id
 */

const deleteMultipleDocuments = (model, ids) =>
    new Promise((resolve, reject) => {
        model.deleteMany({ _id: { $in: ids } }, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });

/*
 * getAllDocuments : find all the mongoose document
 * @param  model   : mongoose model
 * @param query    : {}
 * @param options  : {}
 */

const getAllDocuments = async (model, query, options) => {
    query = await filterService.getFilterQuery(query);
    query.deletedAt = { $exists: false };
    return new Promise((resolve, reject) => {
        model.paginate(query, options, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });

    /**
     *  query = await filterService.getFilterQuery(query);
    query.deletedAt = { $exists: false };

    const { page = 1, limit = 10 } = options;

    const skip = (page - 1) * limit;

    const totalCount = await model.countDocuments(query);

    const totalPages = Math.ceil(totalCount / limit);

    const data = await model.find(query).skip(skip).limit(limit).exec();

    return {
        itemCount: totalCount,
        data,
        perPage: limit,
        currentPage: page,
        next: page < totalPages ? page + 1 : null,
        prev: page > 1 ? page - 1 : null,
        pageCount: totalPages,
        slNo: skip + 1, // Adjust as needed for your use case
        paginator: {
            // Add any additional metadata you need
        },
    };
     */
};

/*
 * getSingleDocumentById : find single mongoose document
 * @param  model  : mongoose model
 * @param  id     : mongoose document's _id
 * @param  select : [] *optional
 */

const getSingleDocumentById = (model, id, select = []) =>
    new Promise((resolve, reject) => {
        model.findOne({ _id: id }, select, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });

/*
 * findExistsData : find existing mongoose document
 * @param  model  : mongoose model
 * @params data   : {
 *                   "query":{
 *                       "and":[{"Name":"Dhiraj"},{"Salary":300}],
 *                        "or":[{"Name":"Dhiraj"},{"Salary":300}]
 *                   }
 * }
 */

const findExistsData = (model, data) => {
    const { query } = data;
    const { and } = query;
    const { or } = query;
    const q = {};

    if (and) {
        q.$and = and;
    }
    if (or) {
        q.$or = or;
    }

    return new Promise((resolve, reject) => {
        model.find(q, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

/*
 * softDeleteDocument : soft delete ( partially delete ) mongoose document
 * @param  model      : mongoose model
 * @param  id         : mongoose document's _id
 * @param data        : data object for update mongoose document
 */

const softDeleteDocument = (model, id, data) =>
    new Promise((resolve, reject) => {
        model.updateOne({ _id: id }, data, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });

/*
 * softDeleteDocument : soft delete ( partially delete ) multiple mongoose document
 * @param  model      : mongoose model
 * @param  ids        : mongoose document's _id array
 * @param data        : data object for update mongoose document
 */

const softDeleteMultiDocuments = async (model, ids, data) =>
    new Promise((resolve, reject) => {
        model.updateMany(
            {
                _id: { $in: ids },
                canNotDelete: { $ne: true },
                isDefault: { $ne: true },
            },
            data,
            (err, result) => {
                if (err) reject(err);
                else resolve(result);
            },
        );
    });

/*
 * bulkInsert     : create document in bulk mongoose document
 * @param  model  : mongoose model
 * @param  data   : {}
 */

const bulkInsert = (model, data) =>
    new Promise((resolve, reject) => {
        model.insertMany(data, (err, result) => {
            if (result !== undefined && result.length > 0) {
                resolve(result);
            } else {
                reject(err);
            }
        });
    });

/*
 * bulkInsert     : update existing document in bulk mongoose document
 * @param  model  : mongoose model
 * @param  filter : {}
 * @param  data   : {}
 */

const bulkUpdate = (model, filter, data) =>
    new Promise((resolve, reject) => {
        model.updateMany(filter, data, (err, result) => {
            if (result !== undefined) {
                resolve(result);
            } else {
                reject(err);
            }
        });
    });

/*
 * countDocument : count total number of records in particular model
 * @param  model : mongoose model
 * @param where  : {}
 */

const countDocument = (model, where) =>
    new Promise((resolve, reject) => {
        model.where(where).countDocuments((err, result) => {
            if (result !== undefined) {
                resolve(result);
            } else {
                reject(err);
            }
        });
    });

/*
 * getDocumentByQuery : find document by dynamic query
 * @param  model      : mongoose model
 * @param  where      : {}
 * @param  select     : [] *optional
 */

const getDocumentByQuery = (model, where, select = [], options = {}) =>
    new Promise((resolve, reject) => {
        model
            .findOne(where, select, options, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            })
            .lean();
    });

/*
 * getDocumentByQueryWithPopulate : find document by dynamic query
 * @param  model      : mongoose model
 * @param  where      : {}
 * @param  select     : [] *optional
 */

const getDocumentByQueryWithPopulate = (model, where, populate, select = []) =>
    new Promise((resolve, reject) => {
        model
            .findOne(where, select, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            })
            .populate(populate);
    });

/*
 * findOneAndUpdateDocument : find existing document and update mongoose document
 * @param  model   : mongoose model
 * @param  filter  : {}
 * @param  data    : {}
 * @param  options : {} *optional
 */

const findOneAndUpdateDocument = (
    model,
    filter,
    data,
    options = { new: true },
    populate = [],
) =>
    new Promise((resolve, reject) => {
        model
            .findOneAndUpdate(filter, data, options, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            })
            .populate(populate);
    });

/*
 * findOneAndDeleteDocument : find existing document and delete mongoose document
 * @param  model  : mongoose model
 * @param  filter  : {}
 * @param  options : {} *optional
 */
const findOneAndDeleteDocument = (model, filter, options = {}) =>
    new Promise((resolve, reject) => {
        model.findOneAndDelete(filter, options, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });

const exportToExcel = async (sheetName, columns, data) => {
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);
    worksheet.columns = columns;
    worksheet.columns.forEach((column) => {
        column.width = column.header.length < 12 ? 12 : column.header.length;
    });
    worksheet.getRow(1).font = { bold: true };
    worksheet.addRows(data);
    return workbook;
};

const dbHooks = async (modelSchema) => {
    modelSchema.pre(
        ['findOne', 'find', 'updateOne', 'updateMany'],
        function (next) {
            this.getQuery().deletedAt = { $exists: false };
            next();
        },
    );
};

module.exports = {
    createDocument,
    getAllDocuments,
    updateDocument,
    deleteDocument,
    getSingleDocumentById,
    findExistsData,
    softDeleteDocument,
    bulkInsert,
    bulkUpdate,
    countDocument,
    getDocumentByQuery,
    findOneAndUpdateDocument,
    findOneAndDeleteDocument,
    getDocumentByQueryWithPopulate,
    exportToExcel,
    softDeleteMultiDocuments,
    deleteMultipleDocuments,
    dbHooks,
};
