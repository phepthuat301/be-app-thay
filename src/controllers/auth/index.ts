import { Request, Response } from 'express';
import { User } from 'orm/entities/models/user';
import { FirebaseService } from 'services/firebase.service';
import UserService from 'services/user.services';
import { FORGOT_PASSWORD_METHOD_ENUM, USER_STATUS_ENUM } from 'share/enum';
import { getRepository, Not } from 'typeorm';
import { detectEmailOrPhone } from 'utils/function';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, phone, name, gender } = req.body;
        const data = await UserService.register(email, password, phone, name, gender);
        return res.status(200).send({ message: 'Register Sucessfully', success: true, data });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ message: err.message, success: false, data: {} });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const data = await UserService.login(email, password);
        return res.status(200).send({ message: 'Login Sucessfully', success: true, data });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ message: err.message, success: false, data: {} });
    }
};

export const sendCode = async (req: Request, res: Response) => {
    try {
        const { emailOrPhone } = req.body;
        if (!emailOrPhone) throw new Error('Vui lòng nhập số điện thoại hoặc email!');

        const forgotMethod = detectEmailOrPhone(emailOrPhone);

        let user;
        switch (forgotMethod) {
            case FORGOT_PASSWORD_METHOD_ENUM.EMAIL:
                user = await getRepository(User).findOne({ where: { email: emailOrPhone, status: Not(USER_STATUS_ENUM.DELETED) } });
                break;
            case FORGOT_PASSWORD_METHOD_ENUM.PHONE:
                user = await getRepository(User).findOne({ where: { phone: emailOrPhone, status: Not(USER_STATUS_ENUM.DELETED) } });
                break;
            default:
                throw new Error(`Số điện thoại hoặc email bạn nhập không hợp lệ`)
        }

        if (!user) {
            throw new Error('Không tìm thấy người dùng');
        }

        const data = await FirebaseService.getInstance().sendOTP(user, forgotMethod);

        return res
            .status(200)
            .send({ message: 'Send Code Sucessfully', success: true, data });
    } catch (err: any) {
        console.log(err.message)
        return res
            .status(400)
            .send({ message: err.message, success: false, data: {} });
    }
};

export const verifyForgotPassword = async (req: Request, res: Response) => {
    try {
        const user = await UsersModel.findOne({
            email: req.body.email,
            status: { $ne: UserStatusEnum.DELETED },
        });
        if (!user) {
            throw new Error('Not found user email');
        }

        await MailService.getInstance().verifyForgotPassword(
            user.id,
            req.body.verifyCode
        );
        return res.status(200).send({
            message: 'Verify forgot password successfully',
            success: true,
            data: {},
        });
    } catch (error) {
        logger.error(error.message);
        return res
            .status(400)
            .send({ message: error.message, success: false, data: {} });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        // const user_id = req.jwtPayload.id;
        const user = await UsersModel.findOne({
            email: req.body.email,
            status: { $ne: UserStatusEnum.DELETED },
        });
        if (!user) {
            throw new Error('Not found user email');
        }
        await UserService.getInstance().resetPassword(user.id, req.body.password);
        return res.status(200).send({
            message: 'Reset password successfully',
            success: true,
            data: {},
        });
    } catch (error) {
        logger.error(error.message);
        return res
            .status(400)
            .send({ message: error.message, success: false, data: {} });
    }
};