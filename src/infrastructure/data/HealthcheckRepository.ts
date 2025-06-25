import { IHealthcheckRepository } from '@repositories/IHealthcheckRepository';
import { MHealthcheck } from '@models/Healthcheck';
import { ApiClient } from '@api/client';
import { API_ENDPOINTS } from '@api/endpoints';

export class HealthcheckRepository implements IHealthcheckRepository {
  async check(): Promise<MHealthcheck> {
    return await ApiClient.get<MHealthcheck>(API_ENDPOINTS.HEALTHCHECK);
  }
}
