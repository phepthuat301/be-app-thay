import { Request, Response } from 'express';
import { User } from 'orm/entities/models/user';
import { BloodSugar } from 'orm/entities/models/bloodsugar';
import { AwsService } from 'services/aws.service';
import { getRepository } from 'typeorm';

export const saveInfo = async (req: Request, res: Response) => {
  try {
    const { id } = req.jwtPayload;
    let { sugarBloodLevel, image } = req.body;
    const bloodSugarRepository = getRepository(BloodSugar);

    const user = await getRepository(User).findOne({ id });
    if (!user) throw new Error(`User not found`);

    // upload image 
    if (image.startsWith('data:image/png;base64,')) {
      image = image.replace('data:image/png;base64,', '');
    }
    else if (image.startsWith('data:image/jpeg;base64,')) {
      image = image.replace('data:image/jpeg;base64,', '');
    }
    const fileName = `image-${Date.now()}.jpg`;
    const url = await AwsService.getInstance().signS3(fileName, image);

    const existingRecord = await bloodSugarRepository
      .createQueryBuilder('bloodsugar')
      .where('DATE(bloodsugar.test_date) = DATE(:test_date)', { test_date: new Date() })
      .andWhere('bloodsugar.user_id = :user_id', { user_id: user.id })
      .getMany();

    if (existingRecord.length >= 3) {
      throw new Error(`Bạn chỉ có thể điểm danh 1 ngày tối đa 3 lần`)
    } else {
      const bloodSugar = new BloodSugar();
      bloodSugar.image_url = url;
      bloodSugar.test_date = new Date();
      bloodSugar.test_time = new Date();
      bloodSugar.user_id = user.id;
      await bloodSugarRepository.save(bloodSugar);
    }
    return res.status(200).send({ message: 'Save info sucessfully', success: true, data: {} });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: err.message, success: false, data: {} });
  }
};
