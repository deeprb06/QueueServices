import Role from '../models/role';
import { ObjectId } from 'mongoose';
import roleAndPermissionService from '../services/rolePermission';

const getPermission = catchAsync(async (req, res) => {
    let id = req.userId;
    let result = await roleAndPermissionService.getPermissionService(id);
    if (result) {
        res.message = _localize('module.getModule', req, 'permission');
        util.successResponse(result, res);
    } else {
        util.recordNotFound(
            _localize('module.notFound', req, 'permission'),
            res,
        );
    }
});
const updatePermission = catchAsync(async (req, res) => {
    let roleId = req.body.roleId;
    let permissionIds = req.body.permissionIds;
    let result = await roleAndPermissionService.updatePermissionService(
        roleId,
        permissionIds,
    );
    if (result) {
        let role = await Role.findOne({ _id: roleId }).populate('permissions');
        res.message = _localize('module.update', req, 'permission');
        util.successResponse(role, res);
    } else {
        util.failureResponse(
            _localize('module.updateError', req, 'permission'),
            res,
        );
    }
});
const getAllPermission = catchAsync(async (req, res) => {
    let result = await roleAndPermissionService.getAllPermissionService();
    if (result) {
        res.message = _localize('module.findAll', req, 'permission');
        util.successResponse(result, res);
    } else {
        util.failureResponse(
            _localize('module.notFound', req, 'permission'),
            res,
        );
    }
});
const getByRole = catchAsync(async (req, res) => {
    let id = ObjectId(req.params.id);
    let result = await roleAndPermissionService.getPermissionByIdService(id);
    if (result) {
        res.message = _localize('module.getModule', req, 'permission');
        util.successResponse(result, res);
    } else {
        util.failureResponse(
            _localize('module.notFind', req, 'permission'),
            res,
        );
    }
});

export default {
    getPermission,
    updatePermission,
    getAllPermission,
    getByRole,
};
