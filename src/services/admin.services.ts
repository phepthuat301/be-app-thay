import { Admin } from 'orm/entities/models/admin';
import { ADMIN_STATUS_ENUM, ROLE_ENUM } from 'share/enum';
import { getRepository } from 'typeorm';
import { JwtPayload } from 'types/JwtPayload';
import { createJwtToken } from 'utils/createJwtToken';
import { ConfigurationServices } from './configuration.services';
import { PAGE_PASSWORD } from 'share/configurations/constant';

const register = async (email: string, password: string, phone: string, name: string, gender: string) => {
  const adminRepository = getRepository(Admin);
  const user = await adminRepository.findOne({ where: { email } });

  if (user) {
    throw new Error('Email already exists');
  }

  const newUser = new Admin();
  newUser.email = email;
  newUser.password = password;
  newUser.username = email.split('@')[0];
  newUser.role = ROLE_ENUM.USER;
  newUser.phone = phone;
  newUser.name = name;
  newUser.gender = gender;
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
  const user = await adminRepository.findOne({ where: { phone: email } });

  if (!user) {
    throw new Error('Not found Admin');
  }

  if (!user.checkIfPasswordMatch(password)) {
    throw new Error('Incorrect password or phone number');
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

const loginAdmin = async (email: string, password: string) => {
  const adminRepository = getRepository(Admin);
  const user = await adminRepository.findOne({ where: { email, role: ROLE_ENUM.ADMIN } });

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

const verifyPagePassword = async (password: string, pageName: string) => {
  if (!pageName) throw new Error('Input not valid');

  const adminRepository = getRepository(Admin);
  const user = await adminRepository.findOne({ where: { id: 1, status: ADMIN_STATUS_ENUM.ACTIVE } });
  if (!user) {
    throw new Error('Not found Admin');
  }

  //get configuration
  const refPass = await ConfigurationServices.getInstance().getConfigValue(PAGE_PASSWORD);
  const listPass = JSON.parse(refPass);
  const verifyPwd = listPass.some(item => item.pageName === pageName && item.password === password)
  if (!verifyPwd) {
    throw new Error('Incorrect password');
  }
  return verifyPwd;

}


const AdminService = {
  register,
  login,
  changePassword,
  getAdminInfo,
  verifyPagePassword,
  loginAdmin
};

export default AdminService;
