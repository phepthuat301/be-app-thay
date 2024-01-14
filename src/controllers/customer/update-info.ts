import { Request, Response } from 'express';
import { User } from 'orm/entities/models/user';
import { AwsService } from 'services/aws.service';
import { getRepository } from 'typeorm';

export const updateInfo = async (req: Request, res: Response) => {
  try {
    const { id } = req.jwtPayload;
    let { name, yearOfBirth, avatar, liverEnzymeTestResultImage, diabeticTestResultImage, email, phoneNumber } = req.body;

    const user = await getRepository(User).findOne({ id });
    if (!user) throw new Error(`Không tìm thấy người dùng`);

    if (avatar) {
      if (avatar.startsWith('data:image/png;base64,')) {
        avatar = avatar.replace('data:image/png;base64,', '');
      }
      else if (avatar.startsWith('data:image/jpeg;base64,')) {
        avatar = avatar.replace('data:image/jpeg;base64,', '');
      }
      const fileName = `avatar-image-${Date.now()}.jpg`;
      const avatarUrl = await AwsService.getInstance().signS3(fileName, avatar);
      user.avatar = avatarUrl;
    }

    if (liverEnzymeTestResultImage) {
      if (liverEnzymeTestResultImage.startsWith('data:image/png;base64,')) {
        liverEnzymeTestResultImage = liverEnzymeTestResultImage.replace('data:image/png;base64,', '');
      }
      else if (liverEnzymeTestResultImage.startsWith('data:image/jpeg;base64,')) {
        liverEnzymeTestResultImage = liverEnzymeTestResultImage.replace('data:image/jpeg;base64,', '');
      }
      const fileName = `liverEnzymeTestResultImage-image-${Date.now()}.jpg`;
      const liverEnzymeTestResultImageUrl = await AwsService.getInstance().signS3(fileName, liverEnzymeTestResultImage);
      user.liver_enzyme_test_result_image = liverEnzymeTestResultImageUrl;
    }

    if (diabeticTestResultImage) {
      if (diabeticTestResultImage.startsWith('data:image/png;base64,')) {
        diabeticTestResultImage = diabeticTestResultImage.replace('data:image/png;base64,', '');
      }
      else if (diabeticTestResultImage.startsWith('data:image/jpeg;base64,')) {
        diabeticTestResultImage = diabeticTestResultImage.replace('data:image/jpeg;base64,', '');
      }
      const fileName = `diabeticTestResultImage-image-${Date.now()}.jpg`;
      const diabeticTestResultImageUrl = await AwsService.getInstance().signS3(fileName, diabeticTestResultImage);
      user.diabetic_test_result_image = diabeticTestResultImageUrl;
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
