import { MHealthcheck } from '@models/Healthcheck';

export interface IHealthcheckRepository {
  check(): Promise<MHealthcheck>;
}
