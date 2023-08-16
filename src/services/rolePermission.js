import { ObjectId } from 'mongoose';
import Permission from '../models/permission';
import PermissionRole from '../models/permissionRole';
import User from '../models/user';
import Role from '../models/role';

const permit = async (req) => {
    if (req.route.hasOwnProperty('o')) {
        const permission = await Permission.findOne({ route_name: req.route['o'] });
        if (!permission) {
            return true;
        }
        let permissionExist = null;

        if (!req.roleIds) {
            throw new Error('Please provide role ids in request object');
        }
        permissionExist = await PermissionRole.countDocuments({
            permission_id: permission.id,
            role_id: req.roleIds
        });

        return permissionExist;
    } else {
        return true;
    }
};

const getPermissionService = async (id) => {
    try {
        const user = await User.findOne({ _id: id });
        if (user) {
            const roles = await Role.find({ _id: { $in: user.roleIds } });
            const permissionRoles = await PermissionRole.find({
                role_id: { $in: roles.map((role) => role._id) },
            }).select('permission_id');
            const permissionRoleIds = permissionRoles.map(
                (permission) => permission.permission_id,
            );
            let permissions = await Permission.find({
                _id: { $in: permissionRoleIds },
            }).select(['route_name', 'module']);
            permissions = _.groupBy(permissions, 'module');
            const rolePermissions = {};
            Object.keys(permissions).map((objectKey) => {
                rolePermissions[objectKey] = permissions[objectKey].map(
                    (a) => a.route_name.split('.')[1],
                );
                return objectKey;
            });
            rolePermissions.roles = roles.map((a) => a.code);
            return rolePermissions;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error - gettingrolepermission', error);
        throw new Error(error.message);
    }
};

const updatePermissionService = async (roleId, permissionIds) => {
    try {
        let role = await Role.findOne({_id: roleId});
        if (role) {
                await PermissionRole.deleteMany({
                role_id: roleId,
                canDel: true
            });
            if (permissionIds.length) {
                await Promise.all(_.map(permissionIds, async (permissionId) => {
                    let permission = await Permission.findOne({_id: permissionId});
                    console.info(permission);
                    if (permission) {
                        let data = {
                            permission_id: permissionId,
                            role_id: roleId,
                        };
                        const permissionRole = await PermissionRole.findOne(data);
                        if (!permissionRole) {
                            await PermissionRole.create(data);
                        }
                    }

                }))
            }
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error - updatingrolepermission", error);
        throw new Error(error.message);
    }
};

const getAllPermissionService = async () => {
    try {
        let permission = await Permission.find();
        if (permission) {
            return permission;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error - gettingrolepermission", error);
        throw new Error(error.message);
    }
};
const getPermissionByIdService = async (id) => {
    try {
        let permissions = await Permission.find().lean();
        const allPermissions = await Promise.all(_.map(permissions, async (permission) => {
            const permissionRole = await PermissionRole.findOne({role_id: id, permission_id: permission._id});
            let obj = {..._.pick(permission, ['_id', 'route_name', 'module']), selected: !!permissionRole}
            obj.route_name = permission.route_name.split('.')[1]
            return obj
        }))
        return _.groupBy(allPermissions, 'module');
    } catch (error) {
        console.error("Error - gettingrolepermission", error);
        throw new Error(error.message);
    }
};

export default {
    getPermissionService,
    updatePermissionService,
    getAllPermissionService,
    getPermissionByIdService,
    permit
};
