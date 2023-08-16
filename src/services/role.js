
import Role from '../models/role';
import service from '../helpers/utils/dbservices';

const createService = async (data) => {
    try {
        let findRole = await Role.findOne({ code: data.code });
        if (!findRole) {
            return await Role.create(data);
        } else {
            return findRole;
        }
    } catch (error) {
        logger.error('Error - rolecreating', error);
        throw new Error(error.message);
    }
};

const updateService = async (data, id) => {
    try {
        let updatedData = await service.findOneAndUpdateDocument(
            Role,
            { _id: id },
            data,
            {
                new: true,
            },
        );
        if (updatedData) {
            return updatedData;
        } else {
            return false;
        }
    } catch (error) {
        logger.error('Error - roleupdating', error);
        throw new Error(error.message);
    }
};

const deleteService = async (id) => {
    try {
        let deletedData = await Role.findOneAndDelete({
            _id: id,
            canDel: true,
        });
        if (deletedData) {
            return deletedData;
        } else {
            return false;
        }
    } catch (error) {
        logger.error('Error - roledeleting', error);
        throw new Error(error.message);
    }
};

const getRoleService = async (id) => {
    try {
        let result = await Role.findOne({ _id: id });
        if (result) {
            return result;
        } else {
            return false;
        }
    } catch (error) {
        logger.error('Error - rolegetting', error);
        throw new Error(error.message);
    }
};
const getRoleListService = async () => {
    try {
        let result = await Role.find({});
        if (result) {
            return result;
        } else {
            return false;
        }
    } catch (error) {
        logger.error('Error - rolelisting', error);
        throw new Error(error.message);
    }
};
export default {
    createService,
    updateService,
    deleteService,
    getRoleService,
    getRoleListService,
};
