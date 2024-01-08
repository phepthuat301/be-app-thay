import { Request, Response } from "express";
import { User } from "orm/entities/models/user";
import { BloodSugar } from "orm/entities/models/bloodsugar";
import UserService from "services/user.services";
import { ROLE_ENUM } from "share/enum";
import { Between, getRepository } from "typeorm";

export const loginAdmin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const data = await UserService.loginAdmin(email, password);
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

        const [listUser, total] = await getRepository(User).findAndCount({
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
        const { from, to, id }: any = req.query;

        if (!from || !to || !id) {
            return res.status(400).send({
                message: 'Input invalid.',
                success: false,
                data: {}
            });
        }

        const fromDate = new Date(parseInt(from));
        const toDate = new Date(parseInt(to));

        // Query for blood sugar entries within the specified date range and for the given userId
        const bloodSugarEntries = await getRepository(BloodSugar).find({
            where: {
                user_id: id,
                test_date: Between(fromDate, toDate),
            },
        });

        // Extract unique dates from the retrieved blood sugar entries
        const uniqueDates = new Set(bloodSugarEntries.map(entry => entry.test_date.toISOString().split('T')[0]));

        // Calculate the total number of days within the specified range
        const totalDays = Math.floor((toDate.getTime() - fromDate.getTime()) / (24 * 60 * 60 * 1000)) + 1;

        // Calculate the number of days with updates and without updates
        const daysWithUpdates = uniqueDates.size;
        const daysWithoutUpdates = totalDays - daysWithUpdates;

        const data = {
            labels: ['Đã điểm danh', 'Chưa điểm danh'],
            datasets: [
                {
                    data: [daysWithUpdates, daysWithoutUpdates],
                    backgroundColor: ['#0F8BFD', '#545C6B'],
                    hoverBackgroundColor: ['#0F8BFD', '#545C6B'],
                    borderColor: 'transparent',
                    fill: true
                }
            ]
        };

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