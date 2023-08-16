import roleService from ('../../services/role');
import role from ('../../models/role');
import service from ('../../utils/dbService');
import { deleteDependentDocuments } from ('../../utils/dependentOperation');
import user from ('../../models/user');

const create = catchAsync(async (req, res) => {
    const data = new role({
        ...req.body,
    });
    const roleFind = await role.findOne({
        code: data.code,
    });
    if (roleFind) {
        throw new Error(_localize('validationMessage.roleExists', req));
    }
    const result = await service.createDocument(role, data);
    if (result) {
        res.message = _localize('module.create', req, 'role');
        return util.successResponse(result, res);
    } else {
        return util.failureResponse(
            _localize('module.alreadyFound', req, 'role'),
            res,
        );
    }
});

const update = catchAsync(async (req, res) => {
    let id = req.params.id;
    const data = { ...req.body };
    const roleFind = await role.findOne({
        code: data.code,
        _id: { $ne: id },
    });
    if (roleFind) {
        throw new Error(_localize('validationMessage.roleExists', req));
    }
    let result = await roleService.updateService(req.body, id);
    if (result) {
        res.message = _localize('module.update', req, 'role');
        return util.successResponse(result, res);
    } else {
        return util.failureResponse(
            _localize('module.updateError', req, 'role'),
            res,
        );
    }
});

const deleteRole = catchAsync(async (req, res) => {
    let id = req.params.id;
    let result = await service.deleteDocument(role, { _id: id, canDel: true });
    if (result.deletedCount) {
        const relations = [
            {
                model: 'permissionRole',
                filter: { role_id: id },
            },
        ];
        await deleteDependentDocuments(relations);
        res.message = _localize('module.delete', req, 'role');
        util.successResponse(result, res);
    } else {
        util.failureResponse(_localize('module.deleteError', req, 'role'), res);
    }
});
const getRole = catchAsync(async (req, res) => {
    let id = req.params.id;
    let result = await roleService.getRoleService(id);
    if (result) {
        res.message = _localize('module.getModule', req, 'role');
        util.successResponse(result, res);
    } else {
        util.failureResponse(_localize('module.notFound', req, 'role'), res);
    }
});
const partiallyUpdate = catchAsync(async (req, res) => {
    let data = req.body;
    if (data.isActive === undefined) {
        throw new Error(_localize('validationMessage.isActive_required'));
    }
    data = {
        isActive: data.isActive,
    };
    const result = await role.findOneAndUpdate(
        { _id: req.params.id, canDel: true },
        data,
    );
    if (result) {
        res.message = _localize('module.update', req, 'role');
        util.successResponse(result, res);
    } else {
        util.failureResponse(_localize('module.deleteError', req, 'role'), res);
    }
});
const findAllRole = catchAsync(async (req, res) => {
    const result = await service.getAllDocuments(role, req.body?.query ?? {}, req.body?.options ?? {});
    if (result) {
        res.message = _localize('module.findAll', req, 'role');
        util.successResponse(result, res);
    } else {
        util.failureResponse(_localize('module.notFound', req, 'role'), res);
    }
});

export default {
    create,
    update,
    deleteRole,
    getRole,
    findAllRole,
    partiallyUpdate,
};
