import userSchema from '../models/user.model';
import config from '../config';
const secreteKey = config.JWT_SECRET;

export const create = async(req,res) => {
    try {
        const { firstName, lastName, email, password, mobileNo } = req.body;
        const exitsUser = await userSchema.findOne({ email: email });
        if(exitsUser) {
            return res.status(412).send({ status: 412, message: 'Please log in', data: {}});
        }
        let newuser = new userSchema({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            mobileNo: mobileNo
        })

        const saveuser = await newuser.save();
        return res.status(201).send({ status: 201, message: 'User created successfully', data: saveuser });

    } catch (error) {
        console.log('error: create user', error);
        return res.status(500).send({ status:500, message: 'Internal server error', data: {} });
    }
}

export const logInUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const exitsuser = await userSchema.findOne({ email: email });
        if (!exitsuser) {
            return res.status(404).send({ status: 404, message: 'Please signup in', data: {}});
        }

        let checkPassword = await exitsuser.comparePassword(password);

        if (!checkPassword) {
            return res.status(401).send({ status: 401, message: 'Please enter correct password' });
        }

        const token = jwt.sign({
            _id: exitsuser._id,
            email: exitsuser.email
        }, secreteKey, {});

        let response = {
            _id: exitsuser._id,
            email: exitsuser.email,
            token: token
        }

        return res.status(200).send({ status: 200, message: 'Welcome to dashboard', data: response });
    } catch (error) {
        console.log(error, '-error')
        return res.status(500).send({ status:500, message: 'Internal server error', data: {} });
    }
}