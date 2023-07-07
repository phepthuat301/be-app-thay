import { Admin } from 'orm/entities/models/admin';
import { ADMIN_STATUS_ENUM, ROLE_ENUM } from 'share/enum';
import { getRepository } from 'typeorm';
import { JwtPayload } from 'types/JwtPayload';
import { createJwtToken } from 'utils/createJwtToken';
import { ConfigurationServices } from './configuration.services';
import { PAGE_PASSWORD } from 'share/configurations/constant';

const register = async (email: string, password: string, phone: string) => {
  const adminRepository = getRepository(Admin);
  const user = await adminRepository.findOne({ where: { email } });

  if (user) {
    throw new Error('Email already exists');
  }

  const newUser = new Admin();
  newUser.email = email;
  newUser.password = password;
  newUser.username = email.split('@')[0];
  newUser.role = ROLE_ENUM.ADMIN;
  newUser.phone = phone;
  newUser.status = ADMIN_STATUS_ENUM.ACTIVE;
  newUser.hashPassword();
  await adminRepository.save(newUser);

  const jwtPayload: JwtPayload = {
    id: newUser.id,
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
    throw new Error('Not found Admin');
  }

  if (!user.checkIfPasswordMatch(password)) {
    throw new Error('Incorrect password or email');
  }

  const jwtPayload: JwtPayload = {
    id: user.id,
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
  const user = await adminRepository.findOne({ where: { id, status: ADMIN_STATUS_ENUM.ACTIVE } });
  if (!user) {
    throw new Error('Not found Admin');
  }

  if (!user.checkIfPasswordMatch(password)) {
    throw new Error('Incorrect password');
  }

  user.password = passwordNew;
  user.hashPassword();
  await adminRepository.save(user);
};

const getAdminInfo = async (id: number) => {
  const adminRepository = getRepository(Admin);
  const user = await adminRepository.findOne({ where: { id, status: ADMIN_STATUS_ENUM.ACTIVE } });
  if (!user) {
    throw new Error('Not found Admin');
  }
  return {
    id: user.id,
    email: user.email,
    phone: user.phone,
  };
};

const verifyPagePassword = async (password: string) => {
  const adminRepository = getRepository(Admin);
  const user = await adminRepository.findOne({ where: { id: 1, status: ADMIN_STATUS_ENUM.ACTIVE } });
  if (!user) {
    throw new Error('Not found Admin');
  }

  //get configuration
  const refPass = await ConfigurationServices.getInstance().getConfigValue(PAGE_PASSWORD);
  if (refPass !== password) {
    throw new Error('Incorrect password');
  }
  return true;

}


const AdminService = {
  register,
  login,
  changePassword,
  getAdminInfo,
  verifyPagePassword,
};

export default AdminService;
