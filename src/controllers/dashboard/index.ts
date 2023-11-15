import { Request, Response } from "express";
import { Admin } from "orm/entities/models/admin";
import { BloodSugar } from "orm/entities/models/bloodsugar";
import AdminService from "services/admin.services";
import { ROLE_ENUM } from "share/enum";
import { getRepository } from "typeorm";

export const loginAdmin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const data = await AdminService.loginAdmin(email, password);
        return res.status(200).send({ message: 'Login Sucessfully', success: true, data });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ message: err.message, success: false, data: {} });
    }
};

export const getListPatient = async (req: Request, res: Response) => {
    try {
        const page = req.query.page ? parseInt(req.query.page.toString(), 10) : 1; // Get the page number from the request query
        const pageSize = req.query.limit ? parseInt(req.query.limit.toString(), 10) : 10; // Set a default page size or get it from the request query

        const skip = (page - 1) * pageSize; // Calculate the number of rows to skip

        const [listUser, total] = await getRepository(Admin).findAndCount({
            select: ["id", "email", "createdAt", "username", "phone"],
            where: { role: ROLE_ENUM.USER },
            skip: skip,
            take: pageSize,
            order: { createdAt: 'DESC' }
        });

        return res.status(200).send({
            message: 'List User',
            success: true,
            data: { listUser, totalRecords: total },
        });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ message: err.message, success: false, data: {} });
    }
};

export const getPatientDetail = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const page = req.query.page ? parseInt(req.query.page.toString(), 10) : 1;
        const pageSize = req.query.limit ? parseInt(req.query.limit.toString(), 10) : 10;
        const skip = (page - 1) * pageSize;

        const [bloodSugarList, total] = await getRepository(BloodSugar).findAndCount({
            where: { user_id: userId },
            skip: skip,
            take: pageSize,
            order: { test_date: 'DESC' }
        });

        return res.status(200).send({
            message: 'Blood Sugar List',
            success: true,
            data: { bloodSugarList, totalRecords: total },
        });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ message: err.message, success: false, data: {} });
    }
};

export const getStatistic = async (req: Request, res: Response) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set the time to the beginning of the day

        const bloodSugarRepository = getRepository(BloodSugar);
        const userCount = await bloodSugarRepository
            .createQueryBuilder('bloodSugar')
            .leftJoin(Admin, 'user', 'bloodSugar.user_id = user.id')
            .where('bloodSugar.test_date >= :today', { today })
            // .andWhere('bloodSugar.test_date < :tomorrow', { tomorrow: new Date(today.getTime() + 24 * 60 * 60 * 1000) }) // Test date less than tomorrow
            .andWhere('user.role = :userRole', { userRole: ROLE_ENUM.USER })
            .select('COUNT(DISTINCT user.id)', 'userCount')
            .getRawOne();

        const userRepository = getRepository(Admin);
        const users = await userRepository
            .createQueryBuilder('user')
            .where('user.role = :userRole', { userRole: 'USER' })
            .select('COUNT(user.id)', 'userCount')
            .getRawOne();

        const data = {
            labels: ['Đã điểm danh', 'Chưa điểm danh'],
            datasets: [
                {
                    data: [userCount.userCount, users.userCount - userCount.userCount],
                    backgroundColor: ['#0F8BFD', '#545C6B'],
                    hoverBackgroundColor: ['#0F8BFD', '#545C6B'],
                    borderColor: 'transparent',
                    fill: true
                }
            ]
        }
        return res.status(200).send({
            message: 'Get statistics successfully',
            success: true,
            data
        });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ message: err.message, success: false, data: {} });
    }
};