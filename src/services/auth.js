const User = require('../models/user');

const forgotPassword = async (req) => {
    try {
    } catch (error) {
        console.error(error);
    }
};

const sendLoginOtp = async (user, templateCode) => {
    const OTP = Math.floor(100000 + Math.random() * 900000);
    const sysdate = convertToTz();
    const codeExpiresTime = moment(sysdate)
        .add(10, 'minutes')
        .format('YYYY-MM-DD HH:mm:ss');
    await User.findByIdAndUpdate(
        {
            _id: user._id,
        },
        {
            loginCode: OTP,
            codeExpiresOn: codeExpiresTime,
        },
    );
    const emailData = {
        otp: OTP,
        name: user.fullName,
    };
    let template = await getTemplate(templateCode, emailData);
    const findEmail = _.find(user.emails, { isDefault: true });
    await sendSESEmail(findEmail.email, template.subject, template.body);
};

const loginDeviceUser = async (email, req) => {
    let user = await User.findOne({
        email: email,
    }).lean();
    if (user && user.emails?.length) {
        let result = {};
        result.success = true;
        const params = req.body;
        if (params.firstName && params.lastName && params.mobile) {
            user.fullName = `${params.firstName} ${params.lastName}`;
            const updateData = {
                firstName: params.firstName,
                lastName: params.lastName,
                fullName: user.fullName,
                mobile: {
                    no: params.mobile.no.replaceAll(/\s+/g, ''),
                    cCode: params.mobile.cCode,
                },
                stateId: params?.stateId,
                stateNm: params?.stateNm,
                cityId: params?.cityId,
                cityNm: params?.cityNm,
            };
            await User.updateOne({ _id: user._id }, updateData);
        }
        await sendLoginOtp(user, emailTemplateConstant.SIGN_UP_OTP);
        return result;
    } else {
        throw new Error(_localize('auth.account_not_found_email', req));
    }
};

const forgetPasswordService = async (email, adminApi = false) => {
    try {
        let user = await User.findOne({
            email: email,
        });
        if (user) {
            const OTP = Math.floor(100000 + Math.random() * 900000);
            const sysdate = convertToTz();
            const codeExpiresTime = moment(sysdate)
                .add(10, 'minutes')
                .format('YYYY-MM-DD HH:mm:ss');
            const emailData = {
                otp: OTP,
                name: user.fullName,
            };

            let template = await getTemplate(
                emailTemplateConstant.FORGOT_PASSWORD,
                emailData,
            );
            await sendSESEmail(email, template.subject, template.body);
            await User.findOneAndUpdate(
                {
                    email: email,
                },
                {
                    loginCode: OTP,
                    codeExpiresOn: codeExpiresTime,
                },
                { new: true },
            );
            return true;
        } else {
            return false;
        }
    } catch (error) {
        logger.error('Error - forgotPassword', error);
        throw new Error(error);
    }
};

const resetPasswordValidationService = async (email, token) => {
    try {
        let payload = jwt.verify(token, JWT.SECRET);
        if (payload) {
            let user = User.findOne({
                _id: payload.id,
                passwords: {
                    reset: {
                        token: token,
                        email: email,
                    },
                },
            });
            if (user) {
                return true;
            }
        }
        return false;
    } catch (error) {
        if (error.name == 'JsonWebTokenError' || error.name == 'SyntaxError') {
            return false;
        } else {
            logger.error('Error - restingpassword', error);
            throw new Error(error.message);
        }
    }
};

const resetPasswordService = async (password, code, email, i18n) => {
    try {
        let user = await User.findOne({
            email: email,
        });
        if (user && user.passwords) {
            const sysDateTime = convertToTz();
            const expireTime = moment(
                user.codeExpiresOn,
                'YYYY-MM-DD HH:mm:ss',
            ).format('YYYY-MM-DD HH:mm:ss');
            if (expireTime >= sysDateTime || code === process.env.MASTER_OTP) {
                if (
                    code === process.env.MASTER_OTP ||
                    code === user.loginCode
                ) {
                    let flag = true;
                    let userPasswords = _.orderBy(
                        user.passwords,
                        ['createdAt'],
                        ['desc'],
                    );
                    let itr =
                        userPasswords.length < 5 ? userPasswords.length : 5;
                    {
                        for (let i = 0; i < itr; i++) {
                            if (userPasswords[i]?.pass) {
                                let result = await bcrypt.compare(
                                    password,
                                    userPasswords[i]?.pass,
                                );
                                if (result) {
                                    flag = false;
                                }
                            }
                        }
                    }
                    if (flag) {
                        await User.updateOne(
                            {
                                _id: user._id,
                                passwords: {
                                    $elemMatch: {
                                        isActive: true,
                                    },
                                },
                            },
                            {
                                $set: {
                                    'passwords.$.isActive': false,
                                },
                            },
                        );

                        let bcryptPassword = await bcrypt.hash(password, 8);
                        let updateData = {
                            passwords: {
                                pass: bcryptPassword,
                                isActive: true,
                                reset: {},
                            },
                        };

                        await User.updateOne(
                            { _id: user._id },
                            {
                                $unset: { codeExpiresOn: 1, loginCode: 1 },
                                $push: updateData,
                            },
                        );
                        await User.findOneAndUpdate(
                            {
                                emails: {
                                    $elemMatch: {
                                        email: email.toLowerCase(),
                                    },
                                },
                            },
                            {
                                $set: {
                                    isVerified: true,
                                },
                            },
                        );
                        const emailData = {
                            name: user.fullName,
                        };

                        let template = await getTemplate(
                            emailTemplateConstant.PASSWORD_RESET,
                            emailData,
                        );
                        await sendSESEmail(
                            email.toLowerCase(),
                            template.subject,
                            template.body,
                        );
                        return { flag: true, data: user };
                    } else {
                        return {
                            flag: false,
                            data: i18n.t('auth.password_error'),
                        };
                    }
                }
                return { flag: false, data: i18n.t('auth.otp_invalid') };
            }
            return { flag: false, data: i18n.t('auth.otp_expired') };
        }
        return { flag: false, data: i18n.t('auth.account_not_found_email') };
    } catch (error) {
        logger.error('Error - restingpassword', error);
        throw new Error(error.message);
    }
};
const verifyLoginOtpService = async (params) => {
    try {
        const email = params.email;
        const code = params.code;
        const i18n = params.i18n;
        const user = await User.findOne({
            email: email,
        }).select('-passwords -tokens');
        if (user) {
            const sysDateTime = convertToTz();
            const expireTime = moment(
                user.codeExpiresOn,
                'YYYY-MM-DD HH:mm:ss',
            ).format('YYYY-MM-DD HH:mm:ss');
            if (expireTime >= sysDateTime || code === process.env.MASTER_OTP) {
                if (
                    code === process.env.MASTER_OTP ||
                    code === user.loginCode
                ) {
                    let token = await generateTokenManually({ email, user });
                    const permissions = await Permissions.getPermissionService(
                        user._id,
                    );
                    const userToReturn = {
                        ...user._doc,
                        ...{
                            token,
                            permissions,
                        },
                    };
                    await User.updateOne(
                        { _id: user._id },
                        { $unset: { codeExpiresOn: 1, loginCode: 1 } },
                    );
                    return { flag: true, data: userToReturn };
                }
                return { flag: false, data: i18n.t('auth.otp_invalid') };
            }
            return { flag: false, data: i18n.t('auth.otp_expired') };
        }
        return { flag: false, data: i18n.t('auth.account_not_found_email') };
    } catch (error) {
        logger.error('Error - loginViaOtpService', error);
        throw new Error(error.message);
    }
};
