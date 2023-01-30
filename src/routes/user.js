import { Router } from 'express';
import { validateCheck } from '../middleware/validate';
import { signUp, logIn } from '../helpers/utils/uservalidation';
import { create, logInUser } from '../controller/user.controller';
const router = Router();

router.post('/signup', validateCheck(signUp), create);
router.post('/login', validateCheck(logIn), logInUser);

export default router;