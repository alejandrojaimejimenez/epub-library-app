import { useState, useCallback } from 'react';
import { SApiHealthcheck } from '@services/SApiHealthcheck';
import { HealthcheckRepository } from '@data/HealthcheckRepository';
import { MHealthcheck } from '@models/Healthcheck';

interface IUseApiHealthcheck {
  healthcheck: MHealthcheck | null;
  isValid: boolean | null;
  isLoading: boolean;
  error: string | null;
  validate: () => Promise<void>;
}

/**
 * Hook para validar el endpoint de healthcheck de la API
 * Cumple la guía de arquitectura: lógica desacoplada de la UI
 */
export const useApiHealthcheck = (): IUseApiHealthcheck => {
  const [healthcheck, setHealthcheck] = useState<MHealthcheck | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Instanciar el servicio con el repositorio concreto
  const service = new SApiHealthcheck(new HealthcheckRepository());

  const validate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setIsValid(null);
    setHealthcheck(null);
    try {
      const result = await service.check();
      setHealthcheck(result);
      setIsValid(result.status === 'ok');
      setError(null);
    } catch (err) {
      setIsValid(false);
      setHealthcheck(null);
      setError('No se pudo validar la API. Verifica que el backend esté accesible.');
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  return { healthcheck, isValid, isLoading, error, validate };
};

export default useApiHealthcheck;
