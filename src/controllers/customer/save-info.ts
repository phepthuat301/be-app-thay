import { Request, Response, NextFunction } from 'express';
import { Admin } from 'orm/entities/models/admin';
import { BloodSugar } from 'orm/entities/models/bloodsugar';
import { AwsService } from 'services/aws.service';
import { getRepository } from 'typeorm';

export const saveInfo = async (req: Request, res: Response) => {
  try {
    const { id } = req.jwtPayload;
    let { sugarBloodLevel, image } = req.body;
    const bloodSugarRepository = getRepository(BloodSugar);

    const user = await getRepository(Admin).findOne({ id });
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
      .getOne();

    if (existingRecord) {
      existingRecord.blood_sugar_level = sugarBloodLevel;
      existingRecord.image_url = url;
      existingRecord.test_date = new Date();
      await bloodSugarRepository.save(existingRecord);
    } else {
      const bloodSugar = new BloodSugar();
      bloodSugar.blood_sugar_level = sugarBloodLevel;
      bloodSugar.image_url = url;
      bloodSugar.test_date = new Date();
      bloodSugar.user_id = user.id;
      await bloodSugarRepository.save(bloodSugar);
    }
    return res.status(200).send({ message: 'Save info sucessfully', success: true, data: {} });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: err.message, success: false, data: {} });
  }
};