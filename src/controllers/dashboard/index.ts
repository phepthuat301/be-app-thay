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