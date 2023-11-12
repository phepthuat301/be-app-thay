import { Request, Response } from 'express';
import { Admin } from 'orm/entities/models/admin';
import { BloodSugar } from 'orm/entities/models/bloodsugar';
import { getRepository } from 'typeorm';

export const getInfo = async (req: Request, res: Response) => {
  try {
    const { fromDate, toDate } = req.query;
    const { id } = req.jwtPayload;

    const user = await getRepository(Admin).findOne({ id: id });
    if (!user) throw new Error(`User not found`);

    const bloodSugarRepository = getRepository(BloodSugar);

    const data = await bloodSugarRepository
      .createQueryBuilder('bloodsugar')
      .select(['DATE(bloodsugar.test_date) AS testdate', 'bloodsugar.blood_sugar_level'])
      .where('bloodsugar.test_date >= :fromDate AND bloodsugar.test_date <= :toDate AND bloodsugar.user_id = :userId', { fromDate: new Date(parseInt(`${fromDate}`)), toDate: new Date(parseInt(`${toDate}`)), userId: user.id })
      .groupBy('testdate, bloodsugar.blood_sugar_level')
      .getRawMany();
    const dates = data.map(item => new Date(item.testdate).getDate());
    const bloodSugarLevels = data.map(item => parseFloat(item.bloodsugar_blood_sugar_level));
    const result = {
      labels: dates,
      datasets: [
        {
          data: bloodSugarLevels
        }
      ]
    }
    return res.status(200).send({ message: 'Get Info Sucessfully', success: true, data: result });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: err.message, success: false, data: {} });
  }
};