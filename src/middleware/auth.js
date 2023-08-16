import Role from '../models/role';
import User from '../models/user';
import { ObjectId } from 'mongoose';
import { RESPONSE_CODE } from '../config/common';
import responseCode from '../helpers/utils/responceCode'
import jwt from 'jsonwebtoken';
import config from '../config';
import rolePermission from '../services/rolePermission';

export async function checkPermission(req, res, next) {
    try {
        
        const result = await rolePermission.permit(req);
        if (result) {
            const user = req.user;
            if (req.method === 'POST') {
                req.body.createdBy = user._id || '';
            } else if (req.method === 'PUT') {
                const softDelete = req.originalUrl.search('soft-delete');
                if (softDelete !== -1) {
                    req.body.isDeleted = await convertToTz({ tz: process.env.TZ, date: new Date()});
                    req.body.deletedBy = user._id || '';
                    req.body.isActive = false;
                }
                req.body.updatedBy = user._id || '';
            }
            next();
        } else {
            return res.status(403).send({ message: _localize('auth.user_not_allowed', req) });
        }
    } catch (err) {
        console.error('Error - checkPermission', err);
        res.status(responseCode.validationError).json({
            code: RESPONSE_CODE.ERROR,
            message: _localize(err.message, req),
        });
    }
}

export async function authentication(req, res, next) {
    try {
        const token = req.header('auth-token');

        if (!token) {
            return res.status(responseCode.unAuthorized).send({ status: responseCode.unAuthorized, message: 'Token Not Provided', data: {} })
        }

        jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).send({ status: 401, message: 'Access denied', data: {} });
            }
            else {
                req.user = decoded;
                next();
            }
        })
        next();
    } catch (err) {
        console.error('err', err);
        throw new Error(err);
    }
}

