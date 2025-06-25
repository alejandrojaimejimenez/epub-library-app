import { IHealthcheckRepository } from '@repositories/IHealthcheckRepository';
import { MHealthcheck } from '@models/Healthcheck';

/**
 * Servicio para validar el endpoint de healthcheck de la API
 * Cumple la guía de arquitectura: lógica desacoplada de la UI
 */
export class SApiHealthcheck {
  private repo: IHealthcheckRepository;
  constructor(repo: IHealthcheckRepository) {
    this.repo = repo;
  }
  /**
   * Realiza un healthcheck contra la API centralizada.
   * @returns modelo de healthcheck
   */
  async check(): Promise<MHealthcheck> {
    return await this.repo.check();
  }
}

export default SApiHealthcheck;
