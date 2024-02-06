import { Request, Response } from 'express';
import { User } from 'orm/entities/models/user';
import { AwsService } from 'services/aws.service';
import { getRepository } from 'typeorm';
import { isBase64Image, stripBase64Prefix } from 'utils/function';

export const updateInfo = async (req: Request, res: Response) => {
  try {
    const { id } = req.jwtPayload;
    let { name, yearOfBirth, avatar, liverEnzymeTestResultImage, diabeticTestResultImage, email, phoneNumber } = req.body;

    const user = await getRepository(User).findOne({ id });
    if (!user) throw new Error(`Không tìm thấy người dùng`);

    if (typeof (avatar) === 'string') {
      user.avatar = await processAndUploadImage(avatar, 'avatar-image') || '';
    }

    if (typeof (liverEnzymeTestResultImage) === 'string') {
      user.liver_enzyme_test_result_image = await processAndUploadImage(liverEnzymeTestResultImage, 'liverEnzymeTestResultImage-image') || '';
    }

    if (typeof (diabeticTestResultImage) === 'string') {
      user.diabetic_test_result_image = await processAndUploadImage(diabeticTestResultImage, 'diabeticTestResultImage-image') || '';
    }

    if (name) {
      user.name = name;
    }
    if (yearOfBirth) {
      user.year_of_birth = yearOfBirth;
    }

    if (email) {
      const userExistWithEmail = await getRepository(User).findOne({ where: { email } });

      if (userExistWithEmail) {
        throw new Error('Email đã tồn tại');
      } else {
        user.email = email;
      }
    }

    if (phoneNumber) {
      const userExistWithPhoneNumber = await getRepository(User).findOne({ where: { phone: phoneNumber } });
      if (userExistWithPhoneNumber) {
        throw new Error('Số điện thoại đã có người sử dụng');
      } else {
        user.phone = phoneNumber;
      }
    }

    user.is_first_upload = false;
    await getRepository(User).save(user);
    delete user.password;
    return res.status(200).send({ message: 'Update info sucessfully', success: true, data: user });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: err.message, success: false, data: {} });
  }
};

const processAndUploadImage = async (imageData: string, prefix: string): Promise<string | null> => {
  if (!isBase64Image(imageData)) {
    return null;
  }

  const base64Data = imageData.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
  const fileName = `${prefix}-${Date.now()}.jpg`;
  const imageUrl = await AwsService.getInstance().signS3(fileName, base64Data);

  return imageUrl;
};