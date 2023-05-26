import { Admin } from 'orm/entities/models/admin';
import { ADMIN_STATUS_ENUM, ROLE_ENUM } from 'share/enum';
import { getRepository } from 'typeorm';
import { JwtPayload } from 'types/JwtPayload';
import { createJwtToken } from 'utils/createJwtToken';
import { CustomError } from 'utils/response/custom-error/CustomError';

const register = async (name: string, email: string, password: string, phone: string) => {
  const adminRepository = getRepository(Admin);
  try {
    const user = await adminRepository.findOne({ where: { email } });

    if (user) {
      const customError = new CustomError(400, 'General', 'Admin already exists', [
        `Email '${user.email}' already exists`,
      ]);
      return customError;
    }

    try {
      const newUser = new Admin();
      newUser.email = email;
      newUser.password = password;
      newUser.username = email;
      newUser.name = name;
      newUser.role = ROLE_ENUM.ADMIN;
      newUser.phone = phone;
      newUser.status = ADMIN_STATUS_ENUM.ACTIVE;
      newUser.hashPassword();
      await adminRepository.save(newUser);
      return newUser;
    } catch (err) {
      const customError = new CustomError(400, 'Raw', `User '${email}' can't be created`, null, err);
      return customError;
    }
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return customError;
  }
};

const login = async (email: string, password: string) => {
  const adminRepository = getRepository(Admin);
  const user = await adminRepository.findOne({ where: { email } });

  if (!user) {
    const customError = new CustomError(404, 'General', 'Not Found', ['Incorrect email or password']);
    return customError;
  }

  if (!user.checkIfPasswordMatch(password)) {
    const customError = new CustomError(404, 'General', 'Not Found', ['Incorrect email or password']);
    return customError;
  }

  const jwtPayload: JwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.createdAt,
  };

  const token = createJwtToken(jwtPayload);
  return token;
};

const AdminService = {
  register,
  login,
};

export default AdminService;
