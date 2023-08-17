const service = require('../../utils/dbService');
const userService = require('../../services/user');
const { exportCandidateList } = require('../../services/candidateExport');
const user = require('../../models/user');
const Role = require('../../models/role');
const { ObjectId } = require('mongodb');
const { getTemplate } = require('../../utils/renderMailTemplate');
const emailTemplateConstant = require('../../../config/constants/emailTemplateConstant');
const { sendSESEmail } = require('../../../config/email');
const Permissions = require('../../services/rolePermission');
const {randomPasswordGenerator} = require('../../utils/helpers');

const addUser = catchAsync(async (req, res) => {
    const data = {
        ...req.body,
    };
    const findEmail = _.find(data.emails, { isDefault: true });
    const email = findEmail.email.toLowerCase();
    const userFind = await user.findOne({
        emails: {
            $elemMatch: {
                email: email,
                isDefault: true,
            },
        },
    });
    if (userFind) {
        throw new Error(_localize('validationMessage.emailExists', req));
    }
    const password = await randomPasswordGenerator();
    data.passwords = [
        {
            pass: password,
            isActive: true,
        },
    ];
    let result = await service.createDocument(user, data);
    const checkMailSso = await ssoCheckEmail(email);
    if (!checkMailSso) {
        const ssoData = {
            email: email,
            password: password,
            firstName: data.firstName,
            lastName: data.lastName,
        };
        await ssoRegister(ssoData);
    }
    const emailData = {
        password: password,
        name: result.fullName,
    };

    let template = await getTemplate(
        emailTemplateConstant.NEW_USER_PASSWORD,
        emailData,
    );
    await sendSESEmail(email, template.subject, template.body);
    res.message = _localize('module.create', req, 'user');
    return util.successResponse(result, res);
});

const findAllUser = async (req, res, isExport = false) => {
    try {
        let options = {};
        let query = {};
        let result;
        let roleIds = [];

        if (req.body.query.roles !== undefined) {
            const roleCodes = req.body.query.roles || [];
            const roleData = await Role.find({});
            roleIds = roleCodes.map((roleCode) => {
                const role = roleData.find(
                    (roleData) => roleData.code === roleCode,
                );
                return ObjectId(role?._id);
            });
        }

        if (req.body.isCountOnly) {
            if (req.body.query !== undefined) {
                query = {
                    ...req.body.query,
                };
            }
            result = await service.countDocument(user, query);
            if (result) {
                result = {
                    totalRecords: result,
                };
                return util.successResponse(result, res);
            }
            return util.recordNotFound([], res);
        } else {
            let query = {};
            if (req.body.options !== undefined) {
                options = {
                    ...req.body.options,
                };
            }
            if (req.body.query !== undefined) {
                query = {
                    ...req.body.query,
                };
            }
            if (roleIds.length) {
                query = {
                    ...query,
                    ...{ roleIds: { $in: roleIds } },
                };
            }

            const result = await service.getAllDocuments(
                user,
                _.omit(
                    {
                        ...query,
                        isGuest: false,
                    },
                    ['roles'],
                ),
                options,
            );

            if (isExport === true) {
                return result;
            }

            res.message = _localize('module.findAll', req, 'user');
            return util.successResponse(result, res);
        }
    } catch (error) {
        logger.error(error);
    }
};

const getUser = catchAsync(async (req, res) => {
    let query = {};
    query._id = req.user._id;
    let result = await service.getDocumentByQuery(user, query);
    const permissions = await Permissions.getPermissionService(req.user._id);
    res.message = _localize('module.getModule', req, 'user');
    return util.successResponse({ ...result, permissions }, res);
});

const updateUser = catchAsync(async (req, res) => {
    const data = {
        ...req.body,
        id: req.params.id,
    };
    const findEmail = _.find(data.emails, { isDefault: true });
    const userFind = await user.findOne({
        emails: {
            $elemMatch: {
                email: findEmail.email.toLowerCase(),
                isDefault: true,
            },
        },
        _id: { $ne: data.id },
    });
    if (userFind) {
        throw new Error(_localize('validationMessage.emailExists', req));
    }
    let result = await service.findOneAndUpdateDocument(
        user,
        {
            _id: req.params.id,
        },
        data,
        {
            new: true,
        },
    );

    res.message = _localize('module.update', req, 'user');
    return util.successResponse(result, res);
});

const partiallyUpdate = catchAsync(async (req, res) => {
    let data = req.body;
    if (data.isActive === undefined) {
        throw new Error(_localize('validationMessage.isActive_required'));
    }
    data = {
        isActive: data.isActive,
    };
    const result = await user.findOneAndUpdate(
        { _id: req.params.id, canDel: true },
        data,
        { new: true },
    );
    if (result) {
        res.message = _localize('module.update', req, 'user');
        util.successResponse(result, res);
    } else {
        util.failureResponse(_localize('module.updateError', req, 'user'), res);
    }
});


const deleteUser = catchAsync(async (req, res) => {
    await removeUserFromSSO(req.params.id);
    let result = await service.softDeleteDocument(user, req.params.id);

    res.message = _localize('module.delete', req, 'User');
    return util.successResponse(result, res);
});

const exportUsers = catchAsync(async (req, res) => {
    req.body.options = {
        populate: ['roleIds', 'cityId', 'stateId', 'gender'],
        pagination: false,
        sort: { createdAt: -1 },
    };

    req.body.query = {
        filters: [
            { column: 'expId', value: req.query?.experienceId?.split(',') },
            { column: 'stateId', value: req.query?.stateId?.split(',') },
            { column: 'cityId', value: req.query?.cityId?.split(',') },
            { column: 'countryId', value: req.query?.countryId?.split(',') },
            { column: 'eduId', value: req.query?.educationId?.split(',') },
            { column: 'indId', value: req.query?.industryId?.split(',') },
        ],
        roles: req.query?.roles?.split(','),
        search: req.query.search,
        searchColumns: req.query?.searchColumns?.split(','),
    };
    req.body.query.filters = req.body.query.filters.filter((item) => {
        return item.value !== undefined;
    });
    const result = await findAllUser(req, res, true);

    const { workbook, fileName } = await exportCandidateList(req, result);
    res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
    workbook.xlsx.write(res).then(function () {
        res.end();
    });
});


export default {
    addUser,
    findAllUser,
    getUser,
    updateUser,
    partiallyUpdate,
    deleteUser,
    exportCandidateList,
    exportUsers,
};
