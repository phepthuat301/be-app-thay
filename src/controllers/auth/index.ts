import { Request, Response } from 'express';
import { User } from 'orm/entities/models/user';
import UserService from 'services/user.services';
import { FORGOT_PASSWORD_METHOD_ENUM, USER_STATUS_ENUM } from 'share/enum';
import { getRepository, Not } from 'typeorm';
import { detectEmailOrPhone } from 'utils/function';
import { AccountActionLogsService } from 'services/account-action-log.service';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, phone, name } = req.body;
        const data = await UserService.register(email, password, phone, name);
        return res.status(200).send({ message: 'Đăng ký thành công', success: true, data });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ message: err.message, success: false, data: {} });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { phone, password } = req.body;
        const data = await UserService.login(phone, password);
        return res.status(200).send({ message: 'Đăng nhập thành công', success: true, data });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ message: err.message, success: false, data: {} });
    }
};

export const checkUser = async (req: Request, res: Response) => {
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

        const numberOfSentOTPToday = await AccountActionLogsService.getInstance().countAccActionLogsToday(
            user.id,
            'SEND_OTP',
            forgotMethod
        );

        if (numberOfSentOTPToday >= 3 && forgotMethod === FORGOT_PASSWORD_METHOD_ENUM.PHONE) {
            throw new Error('Bạn đã vượt quá giới hạn gửi OTP, vui lòng thử lại vào hôm sau.');
        }

        await AccountActionLogsService.getInstance().createAccActionLogs(
            user.id,
            'SEND_OTP',
            'COMPLETED',
            forgotMethod
        );
        delete user.password;
        return res
            .status(200)
            .send({ message: 'Send Code Sucessfully', success: true, data: { forgotMethod, user } });
    } catch (err: any) {
        console.log(err.message)
        return res
            .status(400)
            .send({ message: err.message, success: false, data: {} });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { emailOrPhone, password } = req.body;
        if (!emailOrPhone) throw new Error('Vui lòng nhập số điện thoại hoặc email!');
        if (!password) throw new Error('Vui lòng nhập mật khẩu');

        const forgotMethod = detectEmailOrPhone(emailOrPhone);

        let user;
        switch (forgotMethod) {
            case FORGOT_PASSWORD_METHOD_ENUM.EMAIL:
                user = await getRepository(User).findOne({ where: { email: emailOrPhone } });
                break;
            case FORGOT_PASSWORD_METHOD_ENUM.PHONE:
                user = await getRepository(User).findOne({ where: { phone: emailOrPhone } });
                break;
            default:
                throw new Error(`Số điện thoại hoặc email bạn nhập không hợp lệ`)
        }

        if (!user) {
            throw new Error('Không tìm thấy người dùng');
        }

        if (user.status === USER_STATUS_ENUM.DELETED) {
            throw new Error('Tài khoản đã bị khóa, vui lòng liên hệ với bộ phận hỗ trợ để khôi phục tài khoản')
        }

        const actionLogs = await AccountActionLogsService.getInstance().getAccActionLogs(
            user.id,
            'SEND_OTP',
            forgotMethod,
        );
        if (actionLogs.length > 0) {
            await UserService.resetPassword(user.id, password);
        } else {
            throw new Error('Không tìm thấy yêu cầu đổi mật khẩu')
        }

        return res.status(200).send({
            message: 'Reset password successfully',
            success: true,
            data: {},
        });
    } catch (error) {
        console.log(error.message);
        return res
            .status(400)
            .send({ message: error.message, success: false, data: {} });
    }
};

export const changePassword = async (req: Request, res: Response) => {
    try {
        const userId = req.jwtPayload.id;
        const { currentPassword, newPassword } = req.body
        if (!currentPassword || !newPassword) throw new Error('Thông tin nhập vào không hợp lệ');
        await UserService.changePassword(userId, currentPassword, newPassword);
        return res.status(200).send({
            message: 'Change password successfully',
            success: true,
            data: {},
        });
    } catch (error) {
        console.log(error.message);
        return res
            .status(400)
            .send({ message: error.message, success: false, data: {} });
    }
};

export const deleteAccount = async (req: Request, res: Response) => {
    try {
        const userId = req.jwtPayload.id;
        await UserService.deleteAccount(userId);
        return res.status(200).send({
            message: 'Xóa tài khoản thành công',
            success: true,
            data: {},
        });
    } catch (error) {
        console.log(error.message);
        return res
            .status(400)
            .send({ message: error.message, success: false, data: {} });
    }
};