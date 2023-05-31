import { ConfigurationServices } from './configuration.services';

export async function InitService() {
  console.log('InitService');
  await ConfigurationServices.getInstance().init();
}
