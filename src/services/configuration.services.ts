import { Configuration } from 'orm/entities/models/configurations';
import { CONFIGURATIONS } from 'share/configurations/constant';
import { getRepository } from 'typeorm';

export class ConfigurationServices {
  private static instance: ConfigurationServices;
  private constructor() { }
  public static getInstance(): ConfigurationServices {
    if (!this.instance) {
      this.instance = new ConfigurationServices();
    }
    return this.instance;
  }

  async init() {
    console.log('ConfigurationServices init');
    const configRepository = getRepository(Configuration);
    for (const config of CONFIGURATIONS) {
      const configFromDb = await configRepository.findOne({ key: config.key });
      if (!configFromDb) {
        await configRepository.save(config);
      }
    }
  }

  async getConfigValue(key: string) {
    const configRepository = getRepository(Configuration);
    const config = await configRepository.findOne({ key });
    if (!config) {
      throw new Error('Config not found');
    }
    return config.value;
  }

  async updateConfigValue(key: string, value: string) {
    const configRepository = getRepository(Configuration);
    const config = await configRepository.findOne({ key });
    if (!config) {
      throw new Error('Config not found');
    }

    config.value = value;
    await configRepository.save(config);
  }

  async getConfigByPrefix(prefix: string) {
    const configRepository = getRepository(Configuration);
    //get all config start with prefix
    const configList = await configRepository
      .createQueryBuilder('config')
      .where('config.key like :keyword', { keyword: `${prefix}%` })
      .getMany();
    if (!configList) {
      throw new Error('Config not found');
    }
    const configMap = new Map<string, string>();
    configList.forEach((config) => {
      configMap.set(config.key, config.value);
    });
    return configMap;
  }
}
