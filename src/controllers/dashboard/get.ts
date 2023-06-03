import { Request, Response, NextFunction } from 'express';
import { DashboardService } from 'services/dashboard.services';


export const getStatistics = async (req: Request, res: Response) => {
  try {
    const { year, month } = req.body;
    const data = await DashboardService.getInstance().getStatistics(year, month)
    return res.status(200).send({ message: 'Get Statistics Sucessfully', success: true, data });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: err.message, success: false, data: {} });
  }
};
