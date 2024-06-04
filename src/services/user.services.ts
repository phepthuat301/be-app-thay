import { User } from 'orm/entities/models/user';
import { USER_STATUS_ENUM, ROLE_ENUM } from 'share/enum';
import { getRepository } from 'typeorm';
import { JwtPayload } from 'types/JwtPayload';
import { createJwtToken } from 'utils/createJwtToken';

const register = async (email: string, password: string, phone: string, name: string) => {
  const adminRepository = getRepository(User);
  if (email) {
    const user = await adminRepository.findOne({ where: { email } });

    if (user) {
      throw new Error('Email đã tồn tại');
    }
  }

  const user = await adminRepository.findOne({ where: { phone } });

  if (user) {
    if (user.status === USER_STATUS_ENUM.DELETED) {
      throw new Error('Số điện thoại đã có người sử dụng, vui lòng liên hệ với bộ phận hỗ trợ để khôi phục tài khoản')
    }
    throw new Error('Số điện thoại đã có người sử dụng');
  }

  const newUser = new User();
  newUser.email = email;
  newUser.password = password;
  newUser.role = ROLE_ENUM.USER;
  newUser.phone = phone;
  newUser.name = name;
  newUser.status = USER_STATUS_ENUM.ACTIVE;
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

const login = async (phone: string, password: string) => {
  const adminRepository = getRepository(User);
  const user = await adminRepository.findOne({ where: { phone: phone } });

  if (!user) {
    throw new Error('Không tìm thấy tài khoản');
  }

  if (!user.checkIfPasswordMatch(password)) {
    throw new Error('Sai mật khẩu.');
  }

  if (user.status === USER_STATUS_ENUM.DELETED) {
    throw new Error('Tài khoản đã bị khóa, vui lòng liên hệ với bộ phận hỗ trợ để khôi phục tài khoản')
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
  delete user.password
  return { token, userInfo: user, isFirstUpload: user.is_first_upload };
};

const loginAdmin = async (email: string, password: string) => {
  const adminRepository = getRepository(User);
  const user = await adminRepository.findOne({ where: { email, role: ROLE_ENUM.ADMIN } });

  if (!user) {
    throw new Error('Not found User');
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
  const adminRepository = getRepository(User);
  const user = await adminRepository.findOne({ where: { id, status: USER_STATUS_ENUM.ACTIVE } });
  if (!user) {
    throw new Error('Not found User');
  }

  if (!user.checkIfPasswordMatch(password)) {
    throw new Error('Incorrect password');
  }

  if (user.status === USER_STATUS_ENUM.DELETED) {
    throw new Error('Tài khoản đã bị khóa, vui lòng liên hệ với bộ phận hỗ trợ để khôi phục tài khoản')
  }
  user.password = passwordNew;
  user.hashPassword();
  await adminRepository.save(user);
};

const getUserInfo = async (id: number) => {
  const adminRepository = getRepository(User);
  const user = await adminRepository.findOne({ where: { id, status: USER_STATUS_ENUM.ACTIVE } });
  if (!user) {
    throw new Error('Not found User');
  }
  return {
    id: user.id,
    email: user.email,
    phone: user.phone,
  };
};


const resetPassword = async (id: number, passwordNew: string) => {
  const adminRepository = getRepository(User);
  const user = await adminRepository.findOne({ where: { id, status: USER_STATUS_ENUM.ACTIVE } });
  if (!user) {
    throw new Error('Không tìm thấy người dùng');
  }

  user.password = passwordNew;
  user.hashPassword();
  await adminRepository.save(user);
};

const deleteAccount = async (id: number) => {
  const adminRepository = getRepository(User);
  const user = await adminRepository.findOne({ where: { id, status: USER_STATUS_ENUM.ACTIVE } });
  if (!user) {
    throw new Error('Not found User');
  }

  user.status = USER_STATUS_ENUM.DELETED;
  await adminRepository.save(user);
}

const UserService = {
  register,
  login,
  changePassword,
  getUserInfo,
  loginAdmin,
  resetPassword,
  deleteAccount
};

export default UserService;
