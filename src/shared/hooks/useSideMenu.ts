import { useState, useCallback } from 'react';

/**
 * Hook personalizado para manejar el estado del menú lateral
 * Proporciona funciones para abrir, cerrar y alternar el menú
 *
 * @param initialVisible - Estado inicial del menú (por defecto false)
 * @returns Objeto con el estado y funciones de control del menú
 */
export const useSideMenu = (initialVisible: boolean = false) => {
  const [isVisible, setIsVisible] = useState(initialVisible);

  const openMenu = useCallback(() => {
    setIsVisible(true);
  }, []);

  const closeMenu = useCallback(() => {
    setIsVisible(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsVisible(prev => !prev);
  }, []);

  return {
    isVisible,
    openMenu,
    closeMenu,
    toggleMenu,
    setIsVisible,
  };
};
