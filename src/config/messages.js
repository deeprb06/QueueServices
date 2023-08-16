/**
 * Configuration file where you can store error codes for responses
 */
export default {
    MESSAGE: {
        ENTER_UNIQUE_CODE: {
            message: 'Please enter unique code.',
        },
        CANNOT_UPDATE_CODE: {
            message: 'Cannot update code.',
        },
        CANNOT_DELETE_MASTER: {
            message: 'Cannot delete master.',
        },
        CREATED: {
            code: 'CREATED',
            message:
                'The request has been fulfilled and resulted in a new resource being created.',
            status: 201,
        },
        CREATE_FAILED: {
            code: 'CREATE_FAILED',
            message: 'The request has not been fulfilled, Please try again',
            status: 500,
        },
        IS_REQUIRED: {
            message: 'is required.',
            code: 'UNPROCESSABLE_ENTITY',
            status: 422,
        },
        IS_DUPLICATE: {
            message: 'already exists.',
            code: 'UNPROCESSABLE_ENTITY',
            status: 422,
        },
        FORBIDDEN: {
            code: 'E_FORBIDDEN',
            message: 'User not authorized to perform the operation',
            status: 403,
        },

        RECORD_NOT_FOUND: {
            code: 'E_NOT_FOUND',
            message: 'Record not found.',
            status: 404,
        },
        OK: {
            code: 'OK',
            message: 'Operation is successfully executed.',
            status: 200,
        },

        SERVER_ERROR: {
            code: 'E_INTERNAL_SERVER_ERROR',
            message: 'Something bad happened on the server.',
            status: 500,
        },
        UNAUTHORIZED: {
            code: 'E_UNAUTHORIZED',
            message: 'Missing or invalid authentication token.',
            status: 401,
        },
        USER_NOT_FOUND: {
            code: 'E_USER_NOT_FOUND',
            message: 'User with specified credentials is not found.',
            status: 401,
        },
        OTP_RESEND_SUCCESS: {
            message: 'OTP has been resend Successfully.',
        },
        EMAIL_NOT_EXISTS: {
            message: 'Email does not exist.',
        },
        LOGIN_VIA_OTP_RESEND: {
            message: 'OTP resend successfully.',
        },
        EMAIL_PASS_NOT_MATCHED: {
            code: 'E_USER_NOT_FOUND',
            message: "Email address and password doesn't match.",
            status: 401,
        },
        BLOCKED_FOR_WRONG_ATTEMPTS: {
            code: 'E_USER_NOT_FOUND',
            message:
                'Your account has been blocked for multiple wrong password attempts. Please try again later.',
            status: 401,
        },

        EMAIL_REGISTERED: {
            code: 'E_DUPLICATE',
            message: 'This Email Address number is already registered.',
            status: 200,
        },
        MOBILE_REGISTERED: {
            code: 'E_DUPLICATE',
            message: 'This phone number is already registered.',
            status: 200,
        },
        USER_NOT_ACTIVE: {
            code: 'E_UNAUTHORIZED',
            message: 'Your account is deactivated.',
            status: 200,
        },
        USER_EMAIL_NOT_VERIFIED: {
            code: 'E_UNAUTHORIZED',
            message: 'Your email is not verified.',
            status: 200,
        },
        USER_MOBILE_NOT_VERIFIED: {
            code: 'E_UNAUTHORIZED',
            message: 'Your mobile is not verified.',
            status: 200,
        },
        USERNAME_REGISTERED: {
            code: 'E_DUPLICATE',
            message: 'Username already registered.',
            status: 200,
        },

        USER_REGISTER_FAILED: {
            code: 'E_INTERNAL_SERVER_ERROR',
            message: ' Failed to registered user.',
            status: 401,
        },
        LOGIN: {
            code: 'OK',
            message: 'Successfully login.',
            status: 200,
        },

        INVALID_PASSWORD: {
            code: 'E_BAD_REQUEST',
            message: 'Invalid password.',
            status: 401,
        },
        INVALID_PASSWORD_CURRENT: {
            code: 'E_BAD_REQUEST',
            message: 'Current password is wrong.',
            status: 401,
        },
        INVALID_TOKEN: {
            code: 'E_BAD_REQUEST',
            message: 'Invalid token.',
            status: 401,
        },

        PROFILE_UPDATED: {
            code: 'OK',
            message: 'Profile updated successfully.',
            status: 200,
        },

        USER_LIST_NOT_FOUND: {
            code: 'E_NOT_FOUND',
            message: 'User not found.',
            status: 404,
        },

        USER_PASSWORD_RESET: {
            code: 'OK',
            message: 'Password changed successfully.',
            status: 200,
        },
        USER_OTP_SENT: {
            code: 'OK',
            message: 'Password reset otp sent successfully.',
            status: 200,
        },

        OTP_VERIFIED: {
            code: 'OK',
            message: 'OTP verified successfully.',
            status: 200,
        },

        OTP_SENT: {
            code: 'OK',
            message: 'OTP sent successfully.',
            status: 200,
        },
        RESET_PASSWORD_LINK_EXPIRE: {
            code: 'E_BAD_REQUEST',
            message: 'Your reset password link is expired or invalid.',
            status: 401,
        },
        OTP_EXPIRE: {
            code: 'E_BAD_REQUEST',
            message: 'Your OTP has been expired.',
            status: 401,
        },

        MOBILE_VERIFIED: {
            code: 'OK',
            message: 'Your mobile number has been successfully verified.',
            status: 200,
        },
        USER_MOBILE_NOT_VERIFIED_UPDATE: {
            code: 'BAD_REQUEST',
            message: 'Verify your mobile number before update.',
            status: 200,
        },
        INVALID_VERIFICATION_TOKEN: {
            code: 'E_USER_NOT_FOUND',
            message: 'Your token is invalid or expired.',
            status: 401,
        },
        MOBILE_ALREADY_VERIFIED: {
            code: 'E_BAD_REQUEST',
            message: 'Mobile number is already verified.',
            status: 401,
        },
        MOBILE_VERIFICATION: {
            code: 'OK',
            message: 'OTP has been sent to your mobile number.',
            status: 200,
        },

        RESET_PASSWORD_LINK_MOBILE: {
            code: 'OK',
            message: 'Please check your mobile to reset your password.',
            status: 200,
        },
        USER_NOT_EXIST_FOR_EMAIL: {
            code: 'E_NOT_FOUND',
            message: 'This email address is not registered.',
            status: 200,
        },

        NO_RECORD_FOUND: {
            code: 'E_NOT_FOUND',
            message: 'No record found.',
            status: 402,
        },

        LIST_NOT_FOUND: {
            code: 'E_NOT_FOUND',
            message: 'List not found.',
            status: 200,
        },
        EMAIL_NOT_REGISTERED: {
            code: 'E_DUPLICATE',
            message: "This isn't an email we know.",
            status: 200,
        },
        EMAIL_NOT_FOUND: {
            code: 'E_USER_NOT_FOUND',
            message: 'Email address does not exist.',
            status: 200,
        },
        EMAIL_CANT_LOGIN_PATIENT: {
            code: 'E_USER_NOT_FOUND',
            message: "You can't login as patient with this email.",
            status: 200,
        },

        SOMETHING_WENT_WRONG: {
            message: 'Something went wrong.',
        },
        FAILED_TO_UPDATE_ALL_RECORDS: {
            message: 'Failed to update all records.',
        },
        ERROR: {
            message: 'Error.',
        },
        REQUEST_IS_NOT_VALID_TRY_AGAIN: {
            message: 'This request is not valid , Please try again !.',
        },
        SUCCESS: {
            message: 'success',
        },
        FILE_UPLOADED_SUCCESSFULLY: {
            message: ' file uploaded successfully.',
        },
        FILE_DELETED_SUCCESSFULLY: {
            message: ' file deleted successfully.',
        },
        DELETE_SUCCESSFULLY: {
            message: 'deleted successfully.',
        },
        LINK_SHARE_SUCCESSFULLY: {
            message: 'Link Shared successfully.',
        },
        CONFIG_NOT_FOUND: {
            code: 'E_NOT_FOUND',
            message: 'Configuration not found.',
            status: 200,
        },
        CONFIG_UPDATED: {
            code: 'OK',
            message: 'Configuration is successfully updated.',
            status: 200,
        },
        EMAIL_VERIFICATION_OTP: {
            code: 'OK',
            message: 'OTP has been sent to your email.',
            status: 200,
        },
        LOGIN_OTP_VERIFIED: {
            code: 'OK',
            message: 'Your log in OTP has been successfully verified.',
            status: 200,
        },
        UPDATE_PROFILE_OTP_VERIFIED: {
            code: 'OK',
            message:
                'Your mobile verification OTP has been successfully verified.',
            status: 200,
        },
        RECORDS_STATUS_UPDATE: {
            code: 'OK',
            message: 'Records status updated successfully.',
            status: 200,
        },
        RECORD_DELETED_SUCCESSFULLY: {
            code: 'OK',
            message: 'Record deleted successfully.',
            status: 200,
        },
        MASTER_NAME_DUPLICATE: {
            code: 'E_DUPLICATE',
            message: 'Name must not be duplicate.',
        },
        ITEM_DELETED: {
            message: ' has been deleted Successfully',
        },
    },
    NOTIFICATION_MESSAGE: {
        REFERRAL_CREATED: () => {
            return `Your child's primary care provider has created a referral on WonderMD. In order to proceed, please log in and complete the information required to submit the referral. ${process.env.CLIENT_URL}`;
        },
        REFERRAL_CREATED_BY_FAMILY: () => {
            return `A family has requested you complete a referral for one of their children on WonderMD. Please log in to the app and complete the referring provider portion of the referral. ${process.env.CLIENT_URL}`;
        },
        REFERRAL_CREATED_BY_FAMILY_TO_PROVIDER: () => {
            return `Thank you, your referral has been created and sent to your referring provider. Once they have submitted the relevant information, your referral status will be updated. Stay tuned - soon you will be be able to select your WonderMD specialist and schedule your appointment! Don't forget, you can check the status of your referral on My Wonder Page.`;
        },
        SCHEDULE_APPOINTMENT: () => {
            return `Please go ahead and choose a consulting provider and schedule your appointment! Thank You.`;
        },
        NEW_CONSULTANT_RECEIVED: () => {
            return `You have received a new consult on wonderMD. Log in to approve or decline the request.`;
        },
        CONSULTANT_OPTED_OUT_REFERRING: () => {
            return `Your family has requested a referral from a Consulting Provider who will contact them directly to make an appointment.`;
        },
        CONSULTANT_OPTED_OUT_FAMILY: () => {
            return `The specialist you requested has accepted your consult request. Their office will reach out to you directly to schedule an appointment. Should you not receive any communications within 5 days, send us a Comment in the app and we will look into this for you. After your meeting with them, we invite you to complete a review of their services in our app.`;
        },
        APPOINTMENT_APPROVED_REFERRING: (date, time, fullName) => {
            return `A WonderMD consult has been scheduled on ${date} at ${time} with ${fullName}. You may follow the status of the appointment on your WonderMD Appointment Page.`;
        },
        APPOINTMENT_APPROVED_FAMILY: () => {
            return `Your WonderMD referral has been accepted! Please visit the Appointments tab in your My Wonder Page to follow along with the status of your appointment.`;
        },
        APPOINTMENT_DECLINED: (reason) => {
            return `Your referral request has been declined by the consulting provider because of ${reason}. Please review the referral again or select an alternative provider.`;
        },
        CANCEL_APPOINTMENT_PROVIDER_BEFORE: (date, time, reason) => {
            return `Regretably, the consulting provider has had to cancel the appointment on ${date} and ${time} due to ${reason}. We have now cancelled the scheduled appointment and ask you to choose another consulting provider. We apologize for this inconvenience will be looking into this matter.`;
        },
        CANCEL_APPOINTMENT_PROVIDER_AFTER: (reason) => {
            return `Regretably, the consulting provider has had to cancel the appointment on short notice due to ${reason}. We have now cancelled the scheduled appointment and ask you to choose another consulting provider. We apologize for this inconvenience will be looking into this matter.`;
        },
        ADMIN_CANCEL_APPOINTMENT_BEFORE: (providerName, parentName) => {
            return `${providerName} has cancelled an appointment with ${parentName} within 24 hours of the scheduled appointment.`;
        },
        CHANGE_PROVIDER_TYPE_APPROVED: () => {
            return `You are now approved by WonderMD, Kindly complete you profile service, financial details and your availability on our platform.`;
        },
        CHANGE_PROVIDER_TYPE_DECLINED: () => {
            return `WonderMD Declined your request to be consulting provider.`;
        },
        DEACTIVATED_FAMILY: () => {
            return 'We are sorry to see you go. Your account has been de activated, however, your private health information must be kept on our servers until your child reaches 28 years old. Following their 28th birthday, their information will be permanently deleted.';
        },
        DEACTIVATED_CONSULTING_PROVIDER: () => {
            return 'We’re sorry to see you go! Your account has been deactivated. We are always happy to receive feedback via hello@wondermd.ca';
        },
        DEACTIVATED_REFERRING_PROVIDER: () => {
            return 'We’re sorry to see you go! Your account has been deactivated. Please note that your patient’s information must legally be stored on our servers until they are 28 years old. Following their 28th birthday, their information will be permanently deleted.';
        },
        PROVIDER_REQUESTED_FAMILY: (providerName) => {
            return `Hello from WonderMD! Your primary care provider,${providerName}, has submitted a referral request on your behalf to see a pediatric specialist. To complete the referral and schedule an appointment with your preferred specialist, register here ${process.env.CLIENT_URL}`;
        },
        FAMILY_REQUESTED_PROVIDER: (fullName) => {
            return `Hey there,You've been invited to join WonderMD by a patient of yours! WonderMD is a telemedicine platform that allows physicians to connect with a growing community of pediatric specialists. The platform is both web and app-based. We make it easy to create and track the status of referrals. The ${fullName} family has identified you as their primary care provider and would like to connect with a pediatric specialist on our system. To allow them to complete this process, please register and submit the relevant referral information.Signing up with WonderMD takes less than 5 minutes and is free for referring providers like yourself! Please follow this link to register and join WonderMD! ${process.env.CLIENT_URL}>`;
        },
        TRANSACTION_SUCCESS_CONSULTING_PROVIDER: (parentName) => {
            return `WonderMD has received payment for your services from the ${parentName} family. You will be sent this payment less 10% + HST shortly.`;
        },
        ADMIN_REQUESTED_PROVIDER: () => {
            return `You've been invited to join WonderMD!WonderMD is a telemedicine platform that allows physicians to connect with a growing community of pediatric specialists. The platform is both web and app based. We make it easy to create and track the status of referrals.Please register and submit the relevant referral information.Signing up with WonderMD takes less than 5 minutes! Please follow this link to register and join WonderMD!${process.env.CLIENT_URL}>`;
        },

        TRANSACTION_SUCCESS_FAMILY: (amount) => {
            return `WonderMD has successfully charged your credit card $${amount}.`;
        },
        TRANSACTION_SUCCESS_FAMILY_FREE: () => {
            return `WonderMD has booked the appointment for free.`;
        },

        TRANSACTION_SUCCESS_PROVIDER: (familyName) => {
            return `WonderMD has received payment for your services from the ${familyName}. You will be sent this payment less 10% + HST shortly.`;
        },

        TRANSACTION_FAILED_FAMILY: () => {
            return `WonderMD was not able to charge your credit card. Please re enter your credit card information and try again.`;
        },

        NOTES_MESSAGE: () => {
            return "Thank you, your referral has been created and sent to your referring provider.  Once they have submitted the relevant information, your referral status will be updated. Stay tuned - soon you will be be able to select your WonderMD specialist and schedule your appointment!  Don't forget, you can check the status of your referral on My Wonder Page.";
        },
        APPOINTMENT_DETAILS: () => {
            return 'A referral to WonderMD was completed recently. Please log in and check the summary of the appointment. It is the responsibility of the consulting provider to ensure all notes, letters, consultations, and requisitions are completed.';
        },
        APPOINTMENT_CANCELLED_CONSULTING_PROVIDER: (date, time) => {
            return `Unfortunately, your appointment on ${date} at ${time} has been cancelled. Your availability will be adjusted accordingly so that another patient may schedule a consult.`;
        },
        APPOINTMENT_CANCELLED_CONSULTING_PROVIDER_AFTER: (date, time) => {
            return `Unfortunately, it appears that a family has cancelled their appointment with you. You now have an open slot in your schedule on ${date} and ${time}. We will make every effort to fill this spot in a timely manner.`;
        },

        APPOINTMENT_CANCELLED_FAMILY_BEFORE: () => {
            return 'An automatic fee of $50 has been charged to your credit card as outlined in the Terms of Use for appointments that are cancelled with less than 24 hours notice.';
        },

        VideoCall_Completed: () => {
            return `Video Call has been completed.`;
        },

        // IN APP NOTIFICATION
        FAMILY_CREATED_REFERRAL: (name) => {
            return `${name} has Requested a referral from you.`;
        },
        PROVIDER_CREATED_REFERRAL: (providerName, patientName) => {
            return `${providerName} has created a referral for ${patientName} child.`;
        },
        REFERRAL_APPROVED: (patientName, providerName) => {
            return `${patientName}'s referral is approved by ${providerName}.`;
        },
        REFERRAL_DECLINED: (providerName) => {
            return `${providerName} declined your referral request.`;
        },
        APPOINTMENT_CREATED: (patientName) => {
            return `${patientName}has requested an appointment with you.`;
        },
        REQUESTED_FOLLOW_UP: () => {
            return `A follow up for appointment is requested.`;
        },
        APPOINTMENT_CREATED_REFERRAL: (patientName) => {
            return `${patientName} has booked an appointment for the referral you created/approved.`;
        },
        APPOINTMENT_APPROVED: (providerName) => {
            return `Appointment with ${providerName} Booked Successfully.`;
        },
        APPOINTMENT_DECLINED_PROVIDER: (providerName) => {
            return `${providerName} declined your appointment request.`;
        },
        CANCEL_APPOINTMENT: (patientName, reason) => {
            return `${patientName}'s appointment was canceled because of ${reason} reason.`;
        },
        RESCHEDULE_APPOINTMENT: (parentName, patientName) => {
            return `${parentName} has requested to reschedule an ${patientName} appointment.`;
        },
        CHANGE_PROVIDER_TYPE: (name) => {
            return `${name} wants to be a consulting provider.`;
        },
        CHANGE_PROVIDER_TYPE_ADMIN: (name) => {
            return `A referring provider ${name} has requested a change in their status to a consulting provider.`;
        },
        PROVIDER_DID_NOT_JOIN_CALL: (providerName, parentName) => {
            return `Provider ${providerName} didn't join ${parentName} appointment`;
        },
        REBOOK_APPOINTMENT: (providerName) => {
            return `Provider ${providerName} was not available for some reason kindly rebook appointment.`;
        },
        TRANSACTION_SUCCESS: (transactionNumber) => {
            return `A transaction is Success ${transactionNumber}.`;
        },
        TRANSACTION_FAILED: (transactionNumber) => {
            return `A transaction is failed ${transactionNumber}.`;
        },
        REQUEST_TO_CHANGE_PROVIDER_APPROVE: () => {
            return 'You are now approved by WonderMD, Kindly complete you profile service, financial details and your availability on our platform.';
        },

        REQUEST_TO_CHANGE_PROVIDER_DECLINED: () => {
            return 'WonderMD Declined your request to be consulting provider.';
        },

        LOGIN_OTP: (OTP) => {
            return `Enter the Following OTP ${OTP} to continue login to WonderMD.`;
        },
        SIGNUP_OTP: (OTP) => {
            return `Enter the following OTP ${OTP} to complete the Sign-up process.`;
        },
        FORGOT_PASSWORD_OTP: (OTP) => {
            return `Please use this ${OTP} code to reset your password.`;
        },
        RESET_PASSWORD_LINK: (link) => {
            return `Please use this link to reset your password.`;
        },
        WELCOME_EMAIL: () => {
            return `Thank you for registering with WonderMD. Welcome and please enjoy all the services WonderMD has to offer.`;
        },
        ADMIN_NEW_PROVIDER_ADDED: (name) => {
            return `New provider named ${name}joined the platform.`;
        },
        RESCHEDULE_APPOINTMENT_DATE_TIME: (
            oldDate,
            oldTime,
            newDate,
            newTime,
        ) => {
            return `Your appointment on ${oldDate} at ${oldTime} has been rescheduled for ${newDate} at ${newTime}.`;
        },
        RESCHEDULE_APPOINTMENT_DATE_TIME_FAMILY: (date, time) => {
            return `Your appointment has been changed to ${date} at ${time}.`;
        },
        ADMIN_NEW_PROVIDER_SIGNUP: (providerName) => {
            return `A new provider ${providerName} has requested approval to use WonderMD.`;
        },
        APPROVE_CONSULTING_PROVIDER: () => {
            return `Congratulations and welcome to WonderMD! We hope that you find our community and platform a useful tool in your practice! On WonderMD, you can join a community of pediatric specialists, receive referrals from all across Ontario, connect with families and children who are looking for your own services and complete all your visits and notes on our platform! Enjoy all the features WonderMD has to offer.`;
        },
        APPROVE_REFERRING_PROVIDER: () => {
            return `Congratulations and welcome to WonderMD! You can submit, track, update and follow your referrals on our platform. Our platform also lets you connect your families to our growing list of pediatric specialists! Feel free to share this app with your colleagues!`;
        },
        DECLINE_CONSULTING_PROVIDER: () => {
            return `Unfortunately, we cannot accept your request to join WonderMD as a consultant at this time. Please review your information and re-submit or reach out to us at hello@wondermd.ca.`;
        },
        DECLINE_REFERRING_PROVIDER: () => {
            return `Unfortunately, we cannot accept your request to join WonderMD as a referring provider at this time. Please review your information and re-submit or reach out to us at hello@wondermd.ca.`;
        },
        PASSWORD_CHANGE_SUCCESS: () => {
            return 'Password successfully changed!';
        },
        FAILED_SCHEDULING_ADMIN: (referringName, patientName) => {
            return `The appointment initiated by ${referringName} for ${patientName} has failed to be scheduled.`;
        },
    },
};
