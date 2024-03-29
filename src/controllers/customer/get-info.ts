import { Request, Response } from 'express';
import { User } from 'orm/entities/models/user';
import { BloodSugar } from 'orm/entities/models/bloodsugar';
import { getRepository } from 'typeorm';
import moment from 'moment-timezone';

export const getInfo = async (req: Request, res: Response) => {
  try {
    const { fromDate, toDate } = req.query;
    const { id } = req.jwtPayload;

    const user = await getRepository(User).findOne({ id: id });
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

export const getImages = async (req: Request, res: Response) => {
  try {
    const { fromDate, toDate } = req.query;
    const { id } = req.jwtPayload;

    const user = await getRepository(User).findOne({ id: id });
    if (!user) throw new Error(`User not found`);

    const bloodSugarRepository = getRepository(BloodSugar);

    const fromDateTime = new Date(parseInt(`${fromDate}`));
    fromDateTime.setHours(0, 0, 0, 0); // Set time to start of the day

    const toDateTime = new Date(parseInt(`${toDate}`));
    toDateTime.setHours(23, 59, 59, 999); // Set time to end of the day

    const data = await bloodSugarRepository
      .createQueryBuilder('bloodsugar')
      .select([
        'bloodsugar.image_url as image_url',
        'bloodsugar.test_time as date',
      ])
      .where('bloodsugar.test_date >= :fromDate AND bloodsugar.test_date <= :toDate AND bloodsugar.user_id = :userId', { fromDate: fromDateTime, toDate: toDateTime, userId: user.id })
      .groupBy('date, bloodsugar.image_url')
      .orderBy({ date: 'DESC' })
      .getRawMany();

    for (const item of data) {
      const dateInGMT7 = moment(item.date).tz('Asia/Bangkok');
      item.date = dateInGMT7.valueOf();
    }
    
    return res.status(200).send({ message: 'Get Images Sucessfully', success: true, data });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: err.message, success: false, data: {} });
  }
};