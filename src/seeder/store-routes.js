const Role = require('../models/role');
const Permission = require('../models/permission');
const PermissionRole = require('../models/permissionRole');
const { USER_ROLES } = require('../config/constants/authConstant');

const storeModules = async (route, roles) => {
    try {
        const modulePromises = route.descriptor.map(async (descriptor) => {
            let findPermission = await Permission.findOne({ route_name: descriptor });
    
            const data = {
                route_name: descriptor,
                module: descriptor.substring(0, descriptor.indexOf('.')),
                uri: route.path,
            };
    
            if (!findPermission) {
                findPermission = await Permission.create(data);
            }
    
            for (const role of roles) {
                const permissionRoleData = {
                    permission_id: findPermission.id,
                    role_id: role.id,
                    canDel: false,
                };
    
                const findPermissionRole = await PermissionRole.findOne(permissionRoleData);
    
                if (!findPermissionRole) {
                    await PermissionRole.create(permissionRoleData);
                }
            }
    
            return data;
        });
    
        return Promise.all(modulePromises);
    } catch (error) {
        console.error('error: ', error);
        logger.error('ERROR in storemodules', error);
    }
};


const store = async (routeList) => {
    if (!routeList || !routeList.length) {
        return;
    }

    try {
        const roles = await Role.find({ code: USER_ROLES.ADMIN });

        await Promise.all(
            routeList.map(async (route) => {
                const desCondition =
                    route.hasOwnProperty('descriptor') &&
                    Array.isArray(route.descriptor) &&
                    route.descriptor.length > 0 &&
                    !_.isUndefined(_.first(route.descriptor)) &&
                    !_.isNull(_.first(route.descriptor));
                if (desCondition) {
                    await storeModules(route, roles);
                }
            }),
        );

        logger.info('Store routes completed!');
    } catch (error) {
        logger.error('Store routes failed!', error);
    }
};


module.exports = {
    store
}