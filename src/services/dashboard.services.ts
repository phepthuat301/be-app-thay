import { Customer } from 'orm/entities/models/customer';
import { History } from 'orm/entities/models/history';
import { Order } from 'orm/entities/models/order';
import { getRepository } from 'typeorm';
import { ConfigurationServices } from './configuration.services';

export class DashboardService {
  private static instance: DashboardService;
  private constructor() { }
  public static getInstance(): DashboardService {
    if (!this.instance) {
      this.instance = new DashboardService();
    }

    return this.instance;
  }
}