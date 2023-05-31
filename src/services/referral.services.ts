import { Customer } from 'orm/entities/models/customer';
import { Referral } from 'orm/entities/models/referral';
import { CUSTOMER_STATUS_ENUM } from 'share/enum';
import { getRepository } from 'typeorm';
import { ConfigurationServices } from './configuration.services';
import { REWARD_REFERRAL_POINT } from 'share/configurations/constant';

export class ReferralService {
  private static instance: ReferralService;
  private constructor() {}
  static getInstance(): ReferralService {
    if (!ReferralService.instance) {
      ReferralService.instance = new ReferralService();
    }
    return ReferralService.instance;
  }

  async submitReferral(referral_code: string, referrer_id: number) {
    const CustomerRepository = getRepository(Customer);
    const referee = await this.getUserByReferralCode(referral_code);
    const referrer = await CustomerRepository.findOne({
      where: { id: referrer_id, status: CUSTOMER_STATUS_ENUM.ACTIVE },
    });
    const reward_point = await ConfigurationServices.getInstance().getConfigValue(REWARD_REFERRAL_POINT);
    if (!referee || !referrer) {
      throw new Error('Customer not found');
    }
    await this.createReferral(referee.id, referrer_id);
    referee.reward_point += +reward_point;
    await CustomerRepository.save(referee);
  }

  private async getUserByReferralCode(referral_code: string) {
    const CustomerRepository = getRepository(Customer);
    const customer = await CustomerRepository.findOne({ where: { refferal_code: referral_code } });
    if (!customer) {
      throw new Error('Customer not found');
    }
    return customer;
  }

  private async createReferral(referee_id: number, referrer_id: number) {
    const CustomerRepository = getRepository(Customer);
    const referee = await CustomerRepository.findOne({ where: { id: referee_id } });
    const referrer = await CustomerRepository.findOne({ where: { id: referrer_id } });
    if (!referee || !referrer) {
      throw new Error('Customer not found');
    }
    const referralRepository = getRepository(Referral);
    //verify if referral existed
    const existedReferral = await referralRepository.findOne({ where: { referee_id, referrer_id } });
    if (existedReferral) {
      throw new Error('Referral existed');
    }

    const newReferral = new Referral();
    newReferral.referee_id = referee_id;
    newReferral.referrer_id = referrer_id;
    await referralRepository.save(newReferral);
    return newReferral;
  }
}
