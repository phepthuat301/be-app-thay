import { Request, Response } from 'express';
import { User } from 'orm/entities/models/user';
import { AwsService } from 'services/aws.service';
import { getRepository } from 'typeorm';

export const updateInfo = async (req: Request, res: Response) => {
  try {
    const { id } = req.jwtPayload;
    let { name, yearOfBirth, avatar, liverEnzymeTestResultImage, diabeticTestResultImage } = req.body;

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
      user.liverEnzymeTestResultImage = liverEnzymeTestResultImageUrl;
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
      user.diabeticTestResultImage = diabeticTestResultImageUrl;
    }

    if (name) {
      user.name = name;
    }
    if (yearOfBirth) {
      user.yearOfBirth = yearOfBirth;
    }
    await getRepository(User).save(user);

    return res.status(200).send({ message: 'Update info sucessfully', success: true, data: {} });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: err.message, success: false, data: {} });
  }
};
