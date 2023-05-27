import { Admin } from 'orm/entities/models/admin';
import { ADMIN_STATUS_ENUM, ROLE_ENUM } from 'share/enum';
import { getRepository } from 'typeorm';
import { JwtPayload } from 'types/JwtPayload';
import { createJwtToken } from 'utils/createJwtToken';
import { CustomError } from 'utils/response/custom-error/CustomError';

const register = async (name: string, email: string, password: string, phone: string) => {
  const adminRepository = getRepository(Admin);
  const user = await adminRepository.findOne({ where: { email } });

  if (user) {
    throw new Error('Email already exists');
  }

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

  const jwtPayload: JwtPayload = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    created_at: newUser.createdAt,
  };

  const token = createJwtToken(jwtPayload);
  if (!token) {
    throw Error('Cannot create token');
  }
  return token;
};

const login = async (email: string, password: string) => {
  const adminRepository = getRepository(Admin);
  const user = await adminRepository.findOne({ where: { email } });

  if (!user) {
    throw new Error('Not found user');
  }

  if (!user.checkIfPasswordMatch(password)) {
    throw new Error('Incorrect password or email');
  }

  const jwtPayload: JwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.createdAt,
  };

  const token = createJwtToken(jwtPayload);
  if (!token) {
    throw Error('Cannot create token');
  }
  return token;
};

const changePassword = async (id: number, password: string, passwordNew: string) => {
  const adminRepository = getRepository(Admin);
  const user = await adminRepository.findOne({ where: { id } });
  if (!user) {
    throw new Error('Not found user');
  }

  if (!user.checkIfPasswordMatch(password)) {
    throw new Error('Incorrect password');
  }

  user.password = passwordNew;
  user.hashPassword();
  adminRepository.save(user);
  return user;
};

const AdminService = {
  register,
  login,
  changePassword,
};

export default AdminService;
