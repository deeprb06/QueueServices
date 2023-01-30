import { createJobQueue } from "../bull-jobs/createJob";
import config from "../../config";

export const emailFunction = async(eventName, user, payload) => {
     const emailObj = {
         eventName: eventName,
         user: user,
         payload: payload
     }
     await createJobQueue(config.JOB_NAME.SENDMAIL, emailObj); // 3rd params is optional and it is options for job.

}