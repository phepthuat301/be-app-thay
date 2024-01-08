import { AccountActionLog } from 'orm/entities/models/account-action-log';
import { FORGOT_PASSWORD_METHOD_ENUM } from 'share/enum';
import { Between, getRepository } from 'typeorm';

export type ACTION_TYPE =
  | 'FORGOT_PASSWORD'
  | 'CHANGE_PASSWORD'
  | 'EDIT_PROFILE'
  | 'SEND_CODE'
  | 'VERIFY_EMAIL'
  | 'SEND_OTP'
  | 'CHANGE_PHONE_NUMBER'
  | 'TROUBLE_SIGN_IN';
export type STATUS_TYPE = 'OPEN' | 'COMPLETED' | 'CANCELLED';

export class AccountActionLogsService {
  private static instance: AccountActionLogsService;

  private constructor() { }

  static getInstance() {
    if (!this.instance) {
      this.instance = new AccountActionLogsService();
    }
    return this.instance;
  }

  async createAccActionLogs(
    user_id: number,
    action_type: ACTION_TYPE,
    status: STATUS_TYPE = 'OPEN',
    payload_forgot_method?: FORGOT_PASSWORD_METHOD_ENUM,
    payload_old_password?: any
  ) {
    const repository = getRepository(AccountActionLog);

    const newLog = repository.create({
      user_id,
      action_type,
      status,
      payload_forgot_method,
      payload_old_password,
    });

    await repository.save(newLog);
  }

  async getAccActionLogs(
    user_id: number,
    action_type: ACTION_TYPE,
    payload_forgot_method: FORGOT_PASSWORD_METHOD_ENUM,
  ) {
    const repository = getRepository(AccountActionLog);

    const logs = await repository.find({
      user_id,
      action_type,
      payload_forgot_method,
    });

    return logs
  }

  async countAccActionLogsToday(
    user_id: number,
    action_type: ACTION_TYPE,
    payload_forgot_method: FORGOT_PASSWORD_METHOD_ENUM,
  ) {
    const repository = getRepository(AccountActionLog);

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Set the time to the beginning of the day

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Set the time to the beginning of the next day

    const count = await repository
      .createQueryBuilder('log')
      .where({
        user_id,
        action_type,
        payload_forgot_method,
        created_at: Between(today, tomorrow),
      })
      .getCount();

    return count;
  }
}
